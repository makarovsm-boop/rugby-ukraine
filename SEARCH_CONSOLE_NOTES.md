# Google Search Console Notes

## What Is Ready in the Project

У проєкті вже підготовлено базу для індексації:

- `robots.txt` генерується з `app/robots.ts`
- `sitemap.xml` генерується з `app/sitemap.ts`
- `admin`, `login`, `profile` і внутрішній `search` не призначені для індексації
- публічні сторінки мають `canonical` і базові metadata

## Current SEO Decisions

Що саме ми зараз вважаємо правильним:

- індексуються лише публічні сторінки контенту
- `/admin` закритий у `robots.txt`
- `/login`, `/profile` і `/search` позначені як `noindex`
- `sitemap.xml` містить тільки публічні маршрути

## Before Adding the Site to Search Console

Перевірити:

1. `NEXT_PUBLIC_SITE_URL` вказує на реальний production домен
2. `robots.txt` відкривається на production URL
3. `sitemap.xml` відкривається на production URL
4. у `robots.txt` вказаний абсолютний URL sitemap
5. у sitemap немає локальних або staging URL

## What to Do in Google Search Console

Після deploy:

1. додати production домен у `Google Search Console`
2. підтвердити право власності на сайт
3. відкрити розділ `Sitemaps`
4. надіслати:

```text
https://your-domain.example/sitemap.xml
```

5. перевірити, що Google бачить `robots.txt`
6. перевірити кілька ключових URL через `URL Inspection`

Рекомендовані URL для першої перевірки:

- `/`
- `/news`
- `/news/[slug]`
- `/teams`
- `/players`
- `/championships`
- `/matches`

## Important Notes

Важливі правила:

- `robots.txt` керує саме crawling, а не гарантує виключення сторінки з індексу
- для сторінок, які не треба індексувати, краще використовувати `noindex`
- `robots.txt` має лежати в корені сайту
- `sitemap` у `robots.txt` має бути абсолютним URL

## Local Check

Перед production-запуском можна локально перевірити:

```bash
npm run dev
```

Потім відкрити:

```text
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
```
