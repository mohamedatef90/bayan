# Bayan (بيان)

Bayan is a bilingual (Arabic/English) digital Islamic heritage library and community peer-review portal. Readers browse classical texts chapter by chapter and ask an AI assistant for scholarly explanations. Contributors submit manuscripts for AI-assisted review and community endorsement.

The app was built in Google AI Studio and can be viewed there: https://ai.studio/apps/c5e8c0cb-b9c6-43cb-a8d5-02ac4f8c17b1

## Features

- **Library:** a catalog of four seeded books (Al-Nawawi's Forty Hadith, Riyad as-Salihin, Selections from Sahih al-Bukhari, and Al-Muwatta of Imam Malik), each with chapters in Arabic and English, search, and category filtering.
- **Book reader:** chapter navigation with an AI chat that answers questions about the chapter being read, in English and Arabic ("Bayan AI").
- **Peer-review portal:** a form to submit a manuscript. The text is sent to an AI audit that returns a structured report (authenticity flag, confidence score, author match, narrator-chain check, flags, theological alignment, bilingual summary, recommendation). Submissions can be endorsed, and a submission that reaches two endorsements is added to the public library.
- **My Shelf:** bookmarked chapters and a "Save Offline" toggle for books.
- **Bilingual UI:** all interface strings exist in English and Arabic, with right-to-left layout for Arabic.
- **Demo mode:** without `GEMINI_API_KEY`, both API routes return static fallback responses instead of calling Gemini.

Note that sign-in is simulated in the browser (no backend authentication), and bookmarked chapters, saved books, submissions, the review queue, language, and login state are stored in the browser's `localStorage`. "Save Offline" is a local flag, not a file download.

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4, `motion` for animation, `lucide-react` icons
- Google Gemini via `@google/genai`, called from Next.js route handlers (model `gemini-3.5-flash`)
- Fonts through `next/font/google`: Cormorant Garamond, Inter, IBM Plex Sans Arabic, Amiri, JetBrains Mono

## Getting started

Prerequisites: Node.js and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key. Leave it unset to run in demo mode.

3. Start the dev server:

   ```bash
   npm run dev
   ```

Other scripts from `package.json`:

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build (`output: 'standalone'` in `next.config.ts`) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean the Next.js build cache |

## Environment variables

Listed in `.env.example`:

- `GEMINI_API_KEY`: Gemini API key used by both API routes.
- `APP_URL`: URL where the app is hosted (injected by AI Studio at runtime).

## API routes

- `POST /api/gemini/chat`: scholarly explanation for a question about a book chapter. Requires `question`.
- `POST /api/gemini/peer-review`: structured authenticity audit of a submitted text. Requires `content`.

## Project structure

```
app/
  page.tsx                         Main page: Library, Peer Review, My Shelf
  books/page.tsx                   Book browsing and search
  books/[id]/page.tsx              Book reader with chapter navigation and AI chat
  api/gemini/chat/route.ts         AI explanation endpoint
  api/gemini/peer-review/route.ts  AI peer-review endpoint
lib/
  booksData.ts                     Static book catalog and data types
  translations.ts                  English and Arabic UI strings
  utils.ts                         Helpers
```
