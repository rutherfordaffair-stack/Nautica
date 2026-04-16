# 🚤 Nautica — Platfòm pou Lwe Bato

Sit web konplè pou lwe bato (tankou Airbnb pou bato). Moun ka mete bato pou lwe, epi lòt moun ka rezève yo.

## ✨ Fonksyonalite

- 🔐 **Otantifikasyon** — Email/modpas + Google OAuth
- 🚢 **Jere Bato** — Mete, modifye, aktive/dezaktive bato
- 🔍 **Rechèch & Filtre** — Pa peyi, rejyon, kalite, pri, kapasité
- 📅 **Rezèvasyon** — Pa jou oubyen pa zè
- 💳 **Peman Stripe** — Sekiè, webhook pou konfirmasyon
- 📸 **Upload Foto** — Cloudinary
- ⭐ **Avis & Nòt** — Apre lokasyon
- 📊 **Dashboard** — Bato, rezèvasyon, revni
- 📱 **Responsive** — Mobil ak desktop

## 🛠️ Stack Teknoloji

| Kategori | Teknoloji |
|----------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Base done | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Peman | Stripe |
| Imaj | Cloudinary |
| Deploy | Vercel |

## 🚀 Kòmanse (Setup Lokal)

### 1. Clone & Instale

```bash
git clone https://github.com/TON-USERNAME/nautica.git
cd nautica
npm install
```

### 2. Kreye baz done sou Supabase

1. Ale sou [supabase.com](https://supabase.com) epi kreye yon pwojè gratis
2. Ale nan **Settings → Database → Connection string**
3. Kopye URL koneksyon an

### 3. Konfigire Stripe

1. Kreye kont sou [stripe.com](https://stripe.com)
2. Nan dashboard Stripe, pran **Publishable key** ak **Secret key**
3. Pou webhook lokal: `npm install -g stripe` epi `stripe listen --forward-to localhost:3000/api/payments/webhook`

### 4. Konfigire Cloudinary

1. Kreye kont gratis sou [cloudinary.com](https://cloudinary.com)
2. Pran **Cloud Name**, **API Key**, **API Secret** nan dashboard ou

### 5. Google OAuth (opsyonèl)

1. Ale sou [Google Cloud Console](https://console.cloud.google.com)
2. Kreye OAuth 2.0 credentials
3. Ajoute `http://localhost:3000/api/auth/callback/google` kòm redirect URI

### 6. Variables d'environnement

```bash
cp .env.example .env.local
```

Ranpli tout valè yo nan `.env.local`

### 7. Inicialice baz done

```bash
# Kreye tabèl yo
npm run db:push

# Jenere Prisma client
npm run db:generate

# (Opsyonèl) Mete done demo
npm run db:seed
```

### 8. Lanse aplikasyon

```bash
npm run dev
```

Ouvè [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Deplwaye sou Vercel

### Metòd Rapid (Recommande)

1. **Push sou GitHub:**
```bash
git init
git add .
git commit -m "🚀 Premye vèsyon Nautica"
git remote add origin https://github.com/TON-USERNAME/nautica.git
git push -u origin main
```

2. **Konekte Vercel:**
   - Ale sou [vercel.com](https://vercel.com)
   - Klike **Add New Project**
   - Seleksyone repo GitHub ou a
   - Klike **Deploy**

3. **Ajoute Variables d'Environnement sou Vercel:**
   - Nan dashboard pwojè ou, ale **Settings → Environment Variables**
   - Ajoute tout valè nan `.env.example` yo
   - Mete `NEXTAUTH_URL` = URL Vercel ou (ex: `https://nautica.vercel.app`)

4. **Konfigire Stripe Webhook pou Pwoduksyon:**
   - Nan Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://TON-DOMAINE.vercel.app/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Kopye **Signing secret** → mete nan `STRIPE_WEBHOOK_SECRET`

5. **Redeplwaye** apre ajoute variables yo.

---

## 📁 Achitekti Pwojè

```
nautica/
├── prisma/
│   ├── schema.prisma       # Modèl baz done
│   └── seed.ts             # Done demo
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login, Register
│   │   ├── (dashboard)/    # Dashboard pwopriyetè
│   │   ├── api/            # API Routes
│   │   │   ├── auth/       # NextAuth + Register
│   │   │   ├── boats/      # CRUD bato
│   │   │   ├── bookings/   # Rezèvasyon
│   │   │   ├── payments/   # Stripe
│   │   │   └── upload/     # Cloudinary
│   │   ├── boats/          # Rechèch + Detay bato
│   │   ├── bookings/       # Checkout + Siksè
│   │   └── page.tsx        # Paj dakèy
│   ├── components/
│   │   ├── boats/          # Kart, Filtre, Avis...
│   │   ├── booking/        # Widget, Actions...
│   │   └── layout/         # Navbar, Footer, Sidebar
│   ├── lib/
│   │   ├── auth.ts         # Config NextAuth
│   │   ├── prisma.ts       # Client Prisma
│   │   └── stripe.ts       # Config Stripe
│   └── types/              # Types TypeScript
└── .env.example            # Template variables
```

## 🔑 Kont Demo (apre seed)

| Email | Modpas | Wòl |
|-------|--------|-----|
| jean@nautica.com | demo1234 | Pwopriyetè bato |
| marie@nautica.com | demo1234 | Lwa bato |

## 💡 Pwochen Etap (Amelyorasyon)

- [ ] Chat an tan reyèl ant lwa ak pwopriyetè
- [ ] Kat entèaktif (Mapbox/Google Maps)
- [ ] Notifikasyon email (Nodemailer/Resend)
- [ ] Aplikasyon mobil (React Native)
- [ ] Peman pou pwopriyetè (Stripe Connect)
- [ ] Verifikasyon ID pwopriyetè
- [ ] Kalandriye disponibilite
- [ ] Multipli deviz

---

Fè ak ❤️ pou navigatè yo | **Nautica 2024**
