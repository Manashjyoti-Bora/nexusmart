# 🛒 NexusMart — Full-Stack E-Commerce Platform

A complete online store proving the full stack: **Next.js App Router · TypeScript · MongoDB · JWT authentication · cart & checkout · admin panel**.

Built by [Manashjyoti Bora](https://manashjyoti-bora.vercel.app) · [GitHub](https://github.com/Manashjyoti-Bora)

## ✨ Features

- 🛍️ **Product catalog** — search + category filtering, product detail pages (SSG)
- 🛒 **Cart** — optimistic updates, localStorage persistence, quantity controls
- 🔐 **Authentication** — signup/login with bcrypt hashing, JWT in HTTP-only cookies, rate-limited login
- 👤 **User dashboard** — protected route with profile + order history
- 💳 **Checkout** — server-side validated orders saved to MongoDB (mock payment)
- 🛠️ **Admin panel** — role-gated product create/delete (server-side redirect for non-admins)
- ✅ **Validation everywhere** — shared Zod schemas on client AND server
- 🎨 Dark premium UI, fully responsive, accessible (labels, focus rings, aria)
- 🧯 **Demo mode** — runs with zero configuration (no DB needed); connects to MongoDB when you add the URI

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # optional — app runs in demo mode without it
npm run dev                  # http://localhost:3000
```

## 🔑 Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | no* | MongoDB Atlas connection string. Without it: demo mode (sample catalog, no persistence) |
| `JWT_SECRET` | prod | Long random string for signing tokens (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | no | The email that gets the admin role on signup |

## 🗄️ MongoDB Atlas setup (free, 10 min)

1. Create account at **cloud.mongodb.com** → Build a Database → **M0 FREE** tier
2. Username + password create koribo (Database Access)
3. **Network Access** → Add IP → **0.0.0.0/0** (allow from anywhere — needed for Vercel)
4. **Connect → Drivers** → copy the connection string
5. Replace `<password>` and add the DB name: `...mongodb.net/nexusmart`
6. Paste as `MONGODB_URI` in `.env.local` and in Vercel env vars
7. First page load auto-seeds 8 demo products ✅

## ☁️ Deploy (Vercel)

Push to GitHub → vercel.com → Import → add the 3 env vars → Deploy.

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/ (signup · login · logout · me)   ← JWT + bcrypt + rate limit
│   │   ├── products/ (list · create · delete)     ← admin-gated writes
│   │   └── orders/ (history · place order)        ← server-computed totals
│   ├── products/[slug]/  ← SSG product pages
│   ├── cart/ · login/ · signup/
│   ├── account/  ← protected (server redirect)
│   └── admin/    ← role-gated (server redirect)
├── components/   ← navbar, product grid/card, auth form, admin panel
└── lib/          ← db (cached connection), models, auth, schemas, cart store
```

**Security notes:** passwords bcrypt-hashed (12 rounds) · JWT in HTTP-only cookies (XSS-safe) · same-error login responses (no user enumeration) · server-side totals (no client price tampering) · Zod validation on every mutation · security headers.
