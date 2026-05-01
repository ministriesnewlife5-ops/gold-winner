# Gold Winner — Mother’s Day Microsite

This project now uses a dedicated **Node.js + Express + Supabase** backend.

## Backend Architecture

Backend code lives in [backend/src](backend/src) with clean modular structure:

- [backend/src/routes](backend/src/routes)
- [backend/src/controllers](backend/src/controllers)
- [backend/src/services](backend/src/services)
- [backend/src/config](backend/src/config)

## Why Supabase Storage (not Base64 in DB)

Chosen: **Supabase Storage**.

Reasons:

1. Images are heavy binary objects; storing as Base64 in DB increases size by ~33% and slows reads/writes.
2. Object storage is optimized for files, cheaper at scale, and better for traffic spikes.
3. Easier delivery and download workflows for image files.
4. Signed URLs allow secure, temporary access to personal photos.

## Auth Choice: Signed URLs (not public)

Chosen: **Signed URLs** for image access in admin responses.

Reason: user-uploaded personal photos should not be globally public. Signed URLs provide short-lived secure access while keeping storage private.

## Export Format Choice: JSON (not CSV)

Chosen: **JSON** for details download.

Reason: field structure is nested and may evolve (for example image metadata, optional fields, audit fields). JSON preserves structure safely without flattening loss and is easier for downstream APIs.

## Database Schema

SQL file: [backend/sql/schema.sql](backend/sql/schema.sql)

Tables:

- `orders`
  - `id` uuid pk
  - `name`
  - `message`
  - `template_id`
  - `delivery_address`
  - `phone_number`
  - `created_at`
- `order_images`
  - `id` uuid pk
  - `order_id` uuid fk -> `orders.id`
  - `image_path`
  - `created_at`

## API Endpoints

### Public

- `POST /order`
  - multipart/form-data
  - fields: `name` (or `motherName`), `message` (or `receiverName`), `template_id` (or `template`), `delivery_address` (or `address`), `phone_number` (or `phone`)
  - file field: `image` (or `photo`)
  - stores image to Supabase Storage + metadata in DB

### Admin (Supabase Auth protected)

- `GET /admin/orders`
  - returns all submissions with signed image links
- `GET /admin/orders/:id/download/details`
  - downloads details JSON
- `GET /admin/orders/:id/download/image`
  - downloads image file
- `GET /admin/orders/:id/download/zip`
  - optional ZIP containing JSON + image

### Admin Login/Dashboard

- `GET /admin/login` (HTML login page)
- `POST /auth/login` (Supabase email/password login)
- `POST /auth/logout`
- `GET /admin/dashboard` (protected backend-driven HTML dashboard)

## Validation, Error Handling, Scalability

- Zod-based request validation
- Centralized error middleware
- Helmet + CORS + request logging
- Rate limiting on API routes
- Storage object paths partitioned by date for operational manageability
- DB indexes on `created_at` and `order_id`

## Environment Variables

Use [backend/.env.example](backend/.env.example) as the template.

## Setup Instructions

1. Install dependencies.
2. Create Supabase project.
3. Run SQL from [backend/sql/schema.sql](backend/sql/schema.sql) in Supabase SQL Editor.
4. Create an admin user in Supabase Auth (email/password).
5. Copy [backend/.env.example](backend/.env.example) to `.env.local` (or `.env`) and fill values.
6. Run backend: `npm run backend:dev`.
7. Run frontend: `npm run dev`.
8. Open admin login at `http://localhost:4000/admin/login`.

## Notes on Existing Frontend

The Next API route [app/api/submit/route.ts](app/api/submit/route.ts) now acts as a thin proxy to backend `POST /order` and contains no storage/database business logic.
