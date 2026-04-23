# Postgres Switch Execution Plan

Практичний план реального переходу проєкту з `SQLite` на `Postgres` без виконання самого switch у цьому кроці.

## 1. Мета

Перевести production-сценарій на `Postgres`, але не зламати:

- локальну розробку на `SQLite`
- поточний MVP flow
- Prisma runtime у dev

## 2. Поточний стан

Зараз у проєкті:

- локальний dev працює на `SQLite`
- Prisma schema все ще має:
  - `provider = "sqlite"`
- runtime уже частково підготовлений:
  - [lib/prisma-adapter.ts](/Volumes/KINGSTON/Projects/rugby/lib/prisma-adapter.ts)
  - є окрема гілка для `Postgres`
- production target уже визначений як:
  - `Vercel + Prisma Postgres`

## 3. Головний принцип переходу

Не робити switch "по частинах" у production-гілці.

Правильний підхід:

1. Спочатку підготувати production env.
2. Окремо підготувати production `Postgres`.
3. Окремим кроком переключити Prisma schema і runtime.
4. Після цього перевірити build, seed, auth і admin flow.
5. Лише потім деплоїти.

## 4. Що змінювати в Prisma

### A. `prisma/schema.prisma`

Під час реального switch:

```prisma
datasource db {
  provider = "postgresql"
}
```

Це головна точка cutover.

Поки `provider = "sqlite"`, Prisma schema лишається локально SQLite-орієнтованою.

### B. `lib/prisma-adapter.ts`

Цей файл уже правильний як проміжний шар.

Що робити під час switch:

- встановити `@prisma/adapter-pg`
- переконатися, що Postgres branch реально працює
- не чіпати adapter logic до моменту, поки production env і schema не готові

### C. `lib/prisma.ts`

Після switch залишити єдиний Prisma entrypoint, але вже з `Postgres` runtime як production-first сценарієм.

### D. `prisma/seed.ts`

Після switch:

- seed має працювати з `Postgres`
- але не повинен використовуватись як production reset tool

Правило:

- `seed` лишається для:
  - локального dev
  - staging
- не для бойового production reset

## 5. Package Plan

### Під час реального switch додати

- `@prisma/adapter-pg`
- `pg`

### SQLite залежності не прибирати одразу

Щоб не зламати локальний dev відразу, на першому етапі краще лишити:

- `better-sqlite3`
- `@prisma/adapter-better-sqlite3`

Це дає безпечний перехідний період:

- production already ready for Postgres
- local dev still works on SQLite

### Коли прибирати SQLite пакети

Лише після того, як ви свідомо вирішите:

- або теж перевести локальну розробку на Postgres
- або більше не підтримувати SQLite dev flow

## 6. Safe Execution Order

Ось правильний порядок дій для реального switch:

### Step 1. Підготувати production env

У `Vercel` мають бути готові:

- `DATABASE_URL` -> production Postgres
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### Step 2. Підготувати Postgres database

Потрібно:

- створити production `Postgres`
- отримати реальний `DATABASE_URL`
- не чіпати локальний `SQLite`

### Step 3. Встановити Postgres packages

Під час фактичного switch:

```bash
npm install pg @prisma/adapter-pg
```

Поки що без видалення SQLite пакетів.

### Step 4. Переключити Prisma schema provider

У [prisma/schema.prisma](/Volumes/KINGSTON/Projects/rugby/prisma/schema.prisma):

- змінити `sqlite` на `postgresql`

### Step 5. Згенерувати Prisma client

```bash
npx prisma generate
```

### Step 6. Підготувати migration flow

Після switch schema:

- створити першу Postgres migration
- перевірити, що schema компілюється без provider-specific сюрпризів

### Step 7. Перевірити локально

Обов'язково прогнати:

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run build
```

### Step 8. Окремо перевірити сценарії

- auth
- admin
- search
- comments
- article CRUD
- image upload

## 7. Як не зламати локальну розробку

Найбезпечніший варіант:

- не переводити локальний `.env` на Postgres в той самий день, коли ви тільки готуєте production switch
- не видаляти SQLite packages одразу
- не переписувати dev flow раніше, ніж підтверджено production runtime

Практично:

- локально продовжуєте використовувати `.env` з `SQLite`
- production у Vercel використовує окремий `DATABASE_URL` на `Postgres`

Важливе уточнення:

Щойно `schema.prisma` офіційно стане `postgresql`, локальна Prisma-робота теж буде очікувати Postgres-compatible schema flow.

Тому є два реалістичні шляхи:

### Варіант A. Короткий перехідний період

- schema переключається на `postgresql`
- локально ви теж тимчасово тестуєте через Postgres
- SQLite dev flow поступово завершується

### Варіант B. Чітке розділення до deploy

- switch робиться в окремій release-гілці
- після deploy локальний dev теж переводиться на Postgres

Для цього проєкту я рекомендую `Варіант B`, бо він чистіший і менш плутаний.

## 8. Що не робити

Не варто:

- міняти `schema.prisma` занадто рано
- одночасно чистити всі SQLite залежності
- запускати destructive seed на production БД
- змішувати production і preview на одній БД
- переносити локальний `.env` у Vercel як є

## 9. Practical Recommendation

Найправильніший реальний порядок для цього проєкту:

1. `81. Production env finalization`
2. підняти production `Postgres`
3. виконати switch у окремому технічному кроці
4. перевірити `build + auth + admin + search`
5. задеплоїти

## 10. Ready-to-Execute Verdict

Проєкт уже підготовлений до planning stage переходу на `Postgres`.

Для фактичного switch далі потрібен окремий execution step, у якому будуть:

- package install
- schema provider switch
- Prisma generate / validate
- smoke pass на ключових flow
