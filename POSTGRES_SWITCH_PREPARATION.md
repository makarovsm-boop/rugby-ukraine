# Postgres Switch Preparation

## Goal

Цей документ зберігає підготовчі нотатки до switch. Сам switch у проєкті вже виконано окремим кроком.

Поточний стан:

- проєкт уже орієнтований на `Postgres`
- production target визначений як `Vercel + Prisma Postgres`

## 1. Datasource Strategy

### Current

Зараз у `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
}
```

### Planned switch

Під час реального переходу:

```prisma
datasource db {
  provider = "postgresql"
}
```

### Important note

`prisma.config.ts` уже побудований правильно для обох сценаріїв, бо читає єдине джерело:

- `DATABASE_URL`

Тобто змінювати `prisma.config.ts` під `Postgres` не потрібно.

## 2. Prisma Client Strategy

### Current

Зараз runtime вже частково підготовлений:

- adapter creation винесено в окремий helper
- `SQLite` лишається поточним dev-сценарієм
- для `Postgres` уже підготовлена окрема runtime-гілка

### Planned switch

Для `Postgres` у Prisma 7 все одно потрібен adapter, але вже не `better-sqlite3`.

Цільовий runtime:

- `@prisma/adapter-pg`
- `PrismaPg({ connectionString: process.env.DATABASE_URL })`
- `new PrismaClient({ adapter })`

### Why this is recommended

- runtime більше не захардкожений лише під SQLite
- `Postgres`-гілка підготовлена окремо
- наступний крок зводиться до schema/provider switch і встановлення потрібного adapter package

## 3. Seed Strategy

### Current

Зараз `prisma/seed.ts`:

- теж прив'язаний до `@prisma/adapter-better-sqlite3`
- очищає таблиці через `deleteMany`
- заново заливає тестові дані

### Planned switch

Для `Postgres` seed теж має перейти на стандартний `PrismaClient`.

Цільова ідея:

- залишити dev/staging seed для тестових середовищ
- не використовувати поточний destructive seed як production bootstrap

### Safe strategy

Після switch мати два сценарії:

1. `dev/staging seed`
   - повний reset тестових даних

2. `production bootstrap`
   - окремий безпечний сценарій
   - без повного очищення таблиць

### Practical note

У найближчому технічному кроці достатньо:

- адаптувати поточний seed під `Postgres`
- залишити його для локальної та staging-перевірки

## 4. Package Changes Plan

### Current SQLite-specific packages

Зараз у `package.json` є:

- `better-sqlite3`
- `@prisma/adapter-better-sqlite3`

### Planned package cleanup after switch

Після реального переходу на `Postgres`:

- прибрати `better-sqlite3`
- прибрати `@prisma/adapter-better-sqlite3`

Залишаються:

- `@prisma/client`
- `prisma`
- `tsx`
- інші поточні runtime/dev залежності

## 5. Code Areas That Will Change

Під час реального switch змінюватимуться:

1. `prisma/schema.prisma`
2. `lib/prisma.ts`
3. `prisma/seed.ts`
4. `package.json`
5. `package-lock.json`

Ймовірно також:

6. `PRODUCTION_DB_MIGRATION_NOTES.md`
7. `README.md`
8. `DEPLOY_CHECKLIST.md`

## 6. Recommended Execution Order

Коли будемо робити сам switch, правильний порядок такий:

1. змінити `schema.prisma` на `postgresql`
2. оновити `lib/prisma.ts` на стандартний `PrismaClient`
3. оновити `prisma/seed.ts` під `Postgres`
4. прибрати SQLite-specific пакети
5. виконати `npm install`
6. виконати `npx prisma generate`
7. прогнати `npm run lint`
8. прогнати `npm run build`

## 7. Important Limitation

Цей крок не робить:

- реальний перехід на production `Postgres`
- міграцію даних з локального `SQLite`
- зміну поточного локального dev flow

У цьому кроці зафіксовано саме технічну підготовку й безпечний план переходу.
