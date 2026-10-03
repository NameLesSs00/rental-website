// ── Property Buying Category Types ──────────────────────────────────────────────

import type { TranslationInput } from "@/lib/i18n/adminTranslations";

export interface PropertyBuyingCategoryItem {
  id: string;
  propertyBuyingCategoryId: string;
  name: string;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  isDefault: boolean;
}

export interface PropertyBuyingCategory {
  id: string;
  name: string;
  icon: string | null;
  defaultIcon: string | null;
  displayOrder: number;
  isActive: boolean;
  isDefault: boolean;
  items: PropertyBuyingCategoryItem[];
}

export interface PropertyBuyingCategoryRequest {
  id?: string;
  name: TranslationInput;
  icon?: string;
  defaultIcon?: string;
  displayOrder?: number;
}

export interface PropertyBuyingCategoryItemRequest {
  id?: string;
  propertyBuyingCategoryId?: string;
  name?: TranslationInput;
  icon?: string;
  displayOrder?: number;
}

export interface PropertyBuyingCategoryApiResponse<T = PropertyBuyingCategory> {
  data: T | null;
  isSuccess: boolean;
  message: string | null;
  errors: string[];
  type: number;
}
