# Blog automation contract

The frontend publishes and indexes only real RU/KZ article bodies. EN blog routes remain available but are `noindex`; missing translations never fall back to RU for rendering or SEO. Production does not use bundled thin demo posts.

## Backend contract

- `GET /api/blog/posts?published=true` returns `{ posts: BlogPost[] }` (or an array).
- `GET /api/blog/posts/:slug` returns `{ post: BlogPost }`.
- Mutations accept `Authorization: Bearer <BLOG_API_SECRET>` (the proxy also sends `x-api-key` during migration).
- `POST /api/blog/cron/generate?slot=1|2|3` (or `BLOG_CRON_BACKEND_PATH`) accepts the same bearer secret. The frontend maps Monday/Wednesday/Friday to slots 1/2/3.
- `BlogPost.content.ru` / `.kz` must contain the actual localized HTML. A body shorter than 200 text characters is excluded from indexing.
- `updatedAt` should be an ISO date; it is used for `dateModified` and sitemap `lastModified`.
- After a published post is created or changed, call `POST /api/blog/revalidate` on the frontend with `Authorization: Bearer <BLOG_REVALIDATE_SECRET>` and JSON `{ "slug": "...", "languages": ["ru", "kz"] }`.

The revalidation endpoint refreshes blog lists, article pages, `/sitemap.xml`, and both `/ru/blog/rss.xml` and `/kz/blog/rss.xml`.

## Scheduling and security

`vercel.json` invokes `/api/cron/blog` at 06:00 UTC on Monday, Wednesday, and Friday. Vercel sends `Authorization: Bearer <CRON_SECRET>`; the frontend then calls the backend with `BLOG_API_SECRET`. A public request cannot trigger generation.

Admin browser code only calls same-origin `/api/blog/*`. Server routes attach the backend secret. Mutations require an HttpOnly cookie named `aidardev_admin_session` matching `ADMIN_BLOG_SESSION_TOKEN`; the existing mock login deliberately cannot establish it. Replace this check with the backend agent's real authenticated session when available.
