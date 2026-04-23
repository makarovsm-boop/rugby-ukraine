# MVP Handoff

## Current MVP State

Проєкт знаходиться у стані робочого `production-ready MVP` для подальшого розвитку.

Технологічна база:

- `Next.js App Router`
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `NextAuth`
- локальна `SQLite` для dev

Поточний рекомендований production target:

- `Vercel + Prisma Postgres`

## What Is Ready

### Public product

Готово:

- головна сторінка
- новини
- сторінка окремої новини
- чемпіонати
- сторінка турніру
- команди
- сторінка команди
- гравці
- сторінка гравця
- матчі
- сторінка матчу
- розділ `Для новачків`
- сторінка `Про проєкт`
- пошук по сайту

### Data and backend

Готово:

- Prisma schema
- seed-дані
- підключення сайту до Prisma
- базова підготовка до production БД
- notes по переходу з `SQLite` на `Postgres`

### Auth and access

Готово:

- login через `NextAuth Credentials`
- профіль користувача
- зміна пароля
- ролі `USER`, `EDITOR`, `ADMIN`
- базовий middleware/proxy захист
- обмеження доступу до адмінки за ролями

### Admin

Готово:

- адмінський layout і навігація
- dashboard `/admin`
- CRUD для статей
- CRUD для команд
- CRUD для гравців
- CRUD для чемпіонатів
- CRUD для матчів
- moderation / management для коментарів
- просте управління користувачами
- `draft / published` flow для статей
- завантаження зображень
- прев’ю медіа в адмінці
- валідація форм

### SEO and launch prep

Готово:

- metadata
- `robots.txt`
- `sitemap.xml`
- базові canonical URL
- `structured data` для ключових сторінок
- notes для `Google Search Console`
- deploy checklist
- post-launch UX checklist
- ops notes

### Quality and polish

Готово:

- базовий performance pass
- error / loading / not-found / fallback states
- фінальна стабілізація MVP
- покращений mobile UX у ключових публічних розділах

## What Is Intentionally Deferred

Свідомо відкладено:

- реальний production deploy
- фактичний перехід production БД на `Postgres`
- перенесення даних з `SQLite` у `Postgres`
- зовнішня storage/media інфраструктура
- складний rich text editor
- recovery flow для паролів
- moderation workflow в кілька статусів
- окрема аналітична панель
- автоматичні backup jobs
- зовнішні пошукові сервіси
- складна ACL-система

## Closest Priorities After Handoff

Найближчі практичні пріоритети:

1. зробити реальний production deploy на `Vercel`
2. перейти з `SQLite` на `Postgres`
3. перевірити production `auth`, `env`, `build/start`, `robots`, `sitemap`
4. пройти post-launch UX review після перших користувачів
5. вирішити, чи потрібен наступний цикл:
   - контентне наповнення
   - production media strategy
   - розширення адмінки

## Recommended Next Workstream

Найлогічніший наступний етап після handoff:

- `deploy + production DB switch + first real user feedback pass`

## Important Notes for the Next Owner

Що важливо знати:

- локально проєкт зараз розрахований на `SQLite`
- production target уже визначений, але ще не реалізований повністю
- `db:seed` зараз перезаписує локальні тестові дані
- `admin`, `login`, `profile`, `search` не призначені для індексації
- docs для launch, Search Console, UX і ops уже підготовлені окремими файлами
