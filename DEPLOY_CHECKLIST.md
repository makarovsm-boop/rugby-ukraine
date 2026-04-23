# Deploy Checklist

## Recommended Target

Для цього проєкту рекомендований сценарій:

- `Vercel` для хостингу Next.js
- `Prisma Postgres` для production БД

Причина:

- це найпростіший і найприродніший шлях для `Next.js App Router`
- Prisma має офіційну документацію саме для `Next.js + Vercel`
- інтеграція Prisma Postgres у Vercel спрощує налаштування `DATABASE_URL`

Короткий flow окремо описано в:

```text
VERCEL_LAUNCH_FLOW.md
```

## 1. Environment Variables

Створіть production `.env` на основі `.env.production.example`.

Потрібні змінні:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`

Приклад:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/rugby_ukraine?schema=public"
NEXTAUTH_URL="https://rugby-ukraine.example.com"
NEXTAUTH_SECRET="replace-with-a-long-random-secret-for-production"
NEXT_PUBLIC_SITE_URL="https://rugby-ukraine.example.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## 2. Database

Для production у цьому сценарії використовуйте `Prisma Postgres`.

Очікуваний порядок:

1. Створити базу `Prisma Postgres`
2. Підключити її до Vercel-проєкту
3. Перевірити, що в середовище потрапив коректний `DATABASE_URL`

Після налаштування `DATABASE_URL`:

```bash
npx prisma generate
```

Для production migration flow використовуйте:

```bash
npm run db:migrate:deploy
```

`npm run db:seed` тут не використовується. Він лишається тільки для локального/dev сценарію.

## 3. Build Check

Перевірка production-збірки:

```bash
npm run db:migrate:deploy
npm run vercel-build
npm run start
```

Під Vercel Prisma client має генеруватися автоматично через:

```json
"postinstall": "prisma generate"
```

І додатково явно через:

```json
"vercel-build": "prisma generate && next build"
```

За замовчуванням застосунок стартує на:

```text
http://localhost:3000
```

## 4. Before Deploy

Перевірити:

1. `NEXTAUTH_URL` збігається з реальним доменом
2. `NEXT_PUBLIC_SITE_URL` збігається з реальним доменом
3. `NEXTAUTH_SECRET` не є тестовим значенням
4. `DATABASE_URL` вказує на production БД
5. `NEXT_PUBLIC_GA_ID` заповнено, якщо потрібна аналітика
6. `npm run vercel-build` проходить без помилок
7. `/login`, `/admin/articles`, `/search`, `/sitemap.xml`, `/robots.txt` відкриваються коректно
8. На Vercel задані саме production env, а не локальні значення з `.env.example`
9. Якщо використовується Preview, у нього окремий `DATABASE_URL`

## 5. Pre-Launch Pass

Перед публічним запуском швидко пройтись по цьому списку:

1. `npx prisma validate`
2. `npx prisma generate`
3. `npm run db:migrate:deploy`
4. `npm run lint`
5. `npm run vercel-build`
6. `npm run start` у середовищі без обмежень на порт
7. Перевірити в браузері основні маршрути:
   - `/`
   - `/news`
   - `/championships`
   - `/teams`
   - `/players`
   - `/matches`
   - `/search`
   - `/login`
   - `/profile`
   - `/admin/articles`
8. Перевірити auth flow:
   - вхід
   - вихід
   - доступ до профілю
   - доступ до адмінки за ролями
9. Перевірити production-контент:
   - є щонайменше кілька реальних новин
   - є команди
   - є гравці
   - є чемпіонати
   - є матчі
10. Перевірити базові GA-події після заповнення `NEXT_PUBLIC_GA_ID`:
   - page view
   - search submit
   - login success / failure
   - comment submit

## 6. Notes

- Поточний репозиторій підготовлено під target `Vercel + Prisma Postgres`, але сам deploy не налаштовано.
- Production deploy flow для БД: `prisma migrate deploy`, без `seed` і без reset.
