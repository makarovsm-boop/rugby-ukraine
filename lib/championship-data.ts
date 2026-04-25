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
    played: number;
    won: number;
    lost: number;
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
      { position: 1, name: "Leinster", played: 15, won: 13, lost: 2, points: 59 },
      { position: 2, name: "Bulls", played: 15, won: 11, lost: 4, points: 49 },
      { position: 3, name: "Glasgow Warriors", played: 15, won: 10, lost: 5, points: 45 },
      { position: 4, name: "Stormers", played: 15, won: 9, lost: 6, points: 41 },
    ],
    matches: [
      {
        round: "16 тур",
        teams: "Leinster vs Bulls",
        date: "25 квітня 2026, 20:00",
        location: "Aviva Stadium",
      },
      {
        round: "16 тур",
        teams: "Stormers vs Munster",
        date: "26 квітня 2026, 18:00",
        location: "Кейптаун",
      },
      {
        round: "16 тур",
        teams: "Glasgow Warriors vs Benetton",
        date: "27 квітня 2026, 21:00",
        location: "Глазго",
      },
    ],
  },
];
