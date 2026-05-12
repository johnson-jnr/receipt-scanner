# Receipt Scanner and Expense Tracker

![Product demo](public/product.gif)

Built using Nuxt and NuxtHub, deployed on Cloudflare.
**[Live Demo](https://receipt-scanner.craftmotion.workers.dev)**

## Features

- Scan and extract data from receipts using AI
- Track expenses
- Expense analysis

## Tech Stack

| Area | Technology |
|---|---|
| Authentication | nuxt-auth-utils |
| Database | Cloudflare D1, Drizzle ORM |
| Storage | Cloudflare R2, KV |
| AI | Vercel AI SDK |
| UI | Nuxt UI |

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# Skip AI scanning and return mock data for testing
MOCK_SCAN=

# Auth session secret (generate with: openssl rand -base64 32)
NUXT_SESSION_PASSWORD=

APP_SECRET=

# AI — OpenAI-compatible key used by Vercel AI SDK
OPENAI_API_KEY=

# Cloudflare resources
HUB_KV_NAMESPACE_ID=
HUB_BLOB_BUCKET_NAME=
HUB_DB_DATABASE_ID=
```

> In development, the app uses a local SQLite database and file-based blob storage — `HUB_*` variables are only required for production Cloudflare deployments.

### 3. Run the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.
