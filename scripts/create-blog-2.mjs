import fs from 'fs';
import path from 'path';

// ==========================================
// CONFIGURATION
// ==========================================
const API_BASE_URL = 'https://rentaltech.premiumasp.net';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InBvbGE1c2FteTU1QGdtYWlsLmNvbSIsInVzZXJJZCI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsInVzZXJOYW1lIjoicG9sYSIsImZ1bGxOYW1lIjoicG9sYSBwb2xhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc5MDc4NTk1OSwiaXNzIjoiUHJvcGVydHlNYW5hZ2VtZW50QVBJIiwiYXVkIjoiUHJvcGVydHlNYW5hZ2VtZW50Q2xpZW50cyJ9.IKn1lX_9Lou7CDX92L1fbyAciNqxv_baz4-jCWeYg4k';

// IMPORTANT: Adjust paths as needed when running locally
const PHOTOS_DIR = 'C:\\Users\\VIP\\Desktop\\work\\rental-website\\photos';
const USED_PHOTOS_DIR = path.join(PHOTOS_DIR, 'usedPhotos');

const createFormDataWithFile = (payload, fileKey, filePath) => {
  const formData = new FormData();
  
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  if (filePath && fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const file = new File([buffer], filename, { type: 'image/jpeg' });
    formData.append(fileKey, file);
  }

  return formData;
};

async function run() {
  console.log('Creating 2nd main blog post...');
  
  const payload = {
    'Title.En': 'The Ultimate Guide to Exploring Hurghada: Top Attractions and Hidden Gems',
    'Title.Fr': 'Le Guide Ultime pour Explorer Hurghada : Attractions Principales et Trésors Cachés',
    'Title.De': 'Der ultimative Guide für Hurghada: Top-Attraktionen und Geheimtipps',
    'Title.Ru': 'Идеальный путеводитель по Хургаде: Главные достопримечательности и скрытые жемчужины',
    
    'Summary.En': 'Planning a trip to the Red Sea? Discover the best things to do in Hurghada, from world-class snorkeling spots and bustling local markets to relaxing beach days.',
    'Summary.Fr': 'Vous planifiez un voyage sur la mer Rouge ? Découvrez les meilleures choses à faire à Hurghada, des sites de plongée de classe mondiale aux marchés locaux animés, en passant par des journées de détente à la plage.',
    'Summary.De': 'Planen Sie eine Reise ans Rote Meer? Entdecken Sie die besten Aktivitäten in Hurghada, von erstklassigen Schnorchelplätzen und belebten lokalen Märkten bis hin zu entspannten Strandtagen.',
    'Summary.Ru': 'Планируете поездку на Красное море? Откройте для себя лучшие развлечения в Хургаде: от мест для снорклинга мирового класса и шумных местных рынков до расслабляющих дней на пляже.',
    
    'Content.En': 'Hurghada is much more than just a place to stay; it is a vibrant coastal city filled with adventure, culture, and relaxation. While your vacation home offers the perfect base, stepping outside reveals a world of crystal-clear waters, stunning desert landscapes, and authentic Egyptian hospitality. Whether you are an adrenaline junkie or looking for a peaceful escape, this guide covers everything you need to see and do during your stay.',
    'Content.Fr': 'Hurghada est bien plus qu’un simple lieu de séjour ; c’est une ville côtière vibrante, pleine d’aventure, de culture et de détente. Bien que votre maison de vacances soit le point de départ idéal, sortir révèle un monde d’eaux cristallines, de paysages désertiques époustouflants et d’hospitalité égyptienne authentique. Que vous soyez un amateur de sensations fortes ou à la recherche d’une escapade paisible, ce guide couvre tout ce que vous devez voir et faire pendant votre séjour.',
    'Content.De': 'Hurghada ist weit mehr als nur ein Aufenthaltsort; es ist eine pulsierende Küstenstadt voller Abenteuer, Kultur und Entspannung. Während Ihr Ferienhaus den perfekten Ausgangspunkt bietet, offenbart sich draußen eine Welt aus kristallklarem Wasser, atemberaubenden Wüstenlandschaften und authentischer ägyptischer Gastfreundschaft. Egal, ob Sie Adrenalinjunkie sind oder eine friedliche Flucht suchen, dieser Guide deckt alles ab, was Sie während Ihres Aufenthalts sehen und tun müssen.',
    'Content.Ru': 'Хургада — это гораздо больше, чем просто место для ночлега; это яркий прибрежный город, полный приключений, культуры и отдыха. Хотя ваш дом для отпуска предлагает идеальную базу, выход на улицу открывает мир кристально чистой воды, потрясающих пустынных пейзажей и аутентичного египетского гостеприимства. Независимо от того, являетесь ли вы любителем адреналина или ищете спокойного отдыха, этот путеводитель охватывает все, что вам нужно увидеть и сделать во время вашего пребывания.',
    
    'IsPublished': 'true',
    'DisplayOrder': '2'
  };

  const heroImage = path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.17 PM (1).jpeg');
  const formData = createFormDataWithFile(payload, 'FeaturedImage', heroImage);

  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      },
      body: formData
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.log("Raw Response:", text);
      throw err;
    }
    if (!res.ok || !data.isSuccess) {
      throw new Error(JSON.stringify(data));
    }
    
    const blogId = data.data.id;
    console.log('2nd Main blog created successfully with ID:', blogId);
    
    // Create sections and move images
    await createSectionsAndMoveImages(blogId, heroImage);

  } catch (e) {
    console.error('Error creating 2nd main blog:', e.message);
  }
}

async function createSectionsAndMoveImages(blogId, heroImage) {
  const sections = [
    {
      payload: {
        'Title.En': 'Dive into the Red Sea',
        'Title.Fr': 'Plongez dans la Mer Rouge',
        'Title.De': 'Tauchen Sie ein ins Rote Meer',
        'Title.Ru': 'Погружение в Красное море',
        'Content.En': 'The Red Sea is globally renowned for its spectacular coral reefs and diverse marine life. You don’t have to be an expert scuba diver to enjoy it—grab a snorkel and take a boat trip to Giftun Island or Orange Bay. The warm, clear waters are home to colorful fish, dolphins, and turtles, making it a truly unforgettable experience.',
        'Content.Fr': 'La mer Rouge est mondialement connue pour ses spectaculaires récifs coralliens et sa vie marine diversifiée. Nul besoin d’être un plongeur expert pour en profiter : prenez un tuba et faites une excursion en bateau vers l’île de Giftun ou Orange Bay. Les eaux chaudes et claires abritent des poissons colorés, des dauphins et des tortues, pour une expérience inoubliable.',
        'Content.De': 'Das Rote Meer ist weltweit bekannt für seine spektakulären Korallenriffe und die vielfältige Unterwasserwelt. Sie müssen kein erfahrener Taucher sein, um es zu genießen – schnappen Sie sich einen Schnorchel und machen Sie einen Bootsausflug zur Insel Giftun oder zur Orange Bay. Das warme, klare Wasser ist die Heimat von bunten Fischen, Delfinen und Schildkröten.',
        'Content.Ru': 'Красное море всемирно известно своими впечатляющими коралловыми рифами и разнообразной морской жизнью. Вам не нужно быть опытным дайвером, чтобы насладиться им — берите маску и отправляйтесь на лодочную экскурсию на остров Гифтун или Оранж-Бей. В теплых чистых водах обитают красочные рыбы, дельфины и черепахи.',
        'DisplayOrder': '1',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.17 PM (2).jpeg')
    },
    {
      payload: {
        'Title.En': 'Explore the Hurghada Marina',
        'Title.Fr': 'Explorez la Marina d’Hurghada',
        'Title.De': 'Erkunden Sie die Marina von Hurghada',
        'Title.Ru': 'Исследуйте Марину Хургады',
        'Content.En': 'For a touch of luxury and a relaxing evening stroll, head to the Hurghada Marina. This beautiful promenade is lined with upscale restaurants, cozy cafes, and boutique shops. It’s the perfect spot to watch the sunset over the yachts while enjoying fresh seafood and traditional Egyptian tea.',
        'Content.Fr': 'Pour une touche de luxe et une promenade relaxante en soirée, rendez-vous à la Marina d’Hurghada. Cette magnifique promenade est bordée de restaurants chics, de cafés confortables et de boutiques. C’est l’endroit idéal pour admirer le coucher de soleil sur les yachts tout en dégustant des fruits de mer frais.',
        'Content.De': 'Für einen Hauch von Luxus und einen entspannten Abendspaziergang besuchen Sie die Marina von Hurghada. Diese wunderschöne Promenade ist gesäumt von gehobenen Restaurants, gemütlichen Cafés und Boutiquen. Es ist der perfekte Ort, um den Sonnenuntergang über den Yachten zu beobachten, während Sie frische Meeresfrüchte genießen.',
        'Content.Ru': 'Для роскошного и расслабляющего вечернего променада отправляйтесь в Марину Хургады. Эта красивая набережная усажена высококлассными ресторанами, уютными кафе и бутиками. Это идеальное место, чтобы полюбоваться закатом над яхтами, наслаждаясь свежими морепродуктами и традиционным чаем.',
        'DisplayOrder': '2',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.17 PM (3).jpeg')
    },
    {
      payload: {
        'Title.En': 'Discover the Old Town (El Dahar)',
        'Title.Fr': 'Découvrez la Vieille Ville (El Dahar)',
        'Title.De': 'Entdecken Sie die Altstadt (El Dahar)',
        'Title.Ru': 'Откройте для себя Старый город (Эль-Дахар)',
        'Content.En': 'If you want to experience the authentic, everyday life of the city, take a trip to El Dahar, Hurghada’s oldest district. Here you will find bustling souks (markets) selling everything from fresh spices and fruits to handmade crafts. Don’t forget to practice your bargaining skills and pick up a unique souvenir.',
        'Content.Fr': 'Si vous souhaitez découvrir la vie quotidienne authentique de la ville, rendez-vous à El Dahar, le plus vieux quartier d’Hurghada. Vous y trouverez des souks animés vendant de tout, des épices fraîches à l’artisanat local. N’oubliez pas de pratiquer vos talents de négociateur pour acheter un souvenir unique.',
        'Content.De': 'Wenn Sie das authentische, alltägliche Leben der Stadt erleben möchten, machen Sie einen Ausflug nach El Dahar, dem ältesten Viertel von Hurghada. Hier finden Sie belebte Souks (Märkte), die alles von frischen Gewürzen bis hin zu handgefertigtem Kunsthandwerk verkaufen. Vergessen Sie nicht, Ihr Verhandlungsgeschick zu üben.',
        'Content.Ru': 'Если вы хотите прочувствовать аутентичную, повседневную жизнь города, отправляйтесь в Эль-Дахар, старейший район Хургады. Здесь вы найдете шумные рынки, где продается всё — от свежих специй до изделий ручной работы. Не забудьте потренировать свои навыки торга и купить уникальный сувенир.',
        'DisplayOrder': '3',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.17 PM.jpeg')
    },
    {
      payload: {
        'Title.En': 'Desert Safari Adventures',
        'Title.Fr': 'Aventures en Safari dans le Désert',
        'Title.De': 'Wüsten-Safari-Abenteuer',
        'Title.Ru': 'Приключения на сафари в пустыне',
        'Content.En': 'Beyond the beach lies the vast and mystical Eastern Desert. Book a desert safari to ride quad bikes over rolling sand dunes, meet local Bedouin tribes, and enjoy a traditional barbecue dinner under the starry night sky. It is a thrilling contrast to the calm waters of the coast.',
        'Content.Fr': 'Au-delà de la plage s’étend le vaste et mystique désert oriental. Réservez un safari dans le désert pour faire du quad sur les dunes, rencontrer des tribus bédouines locales et profiter d’un dîner barbecue traditionnel sous les étoiles. C’est un contraste saisissant avec les eaux calmes de la côte.',
        'Content.De': 'Jenseits des Strandes liegt die weite und mystische Arabische Wüste. Buchen Sie eine Wüstensafari, um mit dem Quad über Sanddünen zu fahren, lokale Beduinenstämme zu treffen und ein traditionelles Barbecue-Abendessen unter dem Sternenhimmel zu genießen. Es ist ein aufregender Kontrast zum ruhigen Wasser der Küste.',
        'Content.Ru': 'За пляжем простирается бескрайняя и мистическая Восточная пустыня. Закажите сафари по пустыне, чтобы покататься на квадроциклах по песчаным дюнам, встретиться с местными племенами бедуинов и насладиться традиционным ужином-барбекю под звездным ночным небом. Это захватывающий контраст со спокойными водами побережья.',
        'DisplayOrder': '4',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.18 PM.jpeg')
    }
  ];

  for (let i = 0; i < sections.length; i++) {
    console.log(`Creating section ${i + 1}...`);
    const formData = createFormDataWithFile(sections[i].payload, 'Image', sections[i].image);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/sections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.isSuccess) {
        throw new Error(JSON.stringify(data));
      }
      console.log(`Section ${i + 1} created successfully.`);
    } catch (e) {
      console.error(`Error creating section ${i + 1}:`, e.message);
    }
  }

  console.log('Moving used photos...');
  if (!fs.existsSync(USED_PHOTOS_DIR)) {
    fs.mkdirSync(USED_PHOTOS_DIR, { recursive: true });
  }

  const usedImages = [heroImage, ...sections.map(s => s.image)];
  for (const image of usedImages) {
    if (fs.existsSync(image)) {
      const newPath = path.join(USED_PHOTOS_DIR, path.basename(image));
      try {
        fs.renameSync(image, newPath);
        console.log(`Moved ${path.basename(image)} to usedPhotos`);
      } catch (err) {
        console.error(`Failed to move ${image}:`, err);
      }
    }
  }
}

// Start Execution
run();
