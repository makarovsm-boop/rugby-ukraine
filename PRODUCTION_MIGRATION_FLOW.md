# Production Migration Flow

Цей проєкт уже переключено на `Postgres`, але production migration flow треба запускати окремо від dev/seed-сценарію.

## Що використовувати

- `npm run db:migrate:dev`
  - тільки локально або на окремому технічному середовищі
  - створює нову migration на основі змін у `prisma/schema.prisma`
- `npm run db:migrate:deploy`
  - тільки для `staging/production`
  - застосовує вже готові migration-файли
  - не генерує нові migration
- `npm run db:seed`
  - тільки для локальної розробки, demo або staging-перевірки
  - не є частиною production deploy flow

## Рекомендований порядок

1. Змінити `prisma/schema.prisma`
2. На локальному `Postgres` або технічному staging створити migration:

```bash
npm run db:migrate:dev -- --name short_descriptive_name
```

3. Перевірити:

```bash
npx prisma validate
npm run db:generate
npm run lint
npm run build
```

4. Закомітити:
- зміни в `schema.prisma`
- нову папку в `prisma/migrations`

5. На production під час release застосувати тільки:

```bash
npm run db:migrate:deploy
```

6. Після цього запускати build/start flow.

## Чого не робити в production

Не використовувати:

- `npm run db:seed`
- `prisma db push` як штатний production flow
- `prisma migrate reset`
- будь-який destructive reset БД

## Як відокремити production від dev seed

- production:
  - тільки `migrate deploy`
  - тільки реальні дані через адмінку або окремий контентний імпорт
- локальна розробка:
  - `db:migrate:dev`
  - за потреби `db:seed`
- staging:
  - можна використовувати `db:migrate:deploy`
  - `db:seed` лише якщо це окреме тестове середовище, не production

## Поточне обмеження репозиторію

Зараз у репозиторії ще немає зафіксованої production migration history в `prisma/migrations`.

Тому перед реальним production deploy потрібно:

1. Підняти локальний або staging `Postgres`
2. Створити першу migration через `npm run db:migrate:dev -- --name init_postgres`
3. Закомітити `prisma/migrations`
4. Тільки після цього використовувати `npm run db:migrate:deploy` у production
