# CivicFix frontend

CivicFix is the city complaint and service interface for the Programming Hero B7A7 frontend assignment. It talks to the B7A6 API. Core records are not mocked.

## Scripts

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm test
```

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_API_URL` — API base, including `/api/v1`
- `NEXT_PUBLIC_APP_URL` — this site, used for metadata
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe test publishable key
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — optional; Google sign-in stays disabled until it is set

The backend must point `STRIPE_SUCCESS_URL` at `/payment/success` and `STRIPE_CANCEL_URL` at `/payment/cancel` on this site.

## Roles

| Role | Home |
|---|---|
| Citizen | `/dashboard` |
| Staff | `/staff` |
| Admin | `/admin` |

Signed-out visits to those areas go to `/login`. The wrong role goes to `/unauthorized`. Route checks are UX only. The API still authorizes every request.

Demo sign-in buttons use the backend seed accounts and call `POST /auth/login`.

## Payments

Checkout calls `POST /payments/create-session` and redirects to the Stripe URL the API returns. Success and cancel pages then call `GET /payments/{id}`. The browser never marks a payment paid.

There is no payment-list endpoint, so the payments page looks up one payment id. There is no staff analytics endpoint, so staff workload counts come from the complaints assigned to that account. User search has no `isActive` query, so activation is a row action. There is no contact endpoint, so the contact form validates locally and does not claim the message was stored.

## Deploy

```bash
npm run build
npm start
```

Set the same public environment variables in the host. Do not commit `.env.local`.
