This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Gold Winner — Mother’s Day Microsite

### Environment Variables

This project uses a Cloudinary upload + Google Sheets/Drive service-account workflow.

Add these environment variables in **Vercel Project Settings** (or your local env). Note: `.env*` files are ignored by this repo.

#### Cloudinary

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

#### Google (Service Account)

- `GOOGLE_SERVICE_ACCOUNT_JSON`
  - The full service account JSON as a **single-line string**.
  - Ensure `private_key` newlines are preserved (keep `\n` escapes if needed).

#### Google Sheets

- `GOOGLE_SHEETS_SPREADSHEET_ID`
  - The spreadsheet ID from the Google Sheets URL.
- `GOOGLE_SHEETS_SHEET_NAME`
  - Example: `Sheet1`

### Google Sheet Columns

The backend appends rows with columns:

`Unique ID | Timestamp | Mother Name | Template | Image URL | Address | Phone | Delivery Status`

### Google Drive Output

The backend creates:

- Main folder: `Gold_Winner_MothersDay_2026`
- Subfolder: `[UniqueID]_[MotherName]`
  - Uploads: the image + a JSON metadata file

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
