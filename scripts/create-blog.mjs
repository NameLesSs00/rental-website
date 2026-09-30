import fs from 'fs';
import path from 'path';

// ==========================================
// CONFIGURATION
// ==========================================
const API_BASE_URL = 'https://rentaltech.premiumasp.net';
const TOKEN = 'YOUR_BEARER_TOKEN_HERE';

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
  console.log('Creating main blog post...');
  
  const payload = {
    'Title.En': 'Why a Vacation Home in Hurghada is Better Than a Hotel',
    'Title.Fr': 'Pourquoi une location de vacances à Hurghada est préférable à un hôtel',
    'Title.De': 'Warum ein Ferienhaus in Hurghada besser ist als ein Hotel',
    'Title.Ru': 'Почему дом для отпуска в Хургаде лучше отеля',
    'Summary.En': 'Discover the benefits of booking a private vacation rental in Hurghada over a traditional resort. Enjoy more space, privacy, and true local experiences on your Red Sea holiday.',
    'Summary.Fr': "Découvrez les avantages de réserver une location de vacances privée à Hurghada par rapport à un complexe hôtelier traditionnel. Profitez de plus d'espace, d'intimité et d'expériences locales authentiques lors de vos vacances au bord de la mer Rouge.",
    'Summary.De': 'Entdecken Sie die Vorteile der Buchung eines privaten Ferienhauses in Hurghada im Vergleich zu einem traditionellen Resort. Genießen Sie mehr Platz, Privatsphäre und authentische lokale Erlebnisse in Ihrem Urlaub am Roten Meer.',
    'Summary.Ru': 'Откройте для себя преимущества бронирования частного дома для отпуска в Хургаде по сравнению с традиционным курортом. Наслаждайтесь большим пространством, уединением и настоящим местным колоритом во время отдыха на Красном море.',
    'Content.En': 'Hurghada has long been known for its bustling all-inclusive resorts, but savvy travelers are discovering a much better way to experience the beautiful Red Sea coast. Booking a private vacation home offers a level of comfort, flexibility, and authenticity that traditional hotels simply cannot match. Whether you are traveling as a couple, a family, or a group of friends, here is why a holiday apartment or chalet should be your top choice for your next Hurghada getaway.',
    'Content.Fr': "Hurghada a longtemps été connue pour ses complexes touristiques tout compris très animés, mais les voyageurs avisés découvrent une bien meilleure façon de profiter de la magnifique côte de la mer Rouge. Réserver une location de vacances privée offre un niveau de confort, de flexibilité et d'authenticité que les hôtels traditionnels ne peuvent tout simplement pas égaler. Que vous voyagiez en couple, en famille ou avec un groupe d'amis, voici pourquoi un appartement ou un chalet de vacances devrait être votre premier choix pour votre prochaine escapade à Hurghada.",
    'Content.De': 'Hurghada ist seit langem für seine belebten All-Inclusive-Resorts bekannt, aber clevere Reisende entdecken eine viel bessere Möglichkeit, die wunderschöne Küste des Roten Meeres zu erleben. Die Buchung eines privaten Ferienhauses bietet ein Maß an Komfort, Flexibilität und Authentizität, das traditionelle Hotels einfach nicht bieten können. Egal, ob Sie als Paar, Familie oder mit einer Gruppe von Freunden reisen – hier erfahren Sie, warum eine Ferienwohnung oder ein Chalet Ihre erste Wahl für Ihren nächsten Kurzurlaub in Hurghada sein sollte.',
    'Content.Ru': 'Хургада уже давно известна своими шумными курортами по системе "всё включено", но опытные путешественники открывают для себя гораздо лучший способ насладиться прекрасным побережьем Красного моря. Бронирование частного дома для отпуска предлагает уровень комфорта, гибкости и аутентичности, с которым традиционные отели просто не могут сравниться. Путешествуете ли вы парой, семьей или с группой друзей, вот почему апартаменты или шале для отпуска должны стать вашим лучшим выбором для следующей поездки в Хургаду.',
    'IsPublished': 'true',
    'DisplayOrder': '1'
  };

  const heroImage = path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.26 PM (1).jpeg');
  const formData = createFormDataWithFile(payload, 'FeaturedImage', heroImage);

  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs`, {
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
    
    const blogId = data.data.id;
    console.log('Main blog created successfully with ID:', blogId);
    
    // Create sections and move images
    await createSectionsAndMoveImages(blogId, heroImage);

  } catch (e) {
    console.error('Error creating main blog:', e.message);
  }
}

async function createSectionsAndMoveImages(blogId, heroImage) {
  const sections = [
    {
      payload: {
        'Title.En': 'Unmatched Space and Privacy',
        'Title.Fr': "Un espace et une intimité inégalés",
        'Title.De': 'Unvergleichlicher Platz und Privatsphäre',
        'Title.Ru': 'Непревзойденное пространство и уединение',
        'Content.En': 'Forget being confined to a single room. Vacation homes offer separate bedrooms, spacious living areas, and private balconies where you can unwind without sharing walls with hundreds of other guests. It’s your own private sanctuary after a long day of diving or sunbathing.',
        'Content.Fr': "Oubliez l'enfermement dans une seule chambre. Les locations de vacances offrent des chambres séparées, des espaces de vie spacieux et des balcons privés où vous pourrez vous détendre sans partager les murs avec des centaines d'autres clients. C'est votre propre sanctuaire privé après une longue journée de plongée ou de bronzage.",
        'Content.De': 'Vergessen Sie, auf ein einziges Zimmer beschränkt zu sein. Ferienhäuser bieten separate Schlafzimmer, geräumige Wohnbereiche und private Balkone, auf denen Sie entspannen können, ohne die Wände mit Hunderten von anderen Gästen zu teilen. Es ist Ihr ganz privater Rückzugsort nach einem langen Tag voller Tauchen oder Sonnenbaden.',
        'Content.Ru': 'Забудьте о необходимости ютиться в одном номере. Дома для отпуска предлагают отдельные спальни, просторные гостиные и частные балконы, где вы можете расслабиться, не деля стены с сотнями других гостей. Это ваше собственное личное убежище после долгого дня дайвинга или принятия солнечных ванн.',
        'DisplayOrder': '1',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.26 PM (2).jpeg')
    },
    {
      payload: {
        'Title.En': 'Cost-Effective for Families and Groups',
        'Title.Fr': 'Rentable pour les familles et les groupes',
        'Title.De': 'Kostengünstig für Familien und Gruppen',
        'Title.Ru': 'Экономично для семей и групп',
        'Content.En': 'Booking multiple hotel rooms for a family or a group of friends can quickly drain your holiday budget. A spacious 2-bedroom apartment or chalet allows everyone to stay together comfortably under one roof, often at a fraction of the cost per person compared to a resort.',
        'Content.Fr': "Réserver plusieurs chambres d'hôtel pour une famille ou un groupe d'amis peut rapidement épuiser votre budget de vacances. Un appartement spacieux de 2 chambres ou un chalet permet à tout le monde de séjourner ensemble confortablement sous un même toit, souvent pour une fraction du coût par personne par rapport à un complexe hôtelier.",
        'Content.De': 'Die Buchung mehrerer Hotelzimmer für eine Familie oder eine Gruppe von Freunden kann die Urlaubskasse schnell leeren. In einem geräumigen 2-Zimmer-Apartment oder Chalet können alle bequem unter einem Dach wohnen, oft zu einem Bruchteil der Kosten pro Person im Vergleich zu einem Resort.',
        'Content.Ru': 'Бронирование нескольких гостиничных номеров для семьи или группы друзей может быстро опустошить ваш бюджет на отпуск. Просторные апартаменты с 2 спальнями или шале позволяют всем комфортно разместиться под одной крышей, часто за небольшую часть стоимости на человека по сравнению с курортом.',
        'DisplayOrder': '2',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.26 PM (3).jpeg')
    },
    {
      payload: {
        'Title.En': 'The Convenience of a Fully Equipped Kitchen',
        'Title.Fr': "La commodité d'une cuisine entièrement équipée",
        'Title.De': 'Der Komfort einer voll ausgestatteten Küche',
        'Title.Ru': 'Удобство полностью оборудованной кухни',
        'Content.En': 'While dining out in Hurghada is fantastic, eating at restaurants for every single meal can be exhausting and expensive. Having your own fully equipped kitchen means you can store fresh local fruit, prepare your own breakfast, or cook a late-night snack whenever you want.',
        'Content.Fr': "Bien que dîner au restaurant à Hurghada soit fantastique, manger au restaurant pour chaque repas peut être épuisant et coûteux. Avoir votre propre cuisine entièrement équipée signifie que vous pouvez stocker des fruits locaux frais, préparer votre propre petit-déjeuner ou cuisiner une collation de fin de soirée quand vous le souhaitez.",
        'Content.De': 'Während das Essen in Hurghada fantastisch ist, kann es anstrengend und teuer sein, für jede einzelne Mahlzeit in Restaurants zu essen. Mit einer eigenen voll ausgestatteten Küche können Sie frisches lokales Obst lagern, Ihr eigenes Frühstück zubereiten oder sich einen späten Snack kochen, wann immer Sie möchten.',
        'Content.Ru': 'Хотя ужинать в Хургаде прекрасно, питаться в ресторанах при каждом приеме пищи может быть утомительно и дорого. Наличие собственной полностью оборудованной кухни означает, что вы можете хранить свежие местные фрукты, готовить собственный завтрак или делать поздний ужин, когда захотите.',
        'DisplayOrder': '3',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.26 PM (4).jpeg')
    },
    {
      payload: {
        'Title.En': 'Live Like a Local in Prime Spots',
        'Title.Fr': 'Vivez comme un local dans des endroits de choix',
        'Title.De': 'Leben wie ein Einheimischer in bester Lage',
        'Title.Ru': 'Живите как местный в лучших районах',
        'Content.En': 'Our properties are located in some of Hurghada\'s best residential and coastal areas, like El Kawther. Instead of being isolated in a tourist bubble, you get to experience the city like a true local—shopping at nearby markets, visiting authentic cafes, and discovering hidden gems just steps from your door.',
        'Content.Fr': "Nos propriétés sont situées dans certains des meilleurs quartiers résidentiels et côtiers d'Hurghada, comme El Kawther. Au lieu d'être isolé dans une bulle touristique, vous pouvez découvrir la ville comme un vrai local : faire du shopping sur les marchés à proximité, visiter des cafés authentiques et découvrir des trésors cachés à quelques pas de votre porte.",
        'Content.De': 'Unsere Immobilien befinden sich in einigen der besten Wohn- und Küstengebieten Hurghadas, wie El Kawther. Anstatt in einer Touristenblase isoliert zu sein, können Sie die Stadt wie ein wahrer Einheimischer erleben – auf nahegelegenen Märkten einkaufen, authentische Cafés besuchen und versteckte Juwelen nur wenige Schritte von Ihrer Tür entfernt entdecken.',
        'Content.Ru': 'Наши объекты расположены в одних из лучших жилых и прибрежных районов Хургады, таких как Эль-Каусер. Вместо того, чтобы быть изолированными в туристическом пузыре, вы сможете ощутить город как настоящий местный житель — делать покупки на близлежащих рынках, посещать аутентичные кафе и открывать для себя скрытые сокровища всего в нескольких шагах от вашей двери.',
        'DisplayOrder': '4',
        'SectionType': 'text'
      },
      image: path.join(PHOTOS_DIR, 'WhatsApp Image 2026-09-24 at 5.04.27 PM.jpeg')
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
