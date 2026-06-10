# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Run ESLint
npm run clean     # Clean Next.js build cache
```

## Environment

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to a valid Gemini API key. Without it, the app runs in demo mode with static fallback responses.

## Architecture

**Bayan (بيان)** is a Next.js 15 App Router app — a bilingual (Arabic/English) digital Islamic heritage library with AI-powered scholarly explanations.

### Pages & Routing
- `app/page.tsx` — main SPA-like page with all tabs (Library, Peer Review, My Shelf, Catalog). Heavy client component (~800+ lines) using `"use client"`.
- `app/books/page.tsx` — browse/search books grid
- `app/books/[id]/page.tsx` — individual book reader with chapter navigation and AI chat
- `app/api/gemini/chat/route.ts` — AI scholarly explanation endpoint (per-chapter Q&A)
- `app/api/gemini/peer-review/route.ts` — AI peer review endpoint for manuscript submissions

### Data Layer
- `lib/booksData.ts` — `INITIAL_BOOKS` array is the static book catalog. `Book` and `BookChapter` interfaces define the data shape. Books have bilingual fields (`titleEn`/`titleAr`, `contentEn`/`contentAr`, etc.).
- `lib/translations.ts` — `translations` object with `en` and `ar` keys; `TSet` type for translation sets. All UI strings go through this system.
- `lib/utils.ts` — `cn()` for Tailwind class merging, `safeStringify()` for safe JSON serialization

### AI Integration
Uses `@google/genai` (Gemini) directly — no AI SDK wrapper. Both API routes instantiate `GoogleGenAI` with `GEMINI_API_KEY` and call `ai.models.generateContent()`. The AI persona is "Bayan AI", a bilingual Islamic heritage scholar.

### Styling
- Tailwind CSS v4 with custom CSS variables defined in `app/globals.css`
- Custom font variables: `--font-display` (Cormorant Garamond), `--font-sans` (Inter), `--font-ar` (IBM Plex Sans Arabic), `--font-ar-read` (Amiri), `--font-mono` (JetBrains Mono)
- RTL support for Arabic content via `dir="rtl"` on relevant elements
- `motion/react` (Framer Motion) for animations

### Bilingual Pattern
All content-bearing data structures carry parallel `En`/`Ar` fields. The active language state (`lang: "en" | "ar"`) drives which fields render and whether to apply `dir="rtl"`.
