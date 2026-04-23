# Rugby Ukraine MVP

Next.js MVP-сайт про регбі для української аудиторії.

## Recommended Deploy Target

Рекомендований production-сценарій для цього проєкту:

- `Vercel` для Next.js застосунку
- `Prisma Postgres` як керована production БД

Чому саме так:

- `Next.js` нативно добре підтримується на `Vercel`
- Prisma має окремий офіційний гайд для `Next.js + Prisma Postgres + Vercel`
- `Prisma Postgres` можна підключити до Vercel через інтеграцію, яка автоматично додає `DATABASE_URL`

Поточний стан репозиторію:

- проєкт уже переключено на `Postgres`
- рекомендований target: `Vercel + Prisma Postgres`
- для локального запуску після switch теж потрібен `Postgres DATABASE_URL`

## Local Run

```bash
npm install
npx prisma generate
npm run dev
```

Відкрити:

```text
http://localhost:3000
```

## Environment Variables

Скопіюйте приклад:

```bash
cp .env.example .env
```

Для production використовуйте:

```bash
cp .env.production.example .env
```

Основні змінні:

- `DATABASE_URL` - підключення до бази даних
- `NEXTAUTH_URL` - повний URL застосунку для NextAuth
- `NEXTAUTH_SECRET` - довгий випадковий секрет для сесій
- `NEXT_PUBLIC_SITE_URL` - публічний базовий URL сайту для SEO, sitemap і canonical URL
- `NEXT_PUBLIC_GA_ID` - ідентифікатор Google Analytics 4

Для рекомендованого target `Vercel + Prisma Postgres`:

- `DATABASE_URL` - production connection string до `Prisma Postgres`
- `NEXTAUTH_URL` - реальний production URL на `Vercel`
- `NEXT_PUBLIC_SITE_URL` - той самий production URL
- `NEXTAUTH_SECRET` - окремий безпечний секрет, не тестовий
- `NEXT_PUBLIC_GA_ID` - опціонально, якщо потрібна аналітика

## Production Prep

Перед deploy у сценарії `Vercel + Prisma Postgres` потрібно:

1. Створити проєкт на `Vercel`
2. Підключити `Prisma Postgres`
3. Перенести production env у Vercel Project Settings
4. Встановити production `NEXTAUTH_URL`
5. Встановити production `NEXT_PUBLIC_SITE_URL`
6. Згенерувати безпечний `NEXTAUTH_SECRET`
7. Переконатися, що Prisma client генерується під час install

У репозиторії для цього вже додано:

- `postinstall: prisma generate`
- `vercel-build: prisma generate && next build`
- `db:migrate:deploy: prisma migrate deploy`

Локальна перевірка перед deploy:

```bash
npx prisma generate
npm run lint
npm run vercel-build
```

Production smoke check локально:

```bash
npm run start
```

Повний список кроків:

```text
DEPLOY_CHECKLIST.md
```

Окремі нотатки щодо переходу з `SQLite` на `Postgres`:

```text
PRODUCTION_DB_MIGRATION_NOTES.md
```

Технічна підготовка до `Postgres switch`:

```text
POSTGRES_SWITCH_PREPARATION.md
```

Production migration flow:

```text
PRODUCTION_MIGRATION_FLOW.md
```

Нотатки для `Google Search Console`:

```text
SEARCH_CONSOLE_NOTES.md
```

Нотатки для переходу на реальний контент:

```text
CONTENT_READINESS_NOTES.md
```

First production content pass:

```text
FIRST_PRODUCTION_CONTENT_PASS.md
```

Post-launch UX checklist:

```text
POST_LAUNCH_UX_CHECKLIST.md
```

Post-launch feedback worksheet:

```text
POST_LAUNCH_FEEDBACK_WORKSHEET.md
```

Ops notes:

```text
OPS_NOTES.md
```

MVP handoff:

```text
MVP_HANDOFF.md
```

Vercel launch flow:

```text
VERCEL_LAUNCH_FLOW.md
```

Vercel deploy setup pass:

```text
VERCEL_DEPLOY_SETUP_PASS.md
```

Release candidate checklist:

```text
RELEASE_CANDIDATE_CHECKLIST.md
```

Production env finalization:

```text
PRODUCTION_ENV_FINALIZATION.md
```

Production env verification pass:

```text
PRODUCTION_ENV_VERIFICATION_PASS.md
```

Postgres switch execution plan:

```text
POSTGRES_SWITCH_EXECUTION_PLAN.md
```

Launch execution checklist:

```text
LAUNCH_EXECUTION_CHECKLIST.md
```

Post-deploy smoke pass:

```text
POST_DEPLOY_SMOKE_PASS.md
```

Pre-deploy technical pass:

```text
PRE_DEPLOY_TECHNICAL_PASS.md
```

## Pre-Launch Check

Короткий прогін перед запуском:

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run vercel-build
npm run start
```

## Notes

- Після switch проєкт очікує `Postgres` і локально, і в production.
- Для production у цьому проєкті рекомендовано `Vercel + Prisma Postgres`.
- Deploy у цьому репозиторії не налаштований, тут підготовлено лише target, env і checklist.
- `db:seed` не входить у production deploy flow і призначений тільки для локальної/dev перевірки.
