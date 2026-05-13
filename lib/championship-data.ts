export type Championship = {
  slug: string;
  title: string;
  aliases?: string[];
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
  groupTables?: {
    name: string;
    standings: {
      position: number;
      name: string;
      logo?: string;
      played: number;
      won: number;
      draw: number;
      lost: number;
      points: number;
    }[];
  }[];
  matches: {
    round: string;
    teams: string;
    date: string;
    location: string;
  }[];
};

function normalizeChampionshipKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, " ")
    .trim();
}

export function findChampionshipOverride(input: {
  slug?: string;
  title?: string;
}) {
  const slugKey = input.slug ? normalizeChampionshipKey(input.slug) : null;
  const titleKey = input.title ? normalizeChampionshipKey(input.title) : null;

  if (slugKey) {
    const bySlug = championships.find((entry) => {
      const slugKeys = [entry.slug, ...(entry.aliases ?? [])].map(
        normalizeChampionshipKey,
      );

      return slugKeys.includes(slugKey);
    });

    if (bySlug) {
      return bySlug;
    }
  }

  if (titleKey) {
    return championships.find((entry) => {
      const titleKeys = [entry.title, ...(entry.aliases ?? [])].map(
        normalizeChampionshipKey,
      );

      return titleKeys.includes(titleKey);
    });
  }

  return undefined;
}

export function getChampionshipPreviewSlug(input: {
  slug?: string;
  title?: string;
}) {
  const titleKey = input.title ? normalizeChampionshipKey(input.title) : null;

  if (titleKey) {
    const byTitle = championships.find((entry) => {
      const titleKeys = [entry.title, ...(entry.aliases ?? [])].map(
        normalizeChampionshipKey,
      );

      return titleKeys.includes(titleKey);
    });

    if (byTitle) {
      return byTitle.slug;
    }
  }

  return findChampionshipOverride(input)?.slug ?? input.slug ?? "";
}

export function getChampionshipCanonicalSlug(input: {
  slug?: string;
  title?: string;
}) {
  const byTitle = input.title
    ? championships.find((entry) => {
        const titleKeys = [entry.title, ...(entry.aliases ?? [])].map(
          normalizeChampionshipKey,
        );

        return titleKeys.includes(normalizeChampionshipKey(input.title!));
      })
    : undefined;

  if (byTitle) {
    return byTitle.slug;
  }

  return findChampionshipOverride(input)?.slug ?? input.slug ?? "";
}

export function findChampionshipOverrideBySlug(slug?: string) {
  if (!slug) {
    return undefined;
  }

  return findChampionshipOverride({ slug });
}

export const championships: Championship[] = [
  {
    slug: "world-rugby",
    title: "World Rugby",
    aliases: ["World Rugby cup 2027", "World Rugby Cup 2027", "Rugby World Cup 2027", "RWC 2027"],
    season: "2027",
    region: "Світ",
    format: "Збірні",
    description:
      "Чоловічий Кубок світу з регбі 2027 в Австралії. На офіційній сторінці пулів уже відомий склад усіх шести груп, тому тут показуємо саме груповий розподіл збірних.",
    image: "/fallback-championship.svg",
    standings: [],
    groupTables: [
      {
        name: "Pool A",
        standings: [
          { position: 1, name: "New Zealand", logo: "https://flagcdn.com/nz.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 2, name: "Australia", logo: "https://flagcdn.com/au.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 3, name: "Chile", logo: "https://flagcdn.com/cl.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 4, name: "Hong Kong China", logo: "https://flagcdn.com/hk.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
        ],
      },
      {
        name: "Pool B",
        standings: [
          { position: 1, name: "South Africa", logo: "https://flagcdn.com/za.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 2, name: "Italy", logo: "https://flagcdn.com/it.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 3, name: "Georgia", logo: "https://flagcdn.com/ge.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 4, name: "Romania", logo: "https://flagcdn.com/ro.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
        ],
      },
      {
        name: "Pool C",
        standings: [
          { position: 1, name: "Argentina", logo: "https://flagcdn.com/ar.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 2, name: "Fiji", logo: "https://flagcdn.com/fj.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 3, name: "Spain", logo: "https://flagcdn.com/es.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 4, name: "Canada", logo: "https://flagcdn.com/ca.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
        ],
      },
      {
        name: "Pool D",
        standings: [
          { position: 1, name: "Ireland", logo: "https://flagcdn.com/ie.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 2, name: "Scotland", logo: "https://flagcdn.com/gb-sct.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 3, name: "Uruguay", logo: "https://flagcdn.com/uy.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 4, name: "Portugal", logo: "https://flagcdn.com/pt.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
        ],
      },
      {
        name: "Pool E",
        standings: [
          { position: 1, name: "France", logo: "https://flagcdn.com/fr.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 2, name: "Japan", logo: "https://flagcdn.com/jp.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 3, name: "USA", logo: "https://flagcdn.com/us.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 4, name: "Samoa", logo: "https://flagcdn.com/ws.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
        ],
      },
      {
        name: "Pool F",
        standings: [
          { position: 1, name: "England", logo: "https://flagcdn.com/gb-eng.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 2, name: "Wales", logo: "https://flagcdn.com/gb-wls.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 3, name: "Tonga", logo: "https://flagcdn.com/to.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
          { position: 4, name: "Zimbabwe", logo: "https://flagcdn.com/zw.svg", played: 0, won: 0, draw: 0, lost: 0, points: 0 },
        ],
      },
    ],
    matches: [
      {
        round: "1 жовтня 2027 · 1 тур",
        teams: "Australia vs Hong Kong China",
        date: "18:45, Perth Stadium",
        location: "Перший матч Pool A · Perth | Boorloo",
      },
      {
        round: "2 жовтня 2027 · 1 тур",
        teams: "New Zealand vs Chile",
        date: "13:15, Perth Stadium",
        location: "Старт New Zealand у Pool A · Perth | Boorloo",
      },
      {
        round: "2 жовтня 2027 · 1 тур",
        teams: "Wales vs Zimbabwe",
        date: "12:15, Adelaide Oval",
        location: "Перший матч Pool F · Adelaide | Tarntanya",
      },
      {
        round: "2 жовтня 2027 · 1 тур",
        teams: "England vs Tonga",
        date: "20:15, Brisbane Stadium",
        location: "Старт England та Tonga у Pool F · Brisbane | Meeanjin",
      },
      {
        round: "2 жовтня 2027 · 1 тур",
        teams: "France vs USA",
        date: "17:45, Docklands Stadium",
        location: "Перший матч Pool E · Melbourne | Narrm",
      },
      {
        round: "3 жовтня 2027 · 1 тур",
        teams: "Japan vs Samoa",
        date: "12:15, Newcastle Stadium",
        location: "Старт Pool E · Newcastle | Awabakal-Worimi",
      },
      {
        round: "3 жовтня 2027 · 1 тур",
        teams: "South Africa vs Italy",
        date: "14:15, Adelaide Oval",
        location: "Перший матч Pool B · Adelaide | Tarntanya",
      },
      {
        round: "3 жовтня 2027 · 1 тур",
        teams: "Scotland vs Uruguay",
        date: "17:15, Docklands Stadium",
        location: "Перший матч Pool D · Melbourne | Narrm",
      },
      {
        round: "3 жовтня 2027 · 1 тур",
        teams: "Georgia vs Romania",
        date: "20:15, North Queensland Stadium",
        location: "Друга гра дня у Pool B · Townsville | Gurambilbarra",
      },
      {
        round: "4 жовтня 2027 · 1 тур",
        teams: "Fiji vs Spain",
        date: "14:15, Newcastle Stadium",
        location: "Перший матч Pool C · Newcastle | Awabakal-Worimi",
      },
      {
        round: "4 жовтня 2027 · 1 тур",
        teams: "Ireland vs Portugal",
        date: "17:15, Sydney Football Stadium",
        location: "Перший матч Pool D · Sydney | Gadigal",
      },
      {
        round: "4 жовтня 2027 · 1 тур",
        teams: "Argentina vs Canada",
        date: "18:45, Brisbane Stadium",
        location: "Перший матч Pool C · Brisbane | Meeanjin",
      },
    ],
  },
  {
    slug: "european-championship",
    title: "Чемпіонат Європи",
    season: "2026",
    region: "Європа",
    format: "Збірні",
    description:
      "Офіційний сезон Rugby Europe Championship 2026 уже завершено: фінали відбулися 15 березня в Мадриді, а Португалія стала чемпіоном турніру.",
    image: "/championship-europe.jpeg",
    standings: [
      { position: 1, name: "Грузія", played: 3, won: 3, lost: 0, points: 15 },
      { position: 2, name: "Португалія", played: 3, won: 3, lost: 0, points: 15 },
      { position: 3, name: "Іспанія", played: 3, won: 2, lost: 1, points: 10 },
      { position: 4, name: "Румунія", played: 3, won: 1, lost: 2, points: 5 },
      { position: 5, name: "Бельгія", played: 3, won: 1, lost: 2, points: 5 },
      { position: 6, name: "Швейцарія", played: 3, won: 1, lost: 2, points: 4 },
      { position: 7, name: "Німеччина", played: 3, won: 1, lost: 2, points: 4 },
      { position: 8, name: "Нідерланди", played: 3, won: 0, lost: 3, points: 1 },
    ],
    matches: [
      {
        round: "Статус сезону",
        teams: "Турнір завершено · Португалія — чемпіон 2026",
        date: "Найближчих матчів зараз немає",
        location: "Фінальний день відбувся 15 березня 2026 року в Мадриді",
      },
      {
        round: "15 березня 2026 · фінал",
        teams: "Грузія 17:19 Португалія",
        date: "Madrid, 18:45 local",
        location: "Офіційний фінал Rugby Europe Championship 2026",
      },
      {
        round: "15 березня 2026 · матч за 3 місце",
        teams: "Румунія 23:29 Іспанія",
        date: "Madrid, 16:00 local",
        location: "Іспанія завершила сезон на 3-му місці",
      },
      {
        round: "15 березня 2026 · матч за 5 місце",
        teams: "Швейцарія 16:39 Бельгія",
        date: "Madrid, 13:30 local",
        location: "Бельгія виграла заключний матч сезону",
      },
      {
        round: "15 березня 2026 · матч за 7 місце",
        teams: "Німеччина 7:76 Нідерланди",
        date: "Madrid, 11:00 local",
        location: "Нідерланди завершили турнір перемогою",
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
      { position: 1, name: "Northampton Saints", logo: "https://media-cdn.incrowdsports.com/45fedf62-349b-46af-a6c9-2504dd82ee8c.png?format=webp&width=1920", played: 14, won: 12, lost: 1, points: 62 },
      { position: 2, name: "Bath Rugby", logo: "https://media-cdn.incrowdsports.com/f4d9a293-9086-41bf-aa1b-c98d1c62fe3b.png?format=webp&width=1920", played: 14, won: 11, lost: 3, points: 58 },
      { position: 3, name: "Leicester Tigers", logo: "https://media-cdn.cortextech.io/a4776d83-dbbc-4e46-b12d-aaa2c88fac9b.png?format=webp&width=1920", played: 14, won: 10, lost: 4, points: 52 },
      { position: 4, name: "Exeter Chiefs", logo: "https://media-cdn.incrowdsports.com/794f9439-1dd5-47e1-bd74-655d63c1b505.png?format=webp&width=1920", played: 14, won: 8, lost: 5, points: 49 },
      { position: 5, name: "Bristol Bears", logo: "https://media-cdn.incrowdsports.com/714ab764-0396-4c96-80df-4013a723d172.png?format=webp&width=1920", played: 14, won: 10, lost: 4, points: 48 },
      { position: 6, name: "Saracens", logo: "https://media-cdn.incrowdsports.com/17733469-fa47-4bee-bb7e-2e8c36a26e8b.png?format=webp&width=1920", played: 14, won: 7, lost: 7, points: 42 },
      { position: 7, name: "Sale Sharks", logo: "https://media-cdn.incrowdsports.com/07a5c9e0-9974-43e8-a772-bb72097702d6.png?format=webp&width=1920", played: 14, won: 4, lost: 10, points: 27 },
      { position: 8, name: "Gloucester Rugby", logo: "https://media-cdn.incrowdsports.com/57109498-ebce-4d81-949a-c0bd84420813.png?format=webp&width=1920", played: 14, won: 3, lost: 11, points: 21 },
      { position: 9, name: "Harlequins", logo: "https://media-cdn.incrowdsports.com/ff7fb9b3-4a02-4407-b075-1d125962ce21.png?format=webp&width=1920", played: 14, won: 3, lost: 11, points: 16 },
      { position: 10, name: "Newcastle Red Bulls", logo: "https://media-cdn.incrowdsports.com/7fc9ef97-88f9-4353-8dff-ec260bac23ad.png?format=webp&width=1920", played: 14, won: 1, lost: 13, points: 7 },
    ],
    matches: [
      {
        round: "8 травня 2026 · результат",
        teams: "Gloucester Rugby 21:15 Sale Sharks",
        date: "Kingsholm",
        location: "Gloucester оформив другу поспіль перемогу в Gallagher PREM",
      },
      {
        round: "9 травня 2026 · результат",
        teams: "Leicester Tigers 41:17 Northampton Saints",
        date: "Mattioli Woods Welford Road",
        location: "Leicester виграв дербі та наблизився до верхньої двійки",
      },
      {
        round: "9 травня 2026 · результат",
        teams: "Bristol Bears 26:41 Saracens",
        date: "Ashton Gate",
        location: "Saracens залишився в гонці за плей-оф після виїзної перемоги",
      },
      {
        round: "10 травня 2026 · результат",
        teams: "Newcastle Red Bulls 17:76 Harlequins",
        date: "Kingston Park",
        location: "Harlequins набрав бонусні очки у матчі нижньої частини таблиці",
      },
      {
        round: "10 травня 2026 · результат",
        teams: "Exeter Chiefs 31:12 Bath Rugby",
        date: "Sandy Park",
        location: "Exeter посилив боротьбу за місце у топ-4",
      },
      {
        round: "15 травня 2026 · анонс",
        teams: "Northampton Saints vs Bristol Bears",
        date: "18:45, cinch Stadium @ Franklin's Gardens",
        location: "Початок наступного туру Gallagher PREM",
      },
      {
        round: "16 травня 2026 · анонс",
        teams: "Bath Rugby vs Newcastle Red Bulls",
        date: "14:00, The Rec",
        location: "Bath прагне втримати позицію в зоні домашнього півфіналу",
      },
      {
        round: "16 травня 2026 · анонс",
        teams: "Saracens vs Gloucester Rugby",
        date: "17:30, StoneX Stadium",
        location: "Важливий матч для гонки за єврокубкові та плей-оф місця",
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
      { position: 1, name: "Glasgow Warriors", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Glasgow-Warriors-1.svg", played: 17, won: 12, lost: 5, points: 60 },
      { position: 2, name: "DHL Stormers", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/08/Stormers.svg", played: 17, won: 12, lost: 4, points: 59 },
      { position: 3, name: "Leinster Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Leinster.svg", played: 17, won: 11, lost: 6, points: 58 },
      { position: 4, name: "Vodacom Bulls", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Vodacom.svg", played: 17, won: 11, lost: 6, points: 54 },
      { position: 5, name: "Fidelity SecureDrive Lions", logo: "https://www.unitedrugby.com/wp-content/uploads/2026/03/Fidelity-SecureDrive-Lions.svg", played: 17, won: 10, lost: 6, points: 53 },
      { position: 6, name: "Munster Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Munster-Rugby.svg", played: 17, won: 10, lost: 7, points: 51 },
      { position: 7, name: "Cardiff Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Cardiff-Rugby-1.svg", played: 17, won: 10, lost: 7, points: 50 },
      { position: 8, name: "Ulster Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Ulster-1.svg", played: 17, won: 9, lost: 7, points: 50 },
      { position: 9, name: "Connacht Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Connacht.svg", played: 17, won: 9, lost: 8, points: 49 },
      { position: 10, name: "Hollywoodbets Sharks", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Hollywoodbets-Sharks.svg", played: 17, won: 7, lost: 9, points: 41 },
      { position: 11, name: "Ospreys", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Ospreys-1.svg", played: 17, won: 7, lost: 8, points: 39 },
      { position: 12, name: "Edinburgh Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Edinburgh-1.svg", played: 17, won: 7, lost: 10, points: 38 },
      { position: 13, name: "Benetton Rugby", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Benetton-Rugby-1.svg", played: 17, won: 6, lost: 9, points: 33 },
      { position: 14, name: "Scarlets", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Scarlets-1.svg", played: 17, won: 4, lost: 12, points: 25 },
      { position: 15, name: "Dragons RFC", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Dragons-1.svg", played: 17, won: 3, lost: 11, points: 25 },
      { position: 16, name: "Zebre Parma", logo: "https://www.unitedrugby.com/wp-content/uploads/2025/05/Zebre-Parma-1.svg", played: 17, won: 2, lost: 15, points: 15 },
    ],
    matches: [
      {
        round: "10 травня 2026 · результат",
        teams: "Ulster Rugby 38:38 DHL Stormers",
        date: "Kingspan Stadium",
        location: "Найрезультативніша ніч Round 17 завершилася бойовою нічиєю",
      },
      {
        round: "10 травня 2026 · результат",
        teams: "Glasgow Warriors 40:17 Cardiff Rugby",
        date: "Scotstoun Stadium",
        location: "Glasgow закріпився на першому місці перед фінальним туром",
      },
      {
        round: "10 травня 2026 · результат",
        teams: "Leinster Rugby 31:7 Fidelity SecureDrive Lions",
        date: "Aviva Stadium",
        location: "Leinster оформив переконливу домашню перемогу",
      },
      {
        round: "10 травня 2026 · результат",
        teams: "Connacht Rugby 26:7 Munster Rugby",
        date: "Dexcom Stadium",
        location: "Connacht утримав шанси на топ-8",
      },
      {
        round: "15 травня 2026 · анонс",
        teams: "Munster Rugby vs Fidelity SecureDrive Lions",
        date: "21:35 (Київ), Thomond Park",
        location: "Ключовий матч верхньої частини таблиці в Round 18",
      },
      {
        round: "15 травня 2026 · анонс",
        teams: "Leinster Rugby vs Ospreys",
        date: "19:15 (Київ), Aviva Stadium",
        location: "Остання гра Leinster перед плей-оф URC",
      },
      {
        round: "15 травня 2026 · анонс",
        teams: "Cardiff Rugby vs DHL Stormers",
        date: "21:35 (Київ), Cardiff Arms Park",
        location: "Кардіфф приймає другого претендента на перше місце",
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
    image: "/championship-six-nations.svg",
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
    aliases: ["Champions Cup"],
    season: "2025/26",
    region: "Європа",
    format: "Клуби",
    description:
      "Головний європейський клубний кубок, де після пулового етапу турнір переходить у плей-оф і кожен матч уже працює як окрема історія на виліт.",
    image:
      "https://media-cdn.incrowdsports.com/77535d85-bcdc-49b9-9dc9-879e70d9adba.svg?format=webp&width=1920",
    standings: [
      { position: 1, name: "Glasgow Warriors", logo: "https://media-cdn.incrowdsports.com/f0e4ca1a-3001-42d4-a134-befe8348540c.png?format=webp&width=125", played: 4, won: 4, lost: 0, points: 20 },
      { position: 2, name: "Union Bordeaux Bègles", logo: "https://media-cdn.cortextech.io/3a3f88b1-d089-4b5a-aece-26469a437790.png?format=webp&width=125", played: 4, won: 4, lost: 0, points: 20 },
      { position: 3, name: "Leinster Rugby", logo: "https://media-cdn.incrowdsports.com/02ec4396-a5c2-49b2-bd5d-4056277b1278.png?format=webp&width=125", played: 4, won: 4, lost: 0, points: 18 },
      { position: 4, name: "Bath Rugby", logo: "https://media-cdn.incrowdsports.com/f4d9a293-9086-41bf-aa1b-c98d1c62fe3b.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 16 },
      { position: 5, name: "Northampton Saints", logo: "https://media-cdn.incrowdsports.com/45fedf62-349b-46af-a6c9-2504dd82ee8c.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 16 },
      { position: 6, name: "Harlequins", logo: "https://media-cdn.incrowdsports.com/ff7fb9b3-4a02-4407-b075-1d125962ce21.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 15 },
      { position: 7, name: "RC Toulon", logo: "https://media-cdn.incrowdsports.com/c460bc92-ecd2-48d5-9f8e-ae8e12a2ebf4.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 14 },
      { position: 8, name: "Bristol Bears", logo: "https://media-cdn.incrowdsports.com/714ab764-0396-4c96-80df-4013a723d172.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 14 },
    ],
    matches: [
      {
        round: "23 травня 2026 · фінал (анонс)",
        teams: "Leinster Rugby vs Union Bordeaux Bègles",
        date: "16:45 (Київ), San Mamés Stadium",
        location: "Офіційний анонс фіналу Investec Champions Cup",
      },
      {
        round: "2 травня 2026 · півфінал",
        teams: "Leinster Rugby 29:25 RC Toulon",
        date: "17:00 (Київ), Aviva Stadium",
        location: "Результат півфіналу Investec Champions Cup",
      },
      {
        round: "3 травня 2026 · півфінал",
        teams: "Union Bordeaux Bègles 38:26 Bath Rugby",
        date: "17:00 (Київ), Stade Atlantique Bordeaux Métropole",
        location: "Результат півфіналу Investec Champions Cup",
      },
      {
        round: "10 квітня 2026 · чвертьфінал",
        teams: "Bath Rugby 43:41 Northampton Saints",
        date: "The Rec",
        location: "Результат чвертьфіналу за офіційною сторінкою EPCR",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Glasgow Warriors 19:22 RC Toulon",
        date: "Scotstoun Stadium",
        location: "RC Toulon вийшов до півфіналу після виїзної перемоги",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Leinster Rugby 43:13 Sale Sharks",
        date: "Aviva Stadium",
        location: "Результат чвертьфіналу за офіційною сторінкою EPCR",
      },
      {
        round: "12 квітня 2026 · чвертьфінал",
        teams: "Union Bordeaux Bègles 30:15 Stade Toulousain",
        date: "Stade Chaban-Delmas",
        location: "Результат чвертьфіналу за офіційною сторінкою EPCR",
      },
    ],
  },
  {
    slug: "champions-cup",
    title: "Investec Champions Cup",
    aliases: ["Investec Champions Cup", "Champions Cup"],
    season: "2025/26",
    region: "Європа",
    format: "Клуби",
    description:
      "Головний європейський клубний кубок, де після пулового етапу турнір переходить у плей-оф і кожен матч уже працює як окрема історія на виліт.",
    image:
      "https://media-cdn.incrowdsports.com/77535d85-bcdc-49b9-9dc9-879e70d9adba.svg?format=webp&width=1920",
    standings: [
      { position: 1, name: "Glasgow Warriors", logo: "https://media-cdn.incrowdsports.com/f0e4ca1a-3001-42d4-a134-befe8348540c.png?format=webp&width=125", played: 4, won: 4, lost: 0, points: 20 },
      { position: 2, name: "Union Bordeaux Bègles", logo: "https://media-cdn.cortextech.io/3a3f88b1-d089-4b5a-aece-26469a437790.png?format=webp&width=125", played: 4, won: 4, lost: 0, points: 20 },
      { position: 3, name: "Leinster Rugby", logo: "https://media-cdn.incrowdsports.com/02ec4396-a5c2-49b2-bd5d-4056277b1278.png?format=webp&width=125", played: 4, won: 4, lost: 0, points: 18 },
      { position: 4, name: "Bath Rugby", logo: "https://media-cdn.incrowdsports.com/f4d9a293-9086-41bf-aa1b-c98d1c62fe3b.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 16 },
      { position: 5, name: "Northampton Saints", logo: "https://media-cdn.incrowdsports.com/45fedf62-349b-46af-a6c9-2504dd82ee8c.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 16 },
      { position: 6, name: "Harlequins", logo: "https://media-cdn.incrowdsports.com/ff7fb9b3-4a02-4407-b075-1d125962ce21.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 15 },
      { position: 7, name: "RC Toulon", logo: "https://media-cdn.incrowdsports.com/c460bc92-ecd2-48d5-9f8e-ae8e12a2ebf4.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 14 },
      { position: 8, name: "Bristol Bears", logo: "https://media-cdn.incrowdsports.com/714ab764-0396-4c96-80df-4013a723d172.png?format=webp&width=125", played: 4, won: 3, lost: 1, points: 14 },
    ],
    matches: [
      {
        round: "23 травня 2026 · фінал (анонс)",
        teams: "Leinster Rugby vs Union Bordeaux Bègles",
        date: "16:45 (Київ), San Mamés Stadium",
        location: "Офіційний анонс фіналу Investec Champions Cup",
      },
      {
        round: "2 травня 2026 · півфінал",
        teams: "Leinster Rugby 29:25 RC Toulon",
        date: "17:00 (Київ), Aviva Stadium",
        location: "Результат півфіналу Investec Champions Cup",
      },
      {
        round: "3 травня 2026 · півфінал",
        teams: "Union Bordeaux Bègles 38:26 Bath Rugby",
        date: "17:00 (Київ), Stade Atlantique Bordeaux Métropole",
        location: "Результат півфіналу Investec Champions Cup",
      },
      {
        round: "10 квітня 2026 · чвертьфінал",
        teams: "Bath Rugby 43:41 Northampton Saints",
        date: "The Rec",
        location: "Результат чвертьфіналу за офіційною сторінкою EPCR",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Glasgow Warriors 19:22 RC Toulon",
        date: "Scotstoun Stadium",
        location: "RC Toulon вийшов до півфіналу після виїзної перемоги",
      },
      {
        round: "11 квітня 2026 · чвертьфінал",
        teams: "Leinster Rugby 43:13 Sale Sharks",
        date: "Aviva Stadium",
        location: "Результат чвертьфіналу за офіційною сторінкою EPCR",
      },
      {
        round: "12 квітня 2026 · чвертьфінал",
        teams: "Union Bordeaux Bègles 30:15 Stade Toulousain",
        date: "Stade Chaban-Delmas",
        location: "Результат чвертьфіналу за офіційною сторінкою EPCR",
      },
    ],
  },
];
