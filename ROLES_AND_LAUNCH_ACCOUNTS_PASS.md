# Roles And Launch Accounts Pass

Короткий pass по ролях і launch-ready акаунтах перед першим deploy.

## Поточний локальний стан

У локальній `Postgres` БД зараз є окремі акаунти для трьох основних сценаріїв:

- `ADMIN`
  - `admin@rugby-ukraine.local`
- `EDITOR`
  - `editor@rugby-ukraine.local`
- `USER`
  - `reader1@rugby-ukraine.local`
  - `reader2@rugby-ukraine.local`

Усі ці акаунти зараз доступні в локальному seed-сценарії.

## Що перевірено

### USER

- `USER` не бачить адмінку як робочий розділ
- запит до `/admin` редиректить на `/`
- запит до `/admin/articles` теж редиректить на `/`

### EDITOR

- `EDITOR` має доступ до:
  - `/admin/articles`
  - `/admin/comments`
- `EDITOR` не має доступу до:
  - `/admin/users`
  - `/admin/matches`
- запит до `/admin` редиректить `EDITOR` на `/admin/articles`

### ADMIN

- `ADMIN` має доступ до:
  - `/admin`
  - `/admin/articles`
  - `/admin/users`

## Practical Verdict

Для локального release-candidate сценарію role model зараз працює коректно:

- `USER` обмежений
- `EDITOR` має вузький редакторський доступ
- `ADMIN` має повний доступ до адмінки

## Що ще треба перед реальним launch

Цей pass ще не означає, що production launch-акаунти вже готові фактично.

Перед реальним deploy потрібно:

1. створити реального production `ADMIN`
2. створити окремого реального production `EDITOR`
3. не покладатися лише на `*.local` seed-акаунти як на бойовий сценарій
4. перевірити в production або preview:
   - логін `ADMIN`
   - логін `EDITOR`
   - обмеження `USER`

## Recommended Production Rule

Для production:

- seed-акаунти можна використовувати тільки як локальний або staging bootstrap
- реальні launch-акаунти краще створити через [app/admin/users/page.tsx](/Volumes/KINGSTON/Projects/rugby/app/admin/users/page.tsx:1) або окремим контрольованим bootstrap-кроком
- production email-и не повинні лишатися `*.local`
