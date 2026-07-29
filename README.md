# 📊 Stock Scanner Pro

A standalone, single-file PWA stock scanner that screens the S&P 500, S&P MidCap 400, S&P SmallCap 600, Nasdaq 100, Dow 30, and (best-effort) Russell 1000 for pullback setups — Fibonacci golden-zone pullback + RSI reversal + fundamental/technical scoring, using free-tier APIs.

**Educational tool only. Not investment advice.** Free-tier API data may be delayed or incomplete. This is not a backtested trading strategy — it is a rule-based screener, and no claim is made about the profitability of the setups it flags.

---

## ✨ What it does

- **Two-stage pipeline:** Stage 1 (cheap, wide) screens the full ~1,500–2,000-ticker universe for Fibonacci golden-zone pullbacks with RSI(14) 40–65-ish and an intact uptrend structure. Stage 2 (deep) runs a full 86-point fundamental (43) + technical (up to 43) score only on Stage-1-promoted candidates.
- **Resumable, checkpointed scanning:** progress survives being closed mid-scan — Stage 1 and Stage 2 both pick up exactly where they left off, never re-scanning what's already done.
- **Multi-provider fallback chain:** Finnhub → Twelve Data → FMP → Polygon → Yahoo → Alpha Vantage → (optional paid: Tiingo → EODHD → Alpaca → Intrinio) → Yahoo/Stooq. Configuring more providers never overrides one that's already working — each is only tried if everything before it came back empty.
- **Three score modes** (Balanced / Strict / Aggressive) that adjust RSI bands and sector-relative fundamental thresholds.
- **Best Setup ranking, Opportunity Score, and a Combined blended score**, on top of the raw 86-point pass/fail gate.
- **Installable PWA** — works as a home-screen app on Android/iOS/desktop, and can be wrapped into an Android APK (e.g. via AppMint) pointing at the GitHub Pages URL.

## 🚀 Deploying it yourself

1. Fork or clone this repo.
2. Push it to your own GitHub repo (all files must stay in the same folder — `index.html` links to `manifest.json`, `sw.js`, and the icons with relative, no-subfolder paths).
3. **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**. Your app will be live at `https://<you>.github.io/<repo>/` within a minute or two.
4. Open it in Chrome → menu → **"Install app"** to add it to your home screen as a real PWA.
5. (Optional) Point a WebView-wrapper service like AppMint at your GitHub Pages URL to get a distributable `.apk`.

No build step, no `npm install`, no bundler — it's one `index.html` plus a handful of static PWA assets.

## 🔑 API setup

Open the **Settings** tab in-app. You need **at least one** of the following free keys (all have generous free tiers):

| Provider | Used for | Get a key |
|---|---|---|
| Finnhub | price, fundamentals, earnings history | finnhub.io |
| Twelve Data | price fallback | twelvedata.com |
| Financial Modeling Prep (FMP) | price fallback, fundamental fill-ins | financialmodelingprep.com |
| Polygon.io | price fallback | polygon.io |
| Alpha Vantage | price fallback (quota-guarded) | alphavantage.co |
| Yahoo Finance / Stooq | price, Stage 1 technicals | no key needed, automatic |

Optional **paid** providers (Tiingo, EODHD, Alpaca, Intrinio, Nasdaq Data Link, Databento) can be added in the same tab — see the in-app ABOUT tab for exactly which ones are wired into price vs. technicals vs. not-yet-used.

All keys are stored **only in your browser's localStorage** — nothing is ever sent to a server other than the data provider itself.

## ⚠️ Known limitations

- **Russell 1000** is fetched from an iShares CSV endpoint with no CORS proxy in front of it; it's fairly commonly blocked and may legitimately return 0 tickers on a given load. The other five indices don't depend on it.
- **S&P MidCap 400 / SmallCap 600** are scraped live from Wikipedia with no static fallback (they reconstitute too often to hand-maintain safely) — if Wikipedia is briefly down or restructures that page, those two indices are simply missing for that load, with a clear on-screen warning explaining why and what to do.
- **Nasdaq 100 / Dow 30** do have a static fallback snapshot baked into the code (frozen at a specific verified date) for when the live Wikipedia fetch fails — see the in-app log for the exact date if that fallback is ever used.
- **AppMint APK wrapper:** the WebView it uses doesn't implement Android's file-picker callback, so **Import Progress doesn't work inside the packaged APK** — use Export/Import via Chrome directly, then continue using the APK normally.

## 📄 License / disclaimer

Personal/educational project. Not affiliated with any of the data providers listed above. Not investment advice — verify everything independently before making any trading decision.
