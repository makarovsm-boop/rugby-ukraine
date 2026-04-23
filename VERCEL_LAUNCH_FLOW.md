# Vercel Launch Flow

## Recommended Target

Фінальний deploy target для цього проєкту:

- `Vercel` для Next.js застосунку
- `Prisma Postgres` для production БД

## Final Env Map for Vercel

Коротке правило:

- локальний `.env` не переносимо в production як є
- у `Vercel` заповнюємо env окремо руками
- джерело шаблону для production: `.env.production.example`

### Production

Обов'язково:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Опціонально:

- `NEXT_PUBLIC_GA_ID`

Приклад:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://rugby-ukraine.example.com"
NEXTAUTH_SECRET="long-random-production-secret"
NEXT_PUBLIC_SITE_URL="https://rugby-ukraine.example.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Preview

Рекомендовано:

- окремий `DATABASE_URL` для Preview
- не використовувати ту саму БД, що й у Production

Примітка:

- інтеграція `Prisma Postgres` у Vercel може автоматично проставити `DATABASE_URL`
- це висновок з офіційної документації Prisma/Vercel integration

## Build / Install Assumptions

Для Vercel у проєкті зараз прийнято:

- `Install Command`: стандартний `npm install`
- `Build Command`: `npm run vercel-build`
- `Output Directory`: за замовчуванням Next.js

У репозиторії вже є:

```json
"postinstall": "prisma generate",
"vercel-build": "prisma generate && next build"
```

Пояснення:

- `postinstall` підстраховує генерацію Prisma Client
- `vercel-build` ще раз явно генерує Prisma Client перед build
- migration step для production БД буде логічно додати окремо після завершення `Postgres switch`

## Short Launch Flow

1. Імпортувати репозиторій у `Vercel`
2. Підключити `Prisma Postgres`
3. Заповнити production env variables
4. За потреби окремо налаштувати Preview env
5. Перевірити, що Build Command = `npm run vercel-build`
6. Перед першим deploy застосувати production migration
7. Запустити перший production deploy
8. Після deploy вручну перевірити:
   - `/`
   - `/news`
   - `/matches`
   - `/login`
   - `/admin/articles`
   - `/robots.txt`
   - `/sitemap.xml`

## Important Notes

- Зміни env variables на Vercel застосовуються лише до нових deployment-ів.
- Поточний проєкт уже добре підготовлений під Vercel як Next.js застосунок.
- Проєкт уже переключено на `Postgres`, тому у Vercel має бути заданий реальний production `DATABASE_URL`.
- Оскільки `next build` читає дані з Prisma, перший deploy потребує доступної БД і застосованих migration.
