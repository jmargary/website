import type { SectionTranslations } from '../types';

export const plansData: SectionTranslations = {
  id: 'plans',
  btnLabel: { en: 'Plans', ru: 'Планы', am: 'Հանդիսությունների և VIP սրահներ' },
  content: {
    en: {
      title: 'Plans & Options',
      subtitle: 'Flexible setups for every need',
      description: ['Choose from a range of tailored plans — from individual desks to full-floor suites.'],
      layoutType: 'plansGrid',
      plansData: [
        { 
          title: 'Private Office', 
          shortText: 'Your dedicated secure space.', 
          fullText: 'Our private offices provide a professional, quiet environment suitable for small to medium-sized teams. Each office is fully furnished and includes high-speed internet, secure access, and all utilities.',
          imageUrl: 'images/plans/pic1.jpg' 
        },
        { 
          title: 'Dedicated Desk', 
          shortText: 'Your own desk in a shared room.', 
          fullText: 'A dedicated desk gives you the benefit of a professional workspace with the flexibility of a shared office. You get a permanent spot where you can leave your belongings and focus on your work.',
          imageUrl: 'images/plans/pic2.jpg' 
        },
        { 
          title: 'Virtual Office', 
          shortText: 'Professional address & services.', 
          fullText: 'Establish a presence with a professional business address. Our virtual office plans include mail handling and optional phone services, perfect for remote workers and start-ups.',
          imageUrl: 'images/plans/pic3.jpg' 
        },
        { 
          title: 'Meeting Rooms', 
          shortText: 'Full tech for your meetings.', 
          fullText: 'Modern meeting rooms equipped with top-tier presentation technology and seamless connectivity. Available hourly or for full days, including coffee and administrative support.',
          imageUrl: 'images/plans/pic4.jpg' 
        }
      ]
    },
    ru: {
      title: 'Планы и Варианты',
      subtitle: 'Гибкие решения для любых нужд',
      description: ['Выбирайте из множества индивидуальных планов — от отдельных рабочих мест до многокомнатных офисов.'],
      layoutType: 'plansGrid',
      plansData: [
        { 
          title: 'Личный Офис', 
          shortText: 'Ваше выделенное безопасное пространство.', 
          fullText: 'Наши частные офисы обеспечивают профессиональную, тихую обстановку, подходящую для команд малого и среднего размера. Каждый офис полностью меблирован.',
          imageUrl: 'images/plans/pic1.jpg' 
        },
        { 
          title: 'Закрепленное Место', 
          shortText: 'Ваш стол в общим зале.', 
          fullText: 'Закрепленный рабочий стол дает вам преимущество профессионального рабочего пространства с гибкостью общего офиса.',
          imageUrl: 'images/plans/pic2.jpg' 
        },
        { 
          title: 'Виртуальный Офис', 
          shortText: 'Профессиональный адрес и услуги.', 
          fullText: 'Создайте присутствие с профессиональным бизнес-адресом. Наши планы включают обработку почты и дополнительные телефонные услуги.',
          imageUrl: 'images/plans/pic3.jpg' 
        },
        { 
          title: 'Переговорные', 
          shortText: 'Полное оснащение для встреч.', 
          fullText: 'Современные конференц-залы, оснащенные первоклассным презентационным оборудованием и бесперебойной связью.',
          imageUrl: 'images/plans/pic4.jpg' 
        }
      ]
    },
    am: {
      title: 'Պլաններ',
      subtitle: 'Ճկուն տարբերակներ յուրաքանչյուրի համար',
      description: ['Ընտրեք հարմարեցված պլանների լայն տեսականուց՝ անհատական սեղաններից մինչև ամբողջական գրասենյակներ:'],
      layoutType: 'plansGrid',
      plansData: [
        { 
          title: 'STANDARD', 
          shortText: 'Սկսած 25քմ-ից, 1 քմ՝ 10 000դրամ (ներառյալ ԱԱՀ)', 
          fullText: 'Ստանդարտ փաթեթը ներառում է հետևյալ ծառայությունները՝',
          bulletPoints: [
            'Առանձին կառավարվող ջեռուցման, օդորակման և օդափոխության համակարգ',
            'Գերարագ և անխափան ինտերնետ կապ, երկու ռեզերվային գիծ` մինչև 100 մբ/վ արագության հնարավորությամբ',
            'Ընդունարան ամբողջ կենտրոնը սպասարկելու համար',
            'Բացօթյա կայանատեղի (մեկ մեքենայի համար)',
            'Հոսանքի ռեզերվային գծեր և գերհզոր ինքնաշխատ գեներատոր ամբողջ շենքը էլեկտրականությամբ ապահովելու համար',
            '24/7 անվտանգության ապահովում',
            'Տեսահսկում',
            'Հակահրդեհային համակարգ',
            'Ձայնազդանշանային համակարգ',
            'Պահնորդական ծառայություն',
            'Զանգերի սենյակներ (calling rooms)',
            'Սուրճի սենյակ ամեն հարկում',
            'Ամբողջ տարածքի մաքրության ապահովում',
            'Ընդարձակ կանաչ գոտի հանգստի համար (Green zone)'
          ],
          imageUrl: 'images/plans/pic1.jpg' 
        },
        { 
          title: 'STANDARD +', 
          shortText: '1քմ արժեքը` 12 000 դր (ներառյալ ԱԱՀ)', 
          fullText: 'Ստանդարտ + փաթեթը ներառում է հետևյալ լրացուցիչ ծառայությունները՝',
          bulletPoints: [
            'Առանձին կառավարվող ջեռուցման, օդորակման և օդափոխության համակարգ',
            'Գերարագ և անխափան ինտերնետ կապ, երկու ռեզերվային գիծ՝ մինչև 100 մբ/վ արագության հնարավորությամբ',
            'Ընդունարան ամբողջ կենտրոնը սպասարկելու համար',
            'Բացօթյա կայանատեղի (մեկ մեքենայի համար)',
            'Հոսանքի ռեզերվային գծեր և գերհզոր ինքնաշխատ գեներատոր ամբողջ շենքը էլեկտրականությամբ ապահովելու համար',
            '24/7 անվտանգության ապահովում',
            'Տեսահսկում',
            'Հակահրդեհային համակարգ',
            'Ձայնազդանշանային համակարգ',
            'Պահնորդական ծառայություն',
            'Զանգերի սենյակներ (calling rooms)',
            'Սմարթ հեռախոսացանցի տրամադրում',
            'Սուրճի սենյակ ամեն հարկում',
            'Smart TV ծառայություն',
            'Ամբողջ տարածքի մաքրության ապահովում',
            'Ընդարձակ կանաչ գոտի հանգստի համար (Green zone)',
            'Տեսազանգերի սենյակներ (meeting rooms)',
            'Ընդարձակ հանդիպումների սրահ (Conference hall) (ամսական 4ժ)',
            'Սերվերային տարածքի տրամադրում (unit)'
          ],
          imageUrl: 'images/plans/pic2.jpg' 
        },
        { 
          title: 'PREMIUM', 
          shortText: '1քմ արժեքը` 13 000 դր (ներառյալ ԱԱՀ)', 
          fullText: 'Պրեմիում փաթեթը ներառում է հետևյալ լրացուցիչ ծառայությունները՝',
          bulletPoints: [
            'Առանձին կառավարվող ջեռուցման, օդորակման և օդափոխության համակարգ',
            'Գերարագ և անխափան ինտերնետ կապ, երկու ռեզերվային գիծ` մինչև 100 մբ/վ արագության հնարավորությամբ',
            'Ընդունարան ամբողջ կենտրոնը սպասարկելու համար',
            'Բացօթյա կայանատեղի (մեկ մեքենայի համար)',
            'Հոսանքի ռեզերվային գծեր և գերհզոր ինքնաշխատ գեներատոր ամբողջ շենքը էլեկտրականությամբ ապահովելու համար',
            '24/7 անվտանգության ապահովում',
            'Տեսահսկում',
            'Հակահրդեհային համակարգ',
            'Ձայնազդանշանային համակարգ',
            'Պահնորդական ծառայություն',
            'Զանգերի սենյակներ (calling rooms)',
            'Սմարթ հեռախոսացանցի տրամադրում',
            'Սմարթ պահարաններ (lockers)',
            'Սուրճի սենյակ ամեն հարկում',
            'Smart TV ծառայություն',
            'Ամբողջ տարածքի մաքրության ապահվում',
            'Ընդարձակ կանաչ գոտի հանգստի համար (Green zone)',
            'Տեսազանգերի սենյակներ (meeting rooms)',
            'Ընդարձակ հանդիպումների սրահ (Conference hall) (ամսական 4ժ)',
            'Սերվերային տարածքի տրամադրում (unit)'
          ],
          imageUrl: 'images/plans/pic3.jpg' 
        },
        { 
          title: 'PREMIUM +', 
          shortText: '1քմ արժեքը 16.000 դր (ներառյալ ԱԱՀ)', 
          fullText: 'Պրեմիում + փաթեթը ներառում է հետևյալ բացառիկ ծառայությունները՝',
          bulletPoints: [
            'Առանձին կառավարվող ջեռուցման, օդորակման և օդափոխության համակարգ',
            'Գերարագ և անխափան ինտերնետ կապ, երկու ռեզերվային գիծ` մինչև 100 մբ/վ արագությամբ',
            'Ընդունարան ամբողջ կենտրոնը սպասարկելու համար',
            'Բացօթյա կայանատեղի',
            'Հոսանքի ռեզերվային գծեր և գերհզոր ինքնաշխատ գեներատոր ամբողջ շենքը էլեկտրականությամբ ապահովելու համար',
            '24/7 անվտանգության ապահովում',
            'Տեսահսկում',
            'Հակահրդեհային համակարգ',
            'Ձայնազդանշանային համակարգ',
            'Պահնորդական ծառայություն',
            'Զանգերի սենյակներ (calling rooms)',
            'Սմարթ հեռախոսացանցի տրամադրում',
            'Սուրճի սենյակ ամեն հարկում',
            'Ստորգետնյա կայանատեղի',
            'Մուտքի հսկողություն (face և finger control)',
            'Սմարթ պահարաններ (lockers)',
            'Smart TV ծառայություն',
            'Ամբողջ տարածքի մաքրության ապահվում',
            'Ամպային տիրույթի տրամադրում (cloud)',
            'Ընդարձակ կանաչ գոտի հանգստի համար (Green zone)',
            'Ընդարձակ հանդիպումների սրահ (Conference hall)',
            'Տեսազանգերի սենյակներ (meeting rooms)',
            'Սերվերային տարածքի տրամադրում (unit)',
            'Տանիքում բացօթյա ռեստորան-սրճարան, սիգար-բար, ֆուդ կորտ'
          ],
          imageUrl: 'images/plans/pic4.jpg' 
        }
      ]
    }
  }
};
