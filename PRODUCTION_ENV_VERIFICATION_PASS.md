# Production Env Verification Pass

Коротка перевірка production env перед реальним deploy на `Vercel`.

## Verification Result

Поточний статус цього pass:

- env map у репозиторії узгоджений
- код реально використовує тільки очікувані production env
- критичних розбіжностей між шаблонами і кодом не знайдено
- production env у `Vercel` ще треба виставити вручну реальними значеннями

Практичний verdict:

- `repo-ready`
- `deploy-not-ready-until-vercel-env-is-filled`

## Final Env Map

Обов'язково для `Production`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/rugby_ukraine?schema=public"
NEXTAUTH_URL="https://your-real-domain.com"
NEXTAUTH_SECRET="your-long-random-production-secret"
NEXT_PUBLIC_SITE_URL="https://your-real-domain.com"
```

Опціонально:

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## Що реально використовує код

Перевірено по кодовій базі:

- `DATABASE_URL`
  - потрібний для Prisma runtime і build-запитів до БД
  - використовується в [lib/prisma-adapter.ts](/Volumes/KINGSTON/Projects/rugby/lib/prisma-adapter.ts:5)
- `NEXTAUTH_SECRET`
  - потрібний для admin/auth middleware
  - використовується в [proxy.ts](/Volumes/KINGSTON/Projects/rugby/proxy.ts:7)
- `NEXT_PUBLIC_SITE_URL`
  - потрібний для canonical, sitemap, robots і загальної SEO-бази
  - використовується в [lib/seo.ts](/Volumes/KINGSTON/Projects/rugby/lib/seo.ts:1)
- `NEXT_PUBLIC_GA_ID`
  - опціональний, вмикає `GA4` тільки якщо реально заданий
  - використовується в [lib/analytics.ts](/Volumes/KINGSTON/Projects/rugby/lib/analytics.ts:1)

Окремо важливо:

- `NEXTAUTH_URL` не читається напряму в нашому коді, але потрібний самому `NextAuth` у production runtime
- для цього reason його все одно обов'язково треба задати у `Vercel Production`

## Що перевірити у Vercel

1. `DATABASE_URL` веде на production `Postgres`, а не на локальний URL.
2. `NEXTAUTH_URL` збігається з реальним production-доменом.
3. `NEXT_PUBLIC_SITE_URL` збігається з тим самим production-доменом.
4. `NEXTAUTH_SECRET` не є тестовим або шаблонним значенням.
5. `NEXT_PUBLIC_GA_ID` задано тільки якщо ви реально використовуєте `GA4`.

## Що не повинно лишитися

- `localhost`
- `postgresql://postgres:postgres@localhost:5432/...`
- `*.local`
- `replace-with-*`
- тестові домени

## Preview

Для `Preview` рекомендовано:

- окремий `DATABASE_URL`
- не використовувати production БД
- не копіювати production env один в один без потреби

## Minimum Ready State

Production env можна вважати готовими, якщо:

1. усі обов'язкові змінні задані у `Vercel Production`
2. жодна змінна не містить dev-заглушки
3. домен у `NEXTAUTH_URL` і `NEXT_PUBLIC_SITE_URL` однаковий
4. `DATABASE_URL` вказує на production `Postgres`

## What Is Still Missing Before Deploy

Цей pass ще не означає, що production env уже готові фактично.

Перед deploy ще треба вручну підтвердити в `Vercel`:

1. реальний production `DATABASE_URL`
2. реальний production домен у `NEXTAUTH_URL`
3. той самий домен у `NEXT_PUBLIC_SITE_URL`
4. новий безпечний `NEXTAUTH_SECRET`
5. за потреби реальний `NEXT_PUBLIC_GA_ID`
