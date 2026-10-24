# Contributing to iLoveYouTube

Thanks for your interest in contributing! 💖 Bug reports, ideas and pull requests are all welcome.

- Found a bug or want a new tool? [Open an issue](https://github.com/technoph1le/iloveyoutube/issues).
- Have a question? Ask in the [Discord](https://discord.gg/Nm5K46yUy5).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 24
- A YouTube Data API v3 key, needed only for the Thumbnail Previewer feed. To get one, open the [Google Cloud Console](https://console.cloud.google.com), enable **YouTube Data API v3**, then go to **Credentials** and create an API key.

### 1. Clone and install

```bash
git clone https://github.com/technoph1le/iloveyoutube.git
cd iloveyoutube
npm install
npm run install:all
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**`backend/.env`**

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4000` | Port the API listens on. |
| `YOUTUBE_API_KEY` | — | YouTube Data API v3 key. Optional: the server starts without it, but the previewer feed stays empty. |
| `YOUTUBE_REGION` | `US` | Two-letter country code for the trending feed. |

**`frontend/.env.local`**

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.iloveyoutube.dev` | Public address used for canonical URLs, the sitemap and social previews. |
| `BACKEND_URL` | `http://localhost:4000` | Where `/api/*` is proxied to. Include the protocol and leave off the trailing slash. |

### 3. Run it

```bash
npm run dev
```

This starts both apps together:

- Site: <http://localhost:3000>
- API: <http://localhost:4000> (health check at `/api/health`)

You can also run them one at a time with `npm run dev:frontend` or `npm run dev:backend`.

## Adding a tool

1. Register the tool in `frontend/src/data/tools.ts`. Set `isDisplayed: false` until it's ready, so it stays off the home page and the sitemap.
2. Build its UI in `frontend/src/features/<tool>`.
3. Add its page in `frontend/src/app/tools/<tool>`.
4. If it needs server-side work, add a feature folder in `backend/src/features/<tool>` and mount its routes in `backend/src/app.ts`.
