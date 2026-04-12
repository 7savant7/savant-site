# Running SAVANT on Android / Termux

This guide explains how to preview the SAVANT site locally on Android using
[Termux](https://termux.dev) and Node.js 22.

## Why a special guide?

`better-sqlite3` is a native Node.js addon that requires compilation via
`node-gyp`. On Android/Termux the Android NDK is not available, so the build
fails and (historically) caused `npm install` to abort entirely.

Since `better-sqlite3` has been moved to **`optionalDependencies`**, npm/Node
will now skip it gracefully if the build fails, and the server automatically
falls back to an **in-memory store** at runtime. All UI routes work normally;
only the `/api/posts` CRUD endpoints use temporary in-process storage (data is
lost when the server restarts, which is fine for a local UI preview).

---

## Prerequisites

| Tool | Recommended version |
|------|-------------------|
| Termux | Latest from F-Droid |
| Node.js | 22.x |
| npm | bundled with Node 22 |
| git | any recent version |

### Install Node 22 in Termux

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts git -y   # Termux's nodejs-lts tracks Node 22
node -v   # should print v22.x.x
```

---

## Steps

### 1. Clone the repo

```bash
git clone https://github.com/<your-org>/savant-site.git
cd savant-site
```

### 2. Install dependencies

```bash
npm install
```

npm will attempt to build `better-sqlite3`. On Android it will fail and print a
warning like:

```
npm warn optional SKIPPING OPTIONAL DEPENDENCY: better-sqlite3@...
```

This is **expected and harmless**. All other dependencies install normally.

### 3. Start the dev server

```bash
npm run dev
```

At startup you will see:

```
[SAVANT] ⚠  WARNING: better-sqlite3 is unavailable (native build failed or not installed).
[SAVANT]    Running with in-memory storage — DB-backed features are disabled.
[SAVANT]    UI preview is fully functional. See ANDROID_DEV.md for setup details.

SAVANT_SERVER_ACTIVE :: PORT_3000
```

Open your browser (or use `curl`) at **`http://localhost:3000`**.

### 4. (Optional) Environment variables

Copy `.env.example` to `.env` and fill in any API keys you want to test:

```bash
cp .env.example .env
```

You do **not** need a database or any native modules for the UI preview.

---

## What works / what doesn't

| Feature | Status |
|---------|--------|
| All React UI routes | ✅ Fully functional |
| Vite HMR (hot-module reload) | ✅ Fully functional |
| `/api/ping` health check | ✅ Fully functional |
| `/api/posts` (CRUD) | ⚠️ In-memory only (resets on restart) |
| `/api/extract` (S3 archiver) | Requires AWS credentials |

---

## Troubleshooting

**`tsx: not found`** — means `npm install` failed before `tsx` was installed.
Re-run `npm install` and check for errors in required (non-optional)
dependencies.

**Port already in use** — change the port by setting `PORT=3001 npm run dev`
(you may need to edit `server.ts` if the port is hardcoded).

**Out of memory during install** — try `npm install --prefer-offline` or
install packages individually.
