# Launch Execution Checklist

Практичний checklist на день першого публічного запуску MVP без самого запуску в межах цього кроку.

## 1. Що зробити прямо в день запуску

### Перед deploy

1. Перевірити production env у `Vercel`:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_GA_ID` якщо потрібна аналітика

2. Переконатися, що в production немає:
   - `localhost`
   - `file:./prisma/dev.db`
   - `*.local`
   - test/demo secret values

3. Перевірити build assumptions:
   - `Install Command` = `npm install`
   - `Build Command` = `npm run vercel-build`

4. Переконатися, що є:
   - реальний `ADMIN`
   - окремий `EDITOR`
   - мінімальний набір реального контенту

5. Локально або у staging-style середовищі ще раз пройти:

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run vercel-build
```

### Безпосередньо перед натисканням deploy

- Відкрити [RELEASE_CANDIDATE_CHECKLIST.md](/Volumes/KINGSTON/Projects/rugby/RELEASE_CANDIDATE_CHECKLIST.md)
- Відкрити [PRODUCTION_ENV_FINALIZATION.md](/Volumes/KINGSTON/Projects/rugby/PRODUCTION_ENV_FINALIZATION.md)
- Переконатися, що deploy робиться в правильний проєкт `Vercel`
- Переконатися, що deploy іде з правильної гілки

## 2. Що перевірити одразу після deploy

Перші сторінки для перевірки:

- `/`
- `/news`
- `/matches`
- `/championships`
- `/teams`
- `/players`
- `/search`
- `/login`
- `/robots.txt`
- `/sitemap.xml`

Що важливо:

- сторінки відкриваються без server error
- немає явних broken styles
- немає поламаних зображень у першому екрані
- пошук працює
- `robots` і `sitemap` доступні публічно

## 3. Хто і що має відкрити вручну

### Власник проєкту / PM

Відкрити:

- `/`
- `/news`
- `/matches`
- `/about`

Перевірити:

- чи сайт виглядає публічно готовим
- чи немає очевидних demo-елементів на головних сторінках
- чи є відчуття завершеного MVP

### Editor

Увійти і відкрити:

- `/login`
- `/admin/articles`
- `/admin/comments`

Перевірити:

- вхід працює
- роль `EDITOR` має правильний доступ
- можна створити `Draft`
- можна опублікувати статтю
- можна модерувати коментар

### Admin

Увійти і відкрити:

- `/admin`
- `/admin/articles`
- `/admin/users`

Перевірити:

- повний доступ до адмінки є
- користувачі відображаються коректно
- статті створюються і редагуються
- зображення додаються без поломки форми

### Звичайний користувач / smoke reviewer

Відкрити:

- `/`
- `/search?q=Україна`
- одну статтю
- одну команду
- один матч

Перевірити:

- зрозумілі переходи між сутностями
- немає дивних пустих станів
- немає плейсхолдерного відчуття на ключових екранах

## 4. Minimum manual checks after deploy

### Public flow

- головна -> новини
- головна -> матчі
- команда -> гравець
- матч -> команда
- пошук -> сутність

### Auth flow

- логін
- логаут
- `callbackUrl`
- рольовий доступ

### Admin flow

- створення статті
- `Draft -> Published`
- upload зображення
- видалення коментаря

## 5. Що вважати blocking issue

Запуск краще зупинити або відкотити, якщо є хоча б одна з проблем:

- сайт не відкривається
- логін не працює
- адмінка не працює для `ADMIN`
- production env виставлені неправильно
- `robots.txt` або `sitemap.xml` недоступні
- пошук повністю зламаний
- критично поламані стилі на головній або новинах

## 6. Що не є блокером першого запуску

Не повинно блокувати запуск:

- дрібні copy-огріхи
- другорядні mobile-поліровки
- неідеальний seed у непублічних місцях
- відкладені покращення аналітики

## 7. Short Launch Day Flow

Найкоротший practical flow:

1. перевірити env
2. перевірити build assumptions
3. перевірити реальні акаунти `ADMIN` і `EDITOR`
4. зробити deploy
5. пройти ручний smoke pass
6. дати editor/admin підтвердження
7. лише після цього вважати MVP відкритим публічно
