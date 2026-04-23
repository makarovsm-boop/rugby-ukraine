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
      { position: 1, name: "Bath", played: 16, won: 12, lost: 4, points: 55 },
      { position: 2, name: "Saracens", played: 16, won: 11, lost: 5, points: 51 },
      { position: 3, name: "Harlequins", played: 16, won: 10, lost: 6, points: 46 },
      { position: 4, name: "Leicester Tigers", played: 16, won: 9, lost: 7, points: 43 },
    ],
    matches: [
      {
        round: "17 тур",
        teams: "Bath vs Harlequins",
        date: "26 квітня 2026, 17:00",
        location: "Recreation Ground",
      },
      {
        round: "17 тур",
        teams: "Saracens vs Bristol Bears",
        date: "26 квітня 2026, 19:30",
        location: "Лондон",
      },
      {
        round: "17 тур",
        teams: "Sale Sharks vs Leicester Tigers",
        date: "27 квітня 2026, 18:45",
        location: "Манчестер",
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
