# iLoveYouTube

**Free online YouTube tools for creators and viewers.** No account, no sign-up, no tracking.

🌐 **[iloveyoutube.dev](https://www.iloveyoutube.dev)** · 💬 [Discord](https://discord.gg/Nm5K46yUy5) · ☕ [Sponsor](https://ko-fi.com/technoph1le) · 📺 [YouTube](https://youtube.com/@technoph1le)

---

## Tools

| Tool | What it does |
| --- | --- |
| **[Thumbnail Downloader](https://www.iloveyoutube.dev/tools/thumbnail-downloader)** | Grab any YouTube thumbnail in full resolution. |
| **[Thumbnail Previewer](https://www.iloveyoutube.dev/tools/thumbnail-previewer)** | See how your thumbnail and title look in a realistic feed on home, search, mobile and TV before you publish, and compare A/B versions. |
| **[Embed Code Generator](https://www.iloveyoutube.dev/tools/embed-code-generator)** | Customize a YouTube player for your website, preview it live, and copy the code. |

More are on the way: transcripts, a chapters generator, a title and description formatter, and a video screenshot tool.

### Privacy first

Your uploads stay in your browser. YouTube images are served through our own domain, so your browser never contacts Google just because you opened a page.

## Tech stack

- **Frontend:** [Next.js](https://nextjs.org) 16, React 19, Tailwind CSS 4, [Lucide](https://lucide.dev) icons
- **Backend:** [Express](https://expressjs.com) 5 API with [Zod](https://zod.dev) for config validation
- **Data:** [YouTube Data API v3](https://developers.google.com/youtube/v3)
- **Hosting:** Vercel (frontend) and Railway (backend)

## Project structure

```
iloveyoutube/
├── frontend/              # Next.js site
│   └── src/
│       ├── app/           # Pages and routes (tools live under /tools)
│       ├── features/      # One folder per tool
│       ├── components/    # Shared layout and UI components
│       └── data/          # Site config, tool list, FAQs, legal text
├── backend/               # Express API, mounted under /api
│   └── src/features/
│       ├── videos/               # Video info and thumbnail downloads
│       ├── images/               # Privacy-friendly YouTube image proxy
│       └── thumbnail-previewer/  # Weekly trending feed, cached
└── package.json           # Scripts to run both apps together
```

The frontend forwards every `/api/*` request to the backend (see `frontend/next.config.ts`), so the browser only ever talks to one domain.

## Contributing

Bug reports, ideas and pull requests are welcome.

- Want to run it locally, add a tool, or deploy your own copy? See **[CONTRIBUTING.md](CONTRIBUTING.md)**.
- Found a bug or want a new tool? [Open an issue](https://github.com/technoph1le/iloveyoutube/issues).
- Want to chat? Join the [Discord](https://discord.gg/Nm5K46yUy5).

## Support

If iLoveYouTube saves you time, consider [buying me a coffee](https://ko-fi.com/technoph1le). It helps keep the tools free.

## License

[MIT](LICENSE) © Technophile
