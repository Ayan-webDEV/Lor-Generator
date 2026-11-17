# VELOOP LOR Generator

A React + Express + Node.js manual utility that generates LOR selection-record PDFs from the **three exact supplied PDF templates**. MongoDB is not used or required.

## Template behavior

- `3-intern.pdf`: 3 intern records; signing date is on physical page 4.
- `6-intern.pdf`: 6 intern records; signing date is on physical page 4.
- `8-intern.pdf`: 8 intern records; the selection register continues onto physical page 4, and the declaration/signing date is on physical page 5.
- The selected PDF template is always used as the base. The app does not rebuild the document or redesign pages.
- Page 1: replaces only Batch / Record and Record Date.
- Selection register: replaces only intern name, internship domain, intern ID, and masked email.
- Declaration: replaces only the signing date.
- Other content and pages are preserved from the original PDFs.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
cp server/.env.example server/.env
```

Edit `server/.env` if needed, then run:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/api/health

Production build:

```bash
npm run build
npm start
```

The Express server serves `client/dist` after the frontend has been built.

## Manual generation

1. Choose the exact template: 3, 6, or 8 interns.
2. Enter the batch/group name.
3. Enter exactly the number of interns required by that template.
4. For each intern, enter name, intern ID, email, and internship domain.
5. Generate and download the PDF.

Dates are generated on the server at generation time using `Asia/Kolkata`. The browser cannot override them.

### Email masking

Raw email is accepted by the form/API but only a masked version is written into the PDF and generation audit record. The masking rule retains the first two local-part characters and masks the remaining local-part characters with asterisks (minimum four asterisks). The email domain is retained, e.g. `ayan.alam@gmail.com` becomes `ay*******@gmail.com`.

## API

### `GET /api/lor/templates`

Returns available fixed templates and required intern counts.

### `POST /api/lor/generate`

Manual generator endpoint. Returns `application/pdf` as a download.

Request:

```json
{
  "template": "6",
  "groupName": "November 2026 - Batch A",
  "interns": [
    {
      "name": "Aarav Kumar",
      "internId": "VLRINT202611001",
      "email": "aarav.kumar@gmail.com",
      "domain": "Frontend Developer"
    }
  ]
}
```

The `interns` array must contain exactly 3, 6, or 8 records to match the selected template. The example above is illustrative; a 6-intern template requires six records.

### CORS

Set `CLIENT_ORIGIN` to your deployed dashboard origin(s), comma-separated. For local development, the Vite dev server is allowed automatically.

## Environment variables

See `server/.env.example`. No database credentials are needed.

## Important font note

The original PDFs embed subsetted Poppins fonts. Those exact embedded font subsets are bundled for close matching. A bundled DejaVu Sans fallback is used automatically when a new name or value contains a character missing from the embedded subset, so uncommon Latin characters remain renderable.

## PDF preservation and testing

The generator overlays only the specified dynamic fields on the supplied PDFs. It does not convert pages to images or reconstruct the document. Always review a generated PDF before official external distribution.
