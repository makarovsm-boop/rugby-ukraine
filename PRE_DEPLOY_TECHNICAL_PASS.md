# Pre-Deploy Technical Pass

Короткий технічний прогін перед реальним deploy.

## Що перевірено

Пройшли успішно:

- `npx prisma validate`
- `npx prisma generate`
- `npm run lint`

## Build Status

`npm run build` компілює застосунок і проходить TypeScript, але зараз падає на етапі `Collecting page data`.

Поточний blocker:

- `PrismaClientKnownRequestError`
- `ECONNREFUSED`
- під час запиту `prisma.championship.findMany()`
- route: `/championships/[slug]`

## Що це означає

Після реального switch на `Postgres` production build тепер очікує доступний `DATABASE_URL`.

Тобто кодова база в цілому зібрана коректно, але локальний або production `Postgres` має бути:

1. запущений
2. доступний по `DATABASE_URL`
3. мати застосовані migration
4. мати хоча б базові дані для сторінок, які читають БД під час build

## Minimum Fix Before Deploy

1. Підняти `Postgres`
2. Переконатися, що `DATABASE_URL` веде на робочу БД
3. Застосувати migration:

```bash
npm run db:migrate:deploy
```

4. За потреби заповнити dev/staging БД:

```bash
npm run db:seed
```

5. Повторити:

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run build
```

## Practical Verdict

Технічно проєкт близький до deploy-ready, але поточний build ще не можна вважати повністю green, доки немає доступної `Postgres` БД під runtime-запити під час збірки.
