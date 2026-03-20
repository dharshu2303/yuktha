# Yuktha ✨

> AI-powered business card to website generator for Indian small business owners.

📸 Upload your business card → 🤖 AI reads it → 🌐 Get a professional website → 📤 Share on WhatsApp

**Total cost: ₹0**

---

## Features

- 🌐 **7 Indian Languages** — Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, English
- 📸 **Card OCR** — Upload or photograph your business card
- 🎤 **Voice Input** — Add details by speaking in your language
- 🤖 **AI Website Generation** — Gemini 2.5 Flash creates your site
- ✏️ **Live Refinement** — Chat with AI to customize your website
- 📱 **PWA** — Install on your home screen, works offline
- 📤 **WhatsApp Sharing** — One-tap share to WhatsApp

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Frontend + API routes |
| Tailwind CSS | Styling |
| Gemini 2.5 Flash | AI (OCR + generation) |
| Web Speech API | Voice input (browser-native) |
| Workbox (next-pwa) | PWA + offline |
| Cloudflare Pages | Hosting (free) |

## Quick Start

### 1. Get a free Gemini API key

Go to [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create key.

No credit card required.

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

Copy `.env.example` to `.env.local` and add your API key:

```env
GEMINI_API_KEY=your_key_here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Cloudflare Pages (Free)

1. Create a [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
2. Connect your GitHub repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variable: `GEMINI_API_KEY`
6. Deploy!

Your site will be live at `https://your-project.pages.dev`

## Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout (Inter font, providers)
│   ├── page.js            # Main app (5-step flow)
│   ├── globals.css        # Design system + animations
│   ├── api/
│   │   ├── generate/      # OCR + website generation
│   │   ├── refine/        # AI refinement
│   │   └── publish/       # Save & publish
│   └── sites/[slug]/      # Published site pages
├── components/
│   ├── ui/                # Shared UI components
│   └── steps/             # 5 step components
├── context/               # Language context provider
├── hooks/                 # Voice recognition hook
└── lib/                   # Gemini API, templates, storage
```

## App Flow

1. **Language Selection** — Choose from 7 Indian languages
2. **Card Capture** — Upload/photograph card + optional voice input
3. **AI Generation** — Gemini reads card and generates website
4. **Preview & Refine** — Preview site + chat to customize
5. **Publish & Share** — Get URL + share on WhatsApp

## License

MIT
