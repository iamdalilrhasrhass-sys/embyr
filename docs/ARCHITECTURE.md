# Embir Architecture

## Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **i18n:** next-intl (25 languages)
- **Database:** PostgreSQL (localhost), Prisma ORM
- **Auth:** Custom (SMS verification via Twilio, JWT sessions)
- **Payments:** Stripe
- **Real-time:** Socket.IO
- **Storage:** Local filesystem (/public/uploads)
- **Deployment:** VPS (Ubuntu), PM2 process manager

## Directory Structure
```
/root/embir/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized pages (next-intl)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── blog/          # 30 articles across 4 categories
│   │   │   ├── about/         # About page
│   │   │   ├── paris/         # City landing pages
│   │   │   ├── auth/          # Login/Register
│   │   │   └── layout.tsx     # Root layout with OG metadata
│   │   ├── api/               # REST API endpoints
│   │   └── admin/             # Admin dashboard (analytics, feedback)
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities (analytics, prisma)
│   └── hooks/                 # Custom hooks (useABTest)
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets (og-image, uploads)
├── scripts/                   # Automation (seo-monitor, performance-check)
├── docs/                      # Documentation
├── data/                      # Data dumps (seo-reports, performance)
└── emails/                    # Email templates
```

## Data Flow
1. **User → Frontend** (Next.js SSR/CSR)
2. **Frontend → API** (fetch to /api/* routes)
3. **API → Prisma → PostgreSQL** (server-side queries)
4. **API → External** (Stripe payments, Twilio SMS, analytics)
5. **Cron → Scripts** (SEO monitor, performance checks)

## Key API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/send-code | Send SMS verification code |
| POST | /api/auth/verify-code | Verify code + create session |
| GET  | /api/profiles | List profiles with filters |
| POST | /api/analytics/track | Track analytics events |
| POST | /api/feedback | Submit user feedback |
| GET  | /api/feedback?status=new | List feedback (admin) |

## Database
- **Engine:** PostgreSQL 16
- **Connection:** Prisma with pg adapter
- **Key tables:** User, Profile, Message, Media, AnalyticsEvent, Feedback, ABTest, PerformanceMetric

## Scalability
- Stateless API (scale horizontally behind load balancer)
- Database connection pooling (Prisma)
- Static asset CDN for public/ files
- PM2 cluster mode for multi-core utilization
