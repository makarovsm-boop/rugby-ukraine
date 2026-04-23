export type Team = {
  slug: string;
  name: string;
  short: string;
  country: string;
  level: string;
  stadium: string;
  description: string;
  image: string;
  squad: {
    name: string;
    position: string;
    number: number;
    note: string;
  }[];
  matches: {
    tournament: string;
    opponent: string;
    date: string;
    location: string;
  }[];
};

export const teams: Team[] = [
  {
    slug: "ukraine-national-team",
    name: "Збірна України",
    short: "UA",
    country: "Україна",
    level: "Збірна",
    stadium: "Львів / Київ",
    description:
      "Головна команда країни, яка представляє Україну в міжнародних турнірах і формує інтерес до регбі серед локальної аудиторії.",
    image: "/team-ukraine.svg",
    squad: [
      {
        name: "Олександр Бойко",
        position: "Скрам-хав",
        number: 9,
        note: "Керує темпом гри й відповідає за швидкий розподіл м'яча.",
      },
      {
        name: "Іван Коваль",
        position: "Флай-хав",
        number: 10,
        note: "Один із головних плеймейкерів, добре читає простір і темп атаки.",
      },
      {
        name: "Максим Дяченко",
        position: "Фулбек",
        number: 15,
        note: "Надійний у грі під високими м'ячами та швидко запускає контратаки.",
      },
      {
        name: "Денис Марченко",
        position: "Проп",
        number: 1,
        note: "Сильний у статичних фазах і боротьбі в сутичках.",
      },
    ],
    matches: [
      {
        tournament: "Чемпіонат Європи",
        opponent: "Польща",
        date: "24 квітня 2026, 18:30",
        location: "Львів",
      },
      {
        tournament: "Чемпіонат Європи",
        opponent: "Швеція",
        date: "02 травня 2026, 16:00",
        location: "Стокгольм",
      },
      {
        tournament: "Тест-матч",
        opponent: "Нідерланди",
        date: "10 травня 2026, 19:00",
        location: "Київ",
      },
    ],
  },
  {
    slug: "leinster-rugby",
    name: "Leinster Rugby",
    short: "LEI",
    country: "Ірландія",
    level: "Клуб",
    stadium: "Aviva Stadium",
    description:
      "Один із найстабільніших клубів Європи з сильною академією, глибоким складом і регулярною боротьбою за титули.",
    image: "/team-leinster.svg",
    squad: [
      {
        name: "Cian Healy",
        position: "Проп",
        number: 1,
        note: "Досвідчений форвард, який додає стабільності в статичних фазах.",
      },
      {
        name: "Jamison Gibson-Park",
        position: "Скрам-хав",
        number: 9,
        note: "Веде гру на високій швидкості й чудово керує ритмом атаки.",
      },
      {
        name: "Ross Byrne",
        position: "Флай-хав",
        number: 10,
        note: "Відповідає за тактичне ведення матчу та удари по воротах.",
      },
      {
        name: "Hugo Keenan",
        position: "Фулбек",
        number: 15,
        note: "Один із ключових гравців задньої лінії з надійною грою в захисті.",
      },
    ],
    matches: [
      {
        tournament: "United Rugby Championship",
        opponent: "Bulls",
        date: "25 квітня 2026, 20:00",
        location: "Дублін",
      },
      {
        tournament: "United Rugby Championship",
        opponent: "Stormers",
        date: "03 травня 2026, 18:00",
        location: "Кейптаун",
      },
      {
        tournament: "Кубок Європи",
        opponent: "Toulouse",
        date: "11 травня 2026, 19:30",
        location: "Дублін",
      },
    ],
  },
  {
    slug: "stade-toulousain",
    name: "Stade Toulousain",
    short: "ST",
    country: "Франція",
    level: "Клуб",
    stadium: "Stade Ernest-Wallon",
    description:
      "Французький гранд із яскравим атакувальним стилем, який постійно бореться за вершину в національних і європейських турнірах.",
    image: "/team-toulouse.svg",
    squad: [
      {
        name: "Julien Marchand",
        position: "Хукер",
        number: 2,
        note: "Лідер форвардів, сильний у стандартних положеннях і відкритій грі.",
      },
      {
        name: "Antoine Dupont",
        position: "Скрам-хав",
        number: 9,
        note: "Один із найвпливовіших гравців світу, який задає темп усій команді.",
      },
      {
        name: "Romain Ntamack",
        position: "Флай-хав",
        number: 10,
        note: "Створює простір у нападі та загрожує супернику ударами й пасом.",
      },
      {
        name: "Thomas Ramos",
        position: "Фулбек",
        number: 15,
        note: "Стабільний виконавець ударів і важливий гравець задньої лінії.",
      },
    ],
    matches: [
      {
        tournament: "Top 14",
        opponent: "La Rochelle",
        date: "27 квітня 2026, 21:00",
        location: "Тулуза",
      },
      {
        tournament: "Top 14",
        opponent: "Bordeaux",
        date: "04 травня 2026, 18:30",
        location: "Бордо",
      },
      {
        tournament: "Кубок Європи",
        opponent: "Leinster",
        date: "11 травня 2026, 19:30",
        location: "Дублін",
      },
    ],
  },
  {
    slug: "bulls",
    name: "Bulls",
    short: "BUL",
    country: "ПАР",
    level: "Клуб",
    stadium: "Loftus Versfeld",
    description:
      "Потужна південноафриканська команда, відома фізичним стилем, сильною боротьбою в контакті та високою інтенсивністю.",
    image: "/team-bulls.svg",
    squad: [
      {
        name: "Johan Grobbelaar",
        position: "Хукер",
        number: 2,
        note: "Стабільно працює в коридорах і додає агресії в контакті.",
      },
      {
        name: "Embrose Papier",
        position: "Скрам-хав",
        number: 9,
        note: "Швидко розганяє м'яч і добре підтримує форвардів у фазах.",
      },
      {
        name: "Johan Goosen",
        position: "Флай-хав",
        number: 10,
        note: "Дає команді варіативність у грі ногами та побудові позиційних атак.",
      },
      {
        name: "Canan Moodie",
        position: "Центр / Вінгер",
        number: 14,
        note: "Небезпечний у відкритому просторі та ефективний у завершенні атак.",
      },
    ],
    matches: [
      {
        tournament: "United Rugby Championship",
        opponent: "Leinster",
        date: "25 квітня 2026, 20:00",
        location: "Дублін",
      },
      {
        tournament: "United Rugby Championship",
        opponent: "Munster",
        date: "02 травня 2026, 19:30",
        location: "Преторія",
      },
      {
        tournament: "United Rugby Championship",
        opponent: "Glasgow Warriors",
        date: "09 травня 2026, 18:00",
        location: "Глазго",
      },
    ],
  },
];
