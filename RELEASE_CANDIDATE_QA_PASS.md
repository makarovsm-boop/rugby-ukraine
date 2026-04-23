# Release Candidate QA Pass

Короткий ручний QA pass по локальному release candidate після підняття `Postgres` і відновлення seed-даних.

## Scope

Перевірено локально на `http://localhost:3000`:

- public routes
- representative detail pages
- search
- login
- admin redirects
- SEO endpoints

## Green Checks

- `/` відкривається
- `/news` відкривається
- `/matches` відкривається
- `/championships` відкривається
- `/teams` відкривається
- `/players` відкривається
- `/search` відкривається
- `/login` відкривається
- `/robots.txt` доступний
- `/sitemap.xml` доступний
- detail pages відкриваються:
  - `/news/ukraine-squad-summer-camp`
  - `/matches/match-1`
- пошук з реальним запитом працює:
  - `/search?q=Україна`
- empty-result search теж відкривається коректно:
  - `/search?q=nosuchqueryzzz`
- credentials login для `ADMIN` працює
- `ADMIN` має доступ до:
  - `/admin`
  - `/admin/articles`
  - `/admin/users`
- unauthenticated access до `/admin` веде на:
  - `/login?callbackUrl=%2Fadmin`

## Findings

Критичних findings після повторної перевірки не лишилося.

## Follow-up Verification

Після точкового фікса role redirects і повторного seed перевірено:

- `USER` більше не потрапляє в redirect loop
  - `/admin` -> `307 /`
  - `/admin/articles` -> `307 /`
- окремий `EDITOR` тепер є в seed-даних:
  - `editor@rugby-ukraine.local`
  - пароль: `rugby123`
- `EDITOR` сценарій підтверджено вручну:
  - `/admin` -> `307 /admin/articles`
  - `/admin/articles` -> `200`
  - `/admin/comments` -> `200`
  - `/admin/users` -> `307 /admin/articles`
  - `/admin/matches` -> `307 /admin/articles`

## Practical Verdict

Поточний manual QA pass можна вважати `green` для базового release-candidate рівня.

Що лишається перед launch:

1. пройти browser-QA по mobile і form UX вручну
2. перевірити створення/редагування матеріалу та upload зображення руками в UI
3. фіналізувати production env у `Vercel`
