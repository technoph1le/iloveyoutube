// Details the privacy policy, terms and accessibility statement rely on.
// TODO(owner): replace every "[...]" placeholder before launch. EU law (GDPR
// Art. 13) requires the operator's identity and a contact address.

export const legal = {
  operator: {
    name: "[Your full name or company name]",
    email: "[contact email for privacy and accessibility requests]",
    country: "[Country where you live or your company is registered]",
  },
  // Law that governs the Terms of Use (usually your own country).
  governingLaw: "[Your country]",
  // Update these whenever the documents change.
  privacyUpdated: "2026-10-24",
  termsUpdated: "2026-10-24",
  accessibilityUpdated: "2026-10-24",
  // Everyone who hosts part of the site and so receives visitors' IP
  // addresses. Keep this in sync with where you deploy.
  hostingProviders: [
    { name: "Vercel Inc.", role: "the website", url: "https://vercel.com/legal/privacy-policy" },
    { name: "Railway Corporation", role: "the server behind the tools", url: "https://railway.com/legal/privacy" },
  ],
};
