<div align="center">

![NexusMart](https://capsule-render.vercel.app/api?type=cylinder&height=140&text=NexusMart&fontSize=50&color=0:0f766e,100:10b981&fontColor=ffffff&animation=fadeIn)

[![Typing](https://readme-typing-svg.demolab.com/?font=Fira+Code&size=17&pause=1000&color=10B981&center=true&vCenter=true&width=620&lines=Full-Stack+E-Commerce+Platform;Real+Database+%E2%80%A2+Real+Auth+%E2%80%A2+Real+Checkout;MongoDB+Atlas+%E2%80%A2+JWT+%2B+bcrypt+%E2%80%A2+Admin+Panel;Try+it+live+%E2%86%92+create+account%2C+place+an+order!)](https://nexusmart-dusky.vercel.app)

[![Live Demo](https://img.shields.io/badge/🔴_LIVE_DEMO-nexusmart--dusky.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://nexusmart-dusky.vercel.app)
[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-manashjyoti--bora.vercel.app-6366f1?style=for-the-badge)](https://manashjyoti-bora.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_14-App_Router-000000?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT_+_bcrypt-d63aff?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1?style=flat-square)

**Try it live:** create an account → add to cart → place an order. Everything works, everything persists.

📱 *Engineered and deployed entirely from an Android phone (Termux + Git + Vercel + MongoDB Atlas).*

</div>

---

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

## <img src="https://user-images.githubusercontent.com/74038190/212257465-7ce8d493-cac5-494e-982a-5a9deb852c4b.gif" width="26"> Features

| Area | What's inside |
|---|---|
| 🛍️ **Catalog** | 8-product store with instant search + category filtering, SSG product detail pages |
| 🛒 **Cart** | Optimistic updates, localStorage persistence, quantity controls, empty/success states |
| 🔐 **Authentication** | Signup/login with **bcrypt hashing (12 rounds)**, **JWT in HTTP-only cookies** (XSS-safe), rate-limited login (10 attempts/10 min) |
| 👤 **User Dashboard** | Protected route (server-side redirect), profile + full order history |
| 💳 **Checkout** | Orders saved to MongoDB with **server-computed totals** — client price tampering is impossible |
| 🛠️ **Admin Panel** | Role-gated (server redirect for non-admins): product create & delete via admin-only APIs |
| ✅ **Validation** | Shared **Zod schemas on client AND server** — validation can never drift apart |
| 🧯 **Demo Mode** | Runs with **zero configuration** (no DB needed); auto-switches to MongoDB when `MONGODB_URI` is set |
| 🎨 **UI/UX** | Dark premium theme, fully responsive, accessible (labels, focus rings, aria), loading skeletons |
| 🔒 **Security** | Security headers (HSTS, X-Frame DENY, nosniff), same-error login responses (no user enumeration) |

## <img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width="26"> Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # signup · login · logout · me  → JWT + bcrypt + rate limit
│   │   ├── products/      # list (public) · create/delete (admin-gated)
│   │   └── orders/        # history · place order (server-computed totals)
│   ├── products/[slug]/   # SSG product pages with generateStaticParams
│   ├── cart/              # optimistic cart + checkout flow
│   ├── login/ · signup/   # shared AuthForm with client-side Zod
│   ├── account/           # 🔒 protected — server-side session check
│   └── admin/             # 🔒 role-gated — server redirect for non-admins
├── components/            # navbar · product grid/card · auth form · admin panel
└── lib/
    ├── db.ts              # cached Mongoose connection (serverless-safe)
    ├── models.ts          # User · Product · Order schemas
    ├── auth.ts            # JWT sign/verify via jose, HTTP-only cookie session
    ├── schemas.ts         # shared Zod validation (client + server)
    └── cart-store.tsx     # React Context cart with localStorage persistence
```

## <img src="https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7ed2.gif" width="26"> Security Decisions

- **Passwords:** bcrypt with 12 rounds — never stored in plain text
- **Sessions:** JWT in HTTP-only, SameSite=Lax, Secure cookies — JavaScript can't read the token
- **Login:** identical error for wrong email vs wrong password — prevents user enumeration
- **Totals:** computed server-side from submitted items — client can't tamper with prices
- **Rate limiting:** login capped at 10 attempts per 10 minutes per IP
- **Validation:** every mutation validated with Zod on the server, even if the client already validated
- **Headers:** HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff on every response

## <img src="https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif" width="26"> Quick Start

```bash
# 1. Clone & install
git clone https://github.com/Manashjyoti-Bora/nexusmart.git
cd nexusmart
npm install

# 2. Configure (OPTIONAL — runs in demo mode without it)
cp .env.example .env.local

# 3. Run
npm run dev          # http://localhost:3000
```

## 🔑 Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | No* | MongoDB Atlas connection string. Without it: **demo mode** (sample catalog, sessions work, no persistence) |
| `JWT_SECRET` | Production | Long random string for signing tokens — `openssl rand -base64 32` |
| `ADMIN_EMAIL` | No | The email that receives the **admin role** on signup |

## 🗄️ MongoDB Atlas Setup (free tier, ~10 min)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → Build a Database → **M0 FREE**
2. Create a database user (save the password!)
3. **Network Access** → Add IP → **0.0.0.0/0** (required for Vercel's dynamic IPs)
4. **Connect → Drivers** → copy the connection string
5. Replace `<db_password>` and insert the database name: `...mongodb.net/nexusmart?...`
6. Add as `MONGODB_URI` in `.env.local` + Vercel env vars → redeploy
7. First page load **auto-seeds** 8 demo products ✅

## ☁️ Deploy to Vercel

1. Push to GitHub
2. [vercel.com](https://vercel.com) → Add New → Project → Import
3. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`
4. Deploy — live in ~2 minutes 🚀

## 🧪 Try the Admin Panel

Sign up on the live site with the email set in `ADMIN_EMAIL` → a **🔧 Admin** button appears in the navbar → create/delete products and watch the catalog update live.

## <img src="https://user-images.githubusercontent.com/74038190/213910845-af37a709-8995-40d6-be59-724526e3c3d7.gif" width="26"> What I Learned Building This

- **Serverless + Mongoose:** connection caching is mandatory — one connection per request melts Atlas
- **Never trust the client:** totals, roles and validation all belong on the server
- **HTTP-only cookies > localStorage** for tokens — XSS can't touch them
- **Demo-mode fallbacks** make a portfolio project reviewable in seconds, without asking recruiters to set up a database

---

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/218265814-3084a4ba-809c-4135-afc0-8685d0f634b3.gif" width="200" alt="typing"/>

**Built with ❤️ (and a phone 📱) by [Manashjyoti Bora](https://manashjyoti-bora.vercel.app)**

[![GitHub](https://img.shields.io/badge/GitHub-Manashjyoti--Bora-181717?style=for-the-badge&logo=github)](https://github.com/Manashjyoti-Bora)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/manashjyoti-bora-323b97405)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:manashjyotibora122@gmail.com)

⭐ **Star this repo if it helped you!**

</div>


![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:0f766e,100:10b981&height=100&section=footer)

<!-- v1.0.0 -->
