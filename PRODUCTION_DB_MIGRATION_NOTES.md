# Production Database Migration Notes

## Current State

Цей документ описує міграційну логіку переходу. Сам кодовий switch на `Postgres` уже виконано окремим кроком.

Поточна production-ціль:

- `Vercel` для Next.js
- `Prisma Postgres` для production БД

## Prisma Schema Compatibility Check

Поточна Prisma schema загалом сумісна з `Postgres` на рівні моделей:

- `String`, `Int`, `Boolean`, `DateTime` - сумісні
- `Json` у `Article.tags` - сумісний з `Postgres`
- зв'язки `@relation` і `onDelete: Cascade` - сумісні
- `@unique`, `@default(now())`, `@updatedAt` - сумісні

Висновок:

- структура моделей не потребує повного переписування для переходу на `Postgres`
- головні зміни потрібні в datasource і Prisma runtime configuration

## What Was SQLite-Specific Before The Switch

1. `prisma/schema.prisma`

- `datasource db { provider = "sqlite" }`

2. `lib/prisma.ts`

- використовується `@prisma/adapter-better-sqlite3`
- client створюється через `PrismaBetterSqlite3`

3. `prisma/seed.ts`

- seed жорстко прив'язаний до `@prisma/adapter-better-sqlite3`

4. `package.json`

- встановлені `better-sqlite3` і `@prisma/adapter-better-sqlite3`

## Recommended Migration Path

### Step 1. Switch Prisma datasource

У `prisma/schema.prisma`:

- змінити `provider = "sqlite"` на `provider = "postgresql"`

### Step 2. Keep `DATABASE_URL` as the single connection source

У production використовувати:

- `DATABASE_URL=postgresql://...`

Через це не потрібно змінювати `prisma.config.ts`, бо він уже читає `DATABASE_URL`.

### Step 3. Replace the SQLite Prisma adapter

У `lib/prisma.ts`:

- прибрати `PrismaBetterSqlite3`
- перейти або на стандартний `PrismaClient`, або на `@prisma/adapter-pg`

Для production-простоти рекомендований варіант:

- стандартний `PrismaClient` без SQLite-адаптера

### Step 4. Update seed for Postgres

У `prisma/seed.ts`:

- прибрати `@prisma/adapter-better-sqlite3`
- використовувати `PrismaClient` у режимі `Postgres`

### Step 5. Replace local reset assumptions

Поточний seed працює як повне очищення таблиць через `deleteMany`.

Для production це нормально тільки для:

- staging
- локального тестового середовища

Для реального production seed краще:

- або не використовувати seed взагалі
- або мати окремий безпечний bootstrap script без повного очищення даних

## Migration Notes

Коротко, що потрібно буде зробити окремим кроком:

1. змінити Prisma provider на `postgresql`
2. оновити `lib/prisma.ts` під `Postgres`
3. оновити `prisma/seed.ts` під `Postgres`
4. прибрати SQLite-залежності з `package.json`
5. згенерувати Prisma client
6. створити першу migration для `Postgres`
7. прогнати `prisma migrate deploy` у production-середовищі

## Important Limitation

Цей крок не переносить реальні дані з `SQLite` у `Postgres`.

Тут підготовлено:

- аналіз сумісності schema
- перелік SQLite-залежних місць
- короткий план переходу

Окремий крок міграції даних знадобиться лише якщо треба переносити вже існуючу локальну контентну базу.
