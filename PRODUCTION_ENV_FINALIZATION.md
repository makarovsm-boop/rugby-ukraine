# Production Env Finalization

Фінальна пам'ятка по production env для цього проєкту перед реальним deploy на `Vercel`.

## 1. Обов'язкові env

Для production обов'язково мають бути заповнені:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Опціонально:

- `NEXT_PUBLIC_GA_ID`

## 2. Final Env Map for Vercel

### Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-real-domain.com"
NEXTAUTH_SECRET="your-long-random-production-secret"
NEXT_PUBLIC_SITE_URL="https://your-real-domain.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Preview

Рекомендовано:

- окремий `DATABASE_URL`
- окремий preview URL від Vercel
- не використовувати production БД для preview-збірок

## 3. Що вже перевірено

- локальний dev env винесений в [.env.example](/Volumes/KINGSTON/Projects/rugby/.env.example)
- production env винесений в [.env.production.example](/Volumes/KINGSTON/Projects/rugby/.env.production.example)
- production env map для `Vercel` підтверджено в [VERCEL_LAUNCH_FLOW.md](/Volumes/KINGSTON/Projects/rugby/VERCEL_LAUNCH_FLOW.md)

## 4. Що прибрати перед реальним deploy

У production не повинно лишитися:

- `localhost`
- `file:./prisma/dev.db`
- dev-секретів
- `*.local` URL як production-значень
- тестових доменів замість реального домену

## 5. Практичне правило

Що куди ставити:

- локальна розробка:
  - `.env`
  - значення з `.env.example`
- production у Vercel:
  - значення з `.env.production.example` як шаблон
  - самі реальні значення тільки в `Vercel Project Settings`

## 6. Minimum Ready State

Production env можна вважати готовими, якщо:

1. `DATABASE_URL` веде на production Postgres.
2. `NEXTAUTH_URL` і `NEXT_PUBLIC_SITE_URL` збігаються з реальним доменом.
3. `NEXTAUTH_SECRET` замінено на реальний довгий секрет.
4. У Vercel немає dev-заглушок замість production-значень.
