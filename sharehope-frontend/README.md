# ShareHope Frontend

Next.js (App Router) + TypeScript frontend for ShareHope, backed by a Spring Boot + PostgreSQL API and Vercel Blob for media storage.

## Stack

- Next.js + TypeScript
- Tailwind CSS + shadcn/ui
- next-intl (English / French)
- React Hook Form + Zod
- TanStack Query
- Lucide React
- Vercel Blob (file uploads)

## Environment variables

Create a `.env.local` file with:

```bash
# Spring Boot API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Vercel Blob (from Vercel project settings > Storage)
BLOB_READ_WRITE_TOKEN=
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Routes are locale-prefixed (`/en`, `/fr`) via `next-intl` middleware.

## Project structure

- `app/[locale]/(public)` — public marketing site pages
- `app/[locale]/admin` — admin dashboard
- `app/api/blob` — Vercel Blob upload/delete route handlers
- `components/public`, `components/admin`, `components/ui` — UI building blocks
- `lib/api` — typed REST client for the Spring Boot API
- `lib/blob` — Vercel Blob client helpers
- `lib/auth` — token storage + role/permission helpers
- `hooks` — TanStack Query hooks
- `types` — shared TypeScript types
- `messages/{en,fr}.json` — next-intl translation catalogs
- `i18n/` — next-intl routing/config

## Media upload flow

1. Admin selects a file in the dashboard (`MediaUploader` / `ImagePicker`).
2. The file uploads directly to Vercel Blob via `/api/blob/upload` (client upload token).
3. The returned blob URL + metadata (pathname, content type, uploaded by/at) should be persisted via the Spring Boot API into PostgreSQL (`TODO` markers in `app/api/blob/upload/route.ts` indicate where to wire this up).

## Deploy on Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new).
