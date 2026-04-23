# Vercel Deploy Setup Pass

Коротка перевірка того, як саме цей проєкт має бути налаштований у `Vercel`.

## Що вже готово в репозиторії

- `postinstall: prisma generate`
- `vercel-build: prisma generate && next build`
- production env шаблон у `.env.production.example`
- окремий `Prisma Postgres` flow у документації

## Recommended Vercel Project Settings

- `Framework Preset`: `Next.js`
- `Root Directory`: корінь репозиторію
- `Install Command`: `npm install`
- `Build Command`: `npm run vercel-build`
- `Output Directory`: default Next.js

## Environment Variables

У `Vercel Production` мають бути задані:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Опціонально:

- `NEXT_PUBLIC_GA_ID`

Для `Preview` бажано мати окремий `DATABASE_URL`.

## Database / Migration Note

Поточний важливий нюанс:

- проєкт уже переключено на `Postgres`
- `next build` читає дані з БД під час збірки
- тому Vercel build потребує доступної БД

Практичне правило:

1. Спочатку підготувати production `Postgres`
2. Застосувати migration
3. Лише після цього запускати перший production deploy

Production migration команда:

```bash
npm run db:migrate:deploy
```

`db:seed` не є частиною Vercel production deploy flow.

## Current Readiness Verdict

Що вже ок:

- env map під Vercel описаний
- build/install assumptions описані
- Prisma runtime уже Postgres-compatible

Що ще треба пам'ятати перед першим deploy:

- `DATABASE_URL` має вести на живий production `Postgres`
- production migration повинні бути застосовані до deploy або в release flow
- якщо БД недоступна, Vercel build теж впаде, бо сторінки збирають дані з Prisma
