export type Championship = {
  slug: string;
  title: string;
  season: string;
  region: string;
  format: string;
  description: string;
  image: string;
  standings: {
    position: number;
    name: string;
    logo?: string;
    played: number | null;
    won: number | null;
    lost: number | null;
    points: number;
  }[];
  matches: {
    round: string;
    teams: string;
    date: string;
    location: string;
  }[];
};

export const championships: Championship[] = [
  {
    slug: "european-championship",
    title: "Чемпіонат Європи",
    season: "2026",
    region: "Європа",
    format: "Збірні",
    description:
      "Міжнародний турнір для національних збірних, де команди змагаються за статус і важливі рейтингові позиції в європейському регбі.",
    image: "/championship-europe.svg",
    standings: [
      { position: 1, name: "Грузія", played: 4, won: 4, lost: 0, points: 19 },
      { position: 2, name: "Румунія", played: 4, won: 3, lost: 1, points: 15 },
      { position: 3, name: "Іспанія", played: 4, won: 2, lost: 2, points: 11 },
      { position: 4, name: "Україна", played: 4, won: 1, lost: 3, points: 6 },
    ],
    matches: [
      {
        round: "5 тур",
        teams: "Україна vs Польща",
        date: "24 квітня 2026, 18:30",
        location: "Львів",
      },
      {
        round: "5 тур",
        teams: "Румунія vs Іспанія",
        date: "25 квітня 2026, 16:00",
        location: "Бухарест",
      },
      {
        round: "5 тур",
        teams: "Грузія vs Нідерланди",
        date: "26 квітня 2026, 15:00",
        location: "Тбілісі",
      },
    ],
  },
  {
    slug: "premiership-rugby",
    title: "Premiership Rugby",
    season: "2025/26",
    region: "Англія",
    format: "Клуби",
    description:
      "Елітна англійська ліга з високим темпом, глибиною складів і боротьбою за місця у плей-оф до останніх турів.",
    image: "/championship-premiership.svg",
    standings: [
      { position: 1, name: "Northampton Saints", played: 14, won: 12, lost: 1, points: 62 },
      { position: 2, name: "Bath Rugby", played: 14, won: 11, lost: 3, points: 58 },
      { position: 3, name: "Leicester Tigers", played: 14, won: 10, lost: 4, points: 52 },
      { position: 4, name: "Bristol Bears", played: 14, won: 10, lost: 4, points: 48 },
      { position: 5, name: "Exeter Chiefs", played: 13, won: 8, lost: 4, points: 47 },
      { position: 6, name: "Saracens", played: 14, won: 7, lost: 7, points: 42 },
      { position: 7, name: "Sale Sharks", played: 14, won: 4, lost: 10, points: 27 },
      { position: 8, name: "Harlequins", played: 14, won: 3, lost: 11, points: 16 },
      { position: 9, name: "Gloucester Rugby", played: 13, won: 2, lost: 11, points: 16 },
      { position: 10, name: "Newcastle Red Bulls", played: 14, won: 1, lost: 13, points: 7 },
    ],
    matches: [
      {
        round: "25 квітня 2026 · результат",
        teams: "Harlequins 33:52 Sale Sharks",
        date: "Twickenham Stoop",
        location: "Офіційний рахунок матчу дня",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "Northampton Saints 38:35 Bath Rugby",
        date: "cinch Stadium @ Franklin's Gardens",
        location: "Результат дня за матч-репортом The Guardian",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "Saracens 19:15 Leicester Tigers",
        date: "StoneX Stadium",
        location: "Результат дня за матч-репортом The Guardian",
      },
      {
        round: "8 травня 2026 · найближчий матч",
        teams: "Gloucester Rugby vs Sale Sharks",
        date: "18:45, Kingsholm",
        location: "Найближчий анонсований матч Premiership Rugby",
      },
    ],
  },
  {
    slug: "united-rugby-championship",
    title: "United Rugby Championship",
    season: "2025/26",
    region: "Міжнародний",
    format: "Клуби",
    description:
      "Турнір, який об'єднує провідні клуби Ірландії, Шотландії, Уельсу, Італії та Південної Африки в одному чемпіонаті.",
    image: "/championship-urc.svg",
    standings: [
      { position: 1, name: "DHL Stormers", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/08/Stormers.svg", played: 16, won: 12, lost: 4, points: 56 },
      { position: 2, name: "Glasgow Warriors", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Glasgow-Warriors-1.svg", played: 16, won: 11, lost: 5, points: 55 },
      { position: 3, name: "Fidelity SecureDrive Lions", logo: "https://www.unitedrugby.com/wp-content/uploads/2026/03/Fidelity-SecureDrive-Lions.svg", played: 16, won: 10, lost: 5, points: 53 },
      { position: 4, name: "Leinster Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Leinster.svg", played: 16, won: 10, lost: 6, points: 53 },
      { position: 5, name: "Munster Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Munster-Rugby.svg", played: 16, won: 10, lost: 6, points: 51 },
      { position: 6, name: "Cardiff Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Cardiff-Rugby-1.svg", played: 16, won: 10, lost: 6, points: 50 },
      { position: 7, name: "Vodacom Bulls", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Vodacom.svg", played: 16, won: 10, lost: 6, points: 49 },
      { position: 8, name: "Ulster Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Ulster-1.svg", played: 16, won: 9, lost: 7, points: 47 },
      { position: 9, name: "Connacht Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Connacht.svg", played: 16, won: 8, lost: 8, points: 44 },
      { position: 10, name: "Hollywoodbets Sharks", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Hollywoodbets-Sharks.svg", played: 16, won: 6, lost: 9, points: 36 },
      { position: 11, name: "Ospreys", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Ospreys-1.svg", played: 16, won: 6, lost: 8, points: 35 },
      { position: 12, name: "Edinburgh Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Edinburgh-1.svg", played: 16, won: 6, lost: 10, points: 33 },
      { position: 13, name: "Benetton Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Benetton-Rugby-1.svg", played: 16, won: 6, lost: 8, points: 33 },
      { position: 14, name: "Dragons RFC", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Dragons-1.svg", played: 16, won: 3, lost: 10, points: 25 },
      { position: 15, name: "Scarlets", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Scarlets-1.svg", played: 16, won: 4, lost: 11, points: 24 },
      { position: 16, name: "Zebre Parma", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Zebre-Parma-1.svg", played: 16, won: 2, lost: 14, points: 15 },
    ],
    matches: [
      {
        round: "24 квітня 2026 · результат",
        teams: "Cardiff Rugby 24:21 Ospreys",
        date: "Cardiff Arms Park",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "24 квітня 2026 · результат",
        teams: "Edinburgh Rugby 33:28 Hollywoodbets Sharks",
        date: "Hive Stadium",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "24 квітня 2026 · результат",
        teams: "Zebre Parma 18:19 Dragons RFC",
        date: "Stadio Sergio Lanfranchi",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "DHL Stormers 48:12 Glasgow Warriors",
        date: "DHL Stadium",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "Fidelity SecureDrive Lions 33:21 Connacht Rugby",
        date: "Ellis Park",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "Munster Rugby 41:14 Ulster Rugby",
        date: "Thomond Park",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "Scarlets 21:23 Vodacom Bulls",
        date: "Parc y Scarlets",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "25 квітня 2026 · результат",
        teams: "Benetton Rugby 29:26 Leinster Rugby",
        date: "Stadio Monigo",
        location: "Офіційний результат URC Round 16",
      },
      {
        round: "8 травня 2026 · анонс",
        teams: "Glasgow Warriors vs Cardiff Rugby",
        date: "18:45, Scotstoun Stadium",
        location: "Найближчий матч URC",
      },
      {
        round: "8 травня 2026 · анонс",
        teams: "Ulster Rugby vs DHL Stormers",
        date: "18:45, Affidea Stadium",
        location: "Ключова гра наступного туру",
      },
      {
        round: "9 травня 2026 · анонс",
        teams: "Leinster Rugby vs Fidelity SecureDrive Lions",
        date: "16:30, Aviva Stadium",
        location: "Один із центральних матчів туру",
      },
    ],
  },
  {
    slug: "six-nations",
    title: "Six Nations",
    season: "2026",
    region: "Європа",
    format: "Збірні",
    description:
      "Найпрестижніший щорічний турнір збірних Північної півкулі. Сезон 2026 уже завершено, тож на сторінці показуємо фінальну таблицю та підсумкові результати.",
    image: "/fallback-championship.svg",
    standings: [
      { position: 1, name: "Франція", played: 5, won: 4, lost: 1, points: 21 },
      { position: 2, name: "Ірландія", played: 5, won: 4, lost: 1, points: 19 },
      { position: 3, name: "Шотландія", played: 5, won: 3, lost: 2, points: 16 },
      { position: 4, name: "Італія", played: 5, won: 2, lost: 3, points: 9 },
      { position: 5, name: "Англія", played: 5, won: 1, lost: 4, points: 8 },
      { position: 6, name: "Уельс", played: 5, won: 1, lost: 4, points: 6 },
    ],
    matches: [
      {
        round: "14 березня 2026 · фінальний тур",
        teams: "Ірландія 14:10 Шотландія",
        date: "Aviva Stadium, Дублін",
        location: "Ірландія завершила турнір перемогою та взяла Triple Crown",
      },
      {
        round: "14 березня 2026 · фінальний тур",
        teams: "Уельс 16:40 Італія",
        date: "Principality Stadium, Кардіфф",
        location: "Італія фінішувала четвертою, Уельс залишився шостим",
      },
      {
        round: "14 березня 2026 · фінальний тур",
        teams: "Франція 20:10 Англія",
        date: "Stade de France, Сен-Дені",
        location: "Франція виграла турнір після перемоги в останньому матчі",
      },
      {
        round: "Статус сезону",
        teams: "Турнір завершено",
        date: "Наступний розіграш стартує вже в сезоні 2027",
        location: "Ця сторінка показує підсумок кампанії 2026",
      },
    ],
  },
  {
    slug: "investec-champions-cup",
    title: "Investec Champions Cup",
    season: "2025/26",
    region: "Європа",
    format: "Клуби",
    description:
      "Головний європейський клубний кубок, де після пулового етапу турнір переходить у плей-оф і кожен матч уже працює як окрема історія на виліт.",
    image: "/fallback-championship.svg",
    standings: [
      { position: 1, name: "Glasgow Warriors", played: 4, won: 4, lost: 0, points: 20 },
      { position: 2, name: "Bordeaux Bègles", played: 4, won: 4, lost: 0, points: 20 },
      { position: 3, name: "Leinster Rugby", played: 4, won: 4, lost: 0, points: 18 },
      { position: 4, name: "Bath Rugby", played: 4, won: 3, lost: 1, points: 16 },
      { position: 5, name: "Northampton Saints", played: 4, won: 3, lost: 1, points: 16 },
      { position: 6, name: "Harlequins", played: 4, won: 3, lost: 1, points: 15 },
      { position: 7, name: "RC Toulon", played: 4, won: 3, lost: 1, points: 14 },
      { position: 8, name: "Bristol Bears", played: 4, won: 3, lost: 1, points: 14 },
    ],
    matches: [
      {
        round: "25 квітня 2026 · сьогодні",
        teams: "Сьогодні в Investec Champions Cup матчів немає",
        date: "Турнір повертається півфіналами 2–3 травня",
        location: "Поточний етап: пауза між чвертьфіналами та півфіналами",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Leinster Rugby 43:13 Sale Sharks",
        date: "Aviva Stadium",
        location: "Один із ключових результатів останнього ігрового вікна",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Glasgow Warriors 19:22 RC Toulon",
        date: "Scotstoun Stadium",
        location: "Toulon вийшов до півфіналу після виїзної перемоги",
      },
      {
        round: "2 травня 2026 · найближчий матч",
        teams: "Leinster Rugby vs RC Toulon",
        date: "14:00, Aviva Stadium",
        location: "Півфінал Investec Champions Cup",
      },
      {
        round: "3 травня 2026 · наступний півфінал",
        teams: "Bordeaux Bègles vs Bath Rugby",
        date: "14:00, Stade Atlantique Bordeaux Métropole",
        location: "Другий півфінал турніру",
      },
    ],
  },
  {
    slug: "champions-cup",
    title: "Investec Champions Cup",
    season: "2025/26",
    region: "Європа",
    format: "Клуби",
    description:
      "Головний європейський клубний кубок, де після пулового етапу турнір переходить у плей-оф і кожен матч уже працює як окрема історія на виліт.",
    image: "/fallback-championship.svg",
    standings: [
      { position: 1, name: "Glasgow Warriors", played: 4, won: 4, lost: 0, points: 20 },
      { position: 2, name: "Bordeaux Bègles", played: 4, won: 4, lost: 0, points: 20 },
      { position: 3, name: "Leinster Rugby", played: 4, won: 4, lost: 0, points: 18 },
      { position: 4, name: "Bath Rugby", played: 4, won: 3, lost: 1, points: 16 },
      { position: 5, name: "Northampton Saints", played: 4, won: 3, lost: 1, points: 16 },
      { position: 6, name: "Harlequins", played: 4, won: 3, lost: 1, points: 15 },
      { position: 7, name: "RC Toulon", played: 4, won: 3, lost: 1, points: 14 },
      { position: 8, name: "Bristol Bears", played: 4, won: 3, lost: 1, points: 14 },
    ],
    matches: [
      {
        round: "25 квітня 2026 · сьогодні",
        teams: "Сьогодні в Investec Champions Cup матчів немає",
        date: "Турнір повертається півфіналами 2–3 травня",
        location: "Поточний етап: пауза між чвертьфіналами та півфіналами",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Leinster Rugby 43:13 Sale Sharks",
        date: "Aviva Stadium",
        location: "Один із ключових результатів останнього ігрового вікна",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Glasgow Warriors 19:22 RC Toulon",
        date: "Scotstoun Stadium",
        location: "Toulon вийшов до півфіналу після виїзної перемоги",
      },
      {
        round: "2 травня 2026 · найближчий матч",
        teams: "Leinster Rugby vs RC Toulon",
        date: "14:00, Aviva Stadium",
        location: "Півфінал Investec Champions Cup",
      },
      {
        round: "3 травня 2026 · наступний півфінал",
        teams: "Bordeaux Bègles vs Bath Rugby",
        date: "14:00, Stade Atlantique Bordeaux Métropole",
        location: "Другий півфінал турніру",
      },
    ],
  },
];
