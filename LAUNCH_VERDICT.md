# Launch Verdict

Короткий фінальний verdict по готовності MVP до першого публічного запуску.

## Поточний статус

Практичний статус проєкту зараз:

- `release-candidate`
- `локально майже green`
- `not launch-approved yet`

Причина останнього пункту:

- production env у `Vercel` ще не заповнені реальними значеннями
- реальні production launch-акаунти ще не створені

## Що вже green

- `Postgres` локально піднятий
- `Prisma` migration flow працює
- `build` проходить
- public routes відкриваються
- search працює
- `robots.txt` і `sitemap.xml` доступні
- `ADMIN / EDITOR / USER` role model локально працює коректно
- базовий content gate локально закритий:
  - є `3+` публічні новини
  - є `1` draft
  - є команди, гравці, чемпіонати, матчі
  - прибрано найпомітніші demo-ефекти з головної

## Що ще blocker перед реальним launch

### 1. Production env у `Vercel`

Ще треба виставити реальні значення:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID` якщо аналітика потрібна одразу

Поки цього не зроблено, deploy не можна вважати launch-ready.

### 2. Реальні launch-акаунти

Локально сценарій перевірено, але перед production запуском ще треба:

- створити реального `ADMIN`
- створити окремого реального `EDITOR`
- не покладатися тільки на `*.local` seed-акаунти

### 3. Короткий ручний browser pass перед deploy

Ще бажано руками у браузері підтвердити:

- створення й редагування статті
- `Draft -> Published`
- upload зображення
- mobile/form UX на ключових екранах

## Що можна відкласти після launch

- дрібну mobile-поліровку
- copy-polish другого пріоритету
- неідеально реалістичні seed-візуали в окремих місцях
- подальше розширення аналітики

## Final Verdict

Якщо коротко:

- `кодово і локально MVP вже близький до запуску`
- `операційно він ще не готовий до натискання Deploy прямо зараз`

Формальний verdict на цей момент:

- `ready for final pre-launch setup`
- `not ready for public launch until Vercel env and real launch accounts are completed`

## Next Practical Step

Найправильніший наступний крок:

1. заповнити production env у `Vercel`
2. створити реального `ADMIN`
3. створити окремого `EDITOR`
4. пройти короткий browser smoke pass
5. після цього дати фінальне `launch-approved`
