const API_BASE_URL = process.env.API_BASE_URL || "https://rentaltech.premiumasp.net";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const locales = ["en", "fr", "de", "ru"];
const shouldApply = process.argv.includes("--apply");
const shouldUpdateExisting = process.argv.includes("--update-existing");

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function toQuery(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) query.set(key, String(value));
  }
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

async function api(path, { method = "GET", params, body, locale, auth = false } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (locale) {
    headers["Accept-Language"] = locale;
    headers["X-Locale"] = locale;
  }
  if (auth) {
    if (!ADMIN_TOKEN) {
      throw new Error("ADMIN_TOKEN is required for write operations.");
    }
    headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}${toQuery(params)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
  }

  if (!response.ok) {
    const message = json?.errors?.join(", ") || json?.message || text || response.statusText;
    throw new Error(`${method} ${path} failed (${response.status}): ${message}`);
  }

  return json;
}

function unwrap(response, fallback) {
  return response?.data ?? fallback;
}

async function fetchRentCategoryRecords(categoryId) {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const response = await api(`/api/properties/categories/${categoryId}`, {
        params: { includeItems: true, onlyActive: false },
        locale,
      });
      const category = unwrap(response, null);
      if (!category) throw new Error(`Rent category ${categoryId} did not load for ${locale}`);
      return [locale, category];
    })
  );
  return Object.fromEntries(entries);
}

async function fetchBuyData() {
  const [categoryResponse, itemResponse] = await Promise.all([
    api("/api/property-buying/categories", {
      params: { includeItems: true, onlyActive: false },
      locale: "en",
    }),
    api("/api/property-buying/category-items", {
      params: { onlyActive: false },
      locale: "en",
    }),
  ]);

  return {
    categories: unwrap(categoryResponse, []),
    items: unwrap(itemResponse, []),
  };
}

function translationFromRecords(records, selector) {
  return Object.fromEntries(
    locales.map((locale) => [locale, selector(records[locale]) || selector(records.en) || ""])
  );
}

function buildItemTranslations(categoryRecords, itemId) {
  return Object.fromEntries(
    locales.map((locale) => {
      const localizedItem = categoryRecords[locale]?.items?.find((item) => item.id === itemId);
      const fallbackItem = categoryRecords.en?.items?.find((item) => item.id === itemId);
      return [locale, localizedItem?.name || fallbackItem?.name || ""];
    })
  );
}

function buildLookups(buyCategories, buyItems) {
  const categoriesByName = new Map();
  const categoryConflicts = [];

  for (const category of buyCategories) {
    const key = normalizeName(category.name);
    if (!key) continue;
    if (categoriesByName.has(key)) {
      categoryConflicts.push(category.name);
      continue;
    }
    categoriesByName.set(key, category);
  }

  const itemsByCategoryAndName = new Map();
  const itemConflicts = [];
  for (const item of buyItems) {
    const categoryId = item.propertyBuyingCategoryId;
    const key = `${categoryId}::${normalizeName(item.name)}`;
    if (!categoryId || !normalizeName(item.name)) continue;
    if (itemsByCategoryAndName.has(key)) {
      itemConflicts.push(`${categoryId} / ${item.name}`);
      continue;
    }
    itemsByCategoryAndName.set(key, item);
  }

  return { categoriesByName, itemsByCategoryAndName, categoryConflicts, itemConflicts };
}

async function main() {
  console.log(`Mode: ${shouldApply ? "APPLY" : "DRY RUN"}`);
  console.log(`API: ${API_BASE_URL}`);
  console.log("");

  const rentCategoriesResponse = await api("/api/properties/categories", {
    params: { includeItems: true, onlyActive: false },
    locale: "en",
  });
  const rentCategories = unwrap(rentCategoriesResponse, []);
  const rentCategoryRecords = new Map();

  for (const category of rentCategories) {
    rentCategoryRecords.set(category.id, await fetchRentCategoryRecords(category.id));
  }

  let buyData = await fetchBuyData();
  let lookups = buildLookups(buyData.categories, buyData.items);

  const categoryCreates = [];
  const categoryUpdates = [];
  const categorySkips = [];
  const createdCategoryIdsBySourceId = new Map();

  for (const rentCategory of rentCategories) {
    const records = rentCategoryRecords.get(rentCategory.id);
    const existing = lookups.categoriesByName.get(normalizeName(records.en.name));
    const payload = {
      name: translationFromRecords(records, (record) => record.name),
      icon: records.en.icon || undefined,
      defaultIcon: records.en.defaultIcon || undefined,
      displayOrder: records.en.displayOrder ?? undefined,
    };

    if (!existing) {
      categoryCreates.push({ source: records.en, payload });
      if (shouldApply) {
        const response = await api("/api/property-buying/categories", {
          method: "POST",
          body: payload,
          auth: true,
        });
        const created = unwrap(response, null);
        if (created?.id) createdCategoryIdsBySourceId.set(rentCategory.id, created.id);
      }
    } else if (shouldUpdateExisting) {
      categoryUpdates.push({ source: records.en, target: existing, payload });
      if (shouldApply) {
        await api(`/api/property-buying/categories/${existing.id}`, {
          method: "PUT",
          body: { ...payload, id: existing.id },
          auth: true,
        });
      }
    } else {
      categorySkips.push({ source: records.en, target: existing });
    }
  }

  if (shouldApply && categoryCreates.length > 0) {
    buyData = await fetchBuyData();
    lookups = buildLookups(buyData.categories, buyData.items);
  }

  const itemCreates = [];
  const itemUpdates = [];
  const itemSkips = [];
  const missingCategoryItems = [];

  for (const rentCategory of rentCategories) {
    const records = rentCategoryRecords.get(rentCategory.id);
    let targetCategory =
      lookups.categoriesByName.get(normalizeName(records.en.name)) ||
      buyData.categories.find((category) => category.id === createdCategoryIdsBySourceId.get(rentCategory.id));

    if (!targetCategory && !shouldApply && categoryCreates.some(({ source }) => source.id === rentCategory.id)) {
      targetCategory = { id: `new:${rentCategory.id}`, name: records.en.name };
    }

    if (!targetCategory) {
      missingCategoryItems.push(records.en.name);
      continue;
    }

    for (const item of records.en.items || []) {
      const itemName = item.name || "";
      const existing = lookups.itemsByCategoryAndName.get(`${targetCategory.id}::${normalizeName(itemName)}`);
      const payload = {
        propertyBuyingCategoryId: targetCategory.id,
        name: buildItemTranslations(records, item.id),
        icon: item.icon || undefined,
        displayOrder: item.displayOrder ?? undefined,
      };

      if (!existing) {
        itemCreates.push({ source: item, sourceCategory: records.en, targetCategory, payload });
        if (shouldApply) {
          await api("/api/property-buying/category-items", {
            method: "POST",
            body: payload,
            auth: true,
          });
        }
      } else if (shouldUpdateExisting) {
        itemUpdates.push({ source: item, sourceCategory: records.en, target: existing, payload });
        if (shouldApply) {
          await api(`/api/property-buying/category-items/${existing.id}`, {
            method: "PUT",
            body: { ...payload, id: existing.id },
            auth: true,
          });
        }
      } else {
        itemSkips.push({ source: item, sourceCategory: records.en, target: existing });
      }
    }
  }

  console.log("Summary");
  console.log(`- Rent categories read: ${rentCategories.length}`);
  console.log(`- Buy categories currently read: ${buyData.categories.length}`);
  console.log(`- Categories to create: ${categoryCreates.length}`);
  console.log(`- Categories to update: ${categoryUpdates.length}`);
  console.log(`- Categories already existing: ${categorySkips.length}`);
  console.log(`- Items to create: ${itemCreates.length}`);
  console.log(`- Items to update: ${itemUpdates.length}`);
  console.log(`- Items already existing: ${itemSkips.length}`);
  console.log(`- Category name conflicts in buy data: ${lookups.categoryConflicts.length}`);
  console.log(`- Item name conflicts in buy data: ${lookups.itemConflicts.length}`);
  console.log("");

  if (categoryCreates.length > 0) {
    console.log("Categories to create:");
    categoryCreates.forEach(({ source }) => console.log(`- ${source.name}`));
    console.log("");
  }

  if (itemCreates.length > 0) {
    console.log("Items to create:");
    itemCreates.forEach(({ source, sourceCategory }) => console.log(`- ${sourceCategory.name} > ${source.name}`));
    console.log("");
  }

  if (missingCategoryItems.length > 0) {
    console.log("Items skipped because target category was missing:");
    [...new Set(missingCategoryItems)].forEach((name) => console.log(`- ${name}`));
    console.log("");
  }

  if (lookups.categoryConflicts.length > 0 || lookups.itemConflicts.length > 0) {
    console.log("Conflicts detected. Resolve these before applying if they affect the sync.");
  }

  console.log(shouldApply ? "Apply complete." : "Dry run complete. Re-run with --apply to write changes.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
