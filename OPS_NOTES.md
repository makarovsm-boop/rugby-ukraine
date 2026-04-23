# Ops Notes

## Scope

Ці нотатки покривають лише базові операційні дії без зовнішньої інфраструктури:

- backup бази
- backup `env`
- що робити при проблемах з `auth`
- що робити при проблемах з `seed`

## 1. Backup Database

### SQLite local backup

Поточна локальна база в проєкті:

```text
prisma/dev.db
```

Найпростіший backup:

```bash
cd /Volumes/KINGSTON/Projects/rugby
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y-%m-%d-%H%M%S)
```

Коли робити:

- перед `db:seed`
- перед змінами schema
- перед ручними правками даних

### Restore SQLite backup

Якщо треба повернути backup:

```bash
cd /Volumes/KINGSTON/Projects/rugby
cp prisma/dev.db.backup-YYYY-MM-DD-HHMMSS prisma/dev.db
```

Після цього:

```bash
npx prisma generate
npm run dev
```

## 2. Backup Env

### Local env backup

Перед змінами в `.env`:

```bash
cd /Volumes/KINGSTON/Projects/rugby
cp .env .env.backup-$(date +%Y-%m-%d-%H%M%S)
```

### Restore env backup

```bash
cd /Volumes/KINGSTON/Projects/rugby
cp .env.backup-YYYY-MM-DD-HHMMSS .env
```

Після відновлення краще перезапустити dev-сервер:

```bash
npm run dev
```

## 3. Auth Problems

### Problem: JWT_SESSION_ERROR / decryption failed

Ознака:

- помилка типу `JWT_SESSION_ERROR`
- після зміни `NEXTAUTH_SECRET` або `.env` сайт перестає нормально логінити

Що робити:

1. перевірити `.env`
2. переконатися, що `NEXTAUTH_SECRET` не порожній і не випадково змінений
3. перезапустити dev-сервер
4. очистити cookies для `localhost`
5. увійти заново

Локальний стабільний приклад:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rugby-nextauth-secret-local-2026"
```

### Problem: cannot login with seeded admin

Що перевірити:

1. чи існує користувач у seed
2. чи пройшов `npm run db:seed`
3. чи не змінили локальну БД після seed
4. чи не зламали `DATABASE_URL`

Безпечний шлях:

```bash
cd /Volumes/KINGSTON/Projects/rugby
npx prisma generate
npm run db:seed
npm run dev
```

Тестовий вхід:

```text
Email: admin@rugby-ukraine.local
Пароль: rugby123
```

### Problem: role behaves incorrectly

Що перевірити:

1. користувач увійшов заново після змін у ролях
2. стара cookie-сесія очищена
3. у БД правильне значення `role`

Найшвидше рішення:

- вийти
- очистити cookies
- увійти заново

## 4. Seed Problems

### Important behavior

Поточний `seed`:

- очищає таблиці через `deleteMany`
- створює seed-дані заново

Тобто `npm run db:seed` зараз не дописує, а фактично перевстановлює локальні тестові дані.

### Problem: seed failed

Базова перевірка:

```bash
cd /Volumes/KINGSTON/Projects/rugby
npx prisma validate
npx prisma generate
npm run db:seed
```

Якщо seed падає:

1. перевірити `DATABASE_URL`
2. перевірити, що `prisma/dev.db` доступна для запису
3. перевірити, що залежності встановлені коректно
4. перечитати помилку Prisma у терміналі

### Safe reset path for local SQLite

Якщо локальна БД зламана або в неконсистентному стані:

1. зробити backup поточної БД
2. відновити або пересіяти базу

Команди:

```bash
cd /Volumes/KINGSTON/Projects/rugby
cp prisma/dev.db prisma/dev.db.backup-before-reset-$(date +%Y-%m-%d-%H%M%S)
npx prisma generate
npm run db:seed
```

### Problem: seed ran, but site looks empty

Що перевірити:

1. чи дійсно використовується правильний `.env`
2. чи не дивиться застосунок на іншу БД
3. чи був перезапущений `npm run dev`
4. чи відкриті саме публічні маршрути, а не порожні фільтри

## 5. Minimal Recovery Checklist

Якщо щось пішло не так і треба швидко повернутися в робочий стан:

1. відновити `.env` з backup
2. відновити `prisma/dev.db` з backup або пересіяти БД
3. запустити:

```bash
cd /Volumes/KINGSTON/Projects/rugby
npx prisma generate
npm run dev
```

4. перевірити:

- `/`
- `/login`
- `/news`
- `/admin/articles`

## 6. Notes

- Для локальної розробки backup `cp` достатній, бо база зараз `SQLite`.
- Для production notes по `Postgres` треба буде вести окремо після фактичного переходу з `SQLite`.
- Поточний документ не налаштовує автоматичні backup jobs, а лише фіксує ручний safe flow.
