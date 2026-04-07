import type { SectionTranslations } from '../types';

export const defaultData: SectionTranslations = {
  id: 'default',
  btnLabel: { en: '', ru: '', am: '' },
  content: {
    en: {
      title: 'Welcome to the Future Workspace',
      subtitle: 'Experience premium quality',
      description: [
        'Discover an environment built for performance. Our facilities integrate striking design with unmatched functionality.',
        'Whether you are an individual professional or a growing team, we have the perfect space for you.'
      ],
      slides: [
        { imageUrl: 'images/default/image1.jpg', title: 'Main Workspace', subtitle: 'Experience the premium environment' },
        { imageUrl: 'images/default/image2.jpg', title: 'Meeting Rooms', subtitle: 'Equipped with top tech' },
        {
          imageUrl: 'images/default/image3.jpg',
          title: 'Interesting Facts',
          stats: [
            { value: '80+', label: 'rooms' },
            { value: '7000m²', label: 'total area' },
            { value: '100+', label: 'outdoor parking spots' }
          ]
        }
      ]
    },
    ru: {
      title: 'Добро пожаловать в рабочее пространство будущего',
      subtitle: 'Оцените премиальное качество',
      description: [
        'Откройте для себя среду, созданную для высокой производительности. Наши объекты сочетают поразительный дизайн с непревзойденной функциональностью.',
        'Являетесь ли вы индивидуальным профессионалом или растущей командой, у нас есть идеальное пространство для вас.'
      ],
      slides: [
        { imageUrl: 'images/default/image1.jpg', title: 'Главное Пространство', subtitle: 'Оцените премиальную среду' },
        { imageUrl: 'images/default/image2.jpg', title: 'Переговорные', subtitle: 'Оснащены передовыми технологиями' },
        {
          imageUrl: 'images/default/image3.jpg',
          title: 'Интересные факты',
          stats: [
            { value: '80+', label: 'офисов' },
            { value: '7000м²', label: 'общая площадь' },
            { value: '100+', label: 'открытая парковка' }
          ]
        }
      ]
    },
    am: {
      title: 'Բարի գալուստ',
      subtitle: 'UP&UP բիզնես կենտրոնը կառուցվել և հանձնվել է շահագործման 2024 թվականին։',
      description: [
        'Բիզնես կենտրոնն ռաջարկում է 15-ից 332քմ լուսավոր և հարմարավետ գրասենյակային տարածքներ։ Գտնվում է Աջափնյակ վարչական շրջանում՝ Երևանի կենտրոնից ընդամենը 7կմ հեռավորության վրա՝ հյուսիս-հարավ մայրուղու առաջին գիծ։ Նոր, պրեմիում դասի բիզնես կենտրոն՝ հագեցած նորագույն տեխնոլոգիաներով և ժամանակակից դիզայնով։',
        'Այն առաջին բիզնես կենտրոնն է Երևանում կառուցված բացառապես ՏՏ ոլորտի ընկերությունների համար։ Համալրված է ժամանակակից կոմունիկացիոն ցանցով, երկու ռեզերվային գծով և 24/7 անվտանգության համակարգով, որը ներառում է տեսահսկում, հակահրդեհային, ձայնազդանշանային համակարգ, մուտքի հսկողության (face և finger control) և պահնորդական ծառայություն։ Առկա են ստորգետնյա և բացօթյա կայանատեղիներ, էլեկտրոմոբիլների արագ լիցքավորման կայաններ և ավտոլվացման կետ։'
      ],
      slides: [
        {
          imageUrl: 'images/default/image1.jpg',
          topText: 'նոր, պրեմիում A դասի',
          title: 'բիզնես կենտրոն Երևանում',
          subtitle: 'որտեղ նորարարությունը հանդիպում է հնարավորություններին'
        },
        {
          imageUrl: 'images/default/image2.jpg',
          topText: 'UP&UP բիզնես կենտրոնն առաջարկում է',
          title: '25քմ-335քմ',
          subtitle: 'գրասենյակային տարածքներ'
        },
        {
          imageUrl: 'images/default/image3.jpg',
          title: 'Հետաքրքիր փաստեր',
          stats: [
            { value: '80+', label: 'սենյակ․' },
            { value: '7000մ²', label: 'ընդհանուր տարածք․' },
            { value: '100+', label: 'մեքենաների բացօթյա կայանատեղի' }
          ]
        }
      ]
    }
  }
};
