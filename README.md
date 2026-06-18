# Spendly 💸

A production-style expense tracking SaaS built end-to-end as an independent project.

## What it does
- Track income and expenses with AI-powered category classification
- Subscribe to plans via Stripe with trial handling and billing portal
- View financial analytics — category breakdowns, month-over-month trends
- Secure authentication with Google OAuth and JWT refresh token rotation

## Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod, Recharts  
**Backend:** Node.js, Express.js, TypeScript, MongoDB  
**Auth:** JWT (access + refresh tokens), HttpOnly cookies, Google OAuth via Passport.js  
**Payments:** Stripe Checkout, Billing Portal, Webhooks  
**AI:** Groq LLM API for transaction classification  

## Architecture
Layered backend: Repository → Service → Controller → Route  
MongoDB aggregation pipelines with compound indexes for analytics performance  
Webhook-driven subscription upgrades with trial handling
