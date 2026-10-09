# CivicFix API documentation

This frontend talks to the B7A6 CivicFix API. Core records are never mocked.

| Item | Value |
| --- | --- |
| Live API | `https://civicfix-backend-nine.vercel.app/api/v1` |
| Swagger UI | `https://civicfix-backend-nine.vercel.app/api/docs` |
| Local / production browser base | `/api/v1` (Next.js rewrites to the live API) |
| Auth | `Authorization: Bearer <accessToken>` |
| Content type | `application/json` |

Typed client modules live in `src/lib/api/`. Domain types live in `src/types/domain.ts`.

---

## Envelope

### Success

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Database request failed",
  "errors": [{ "field": "email", "message": "Enter a valid email" }]
}
```

Validation failures usually return **HTTP 400**, not 422. Unauthorized is **401**. Forbidden is **403**. Missing resources are **404**.

### Pagination

List endpoints that paginate return:

```json
{
  "success": true,
  "message": "...",
  "data": {
    "items": [],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

## Auth

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | No | — | Creates a **CITIZEN** account. Body: `email`, `password`, `fullName`, optional `phone`. |
| `POST` | `/auth/login` | No | — | Body: `email`, `password`. Returns `{ user, accessToken }`. |
| `POST` | `/auth/google` | No | — | Body: `{ idToken }`. Used only when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set. |
| `GET` | `/auth/me` | Yes | Any | Current user. |

There is **no** `POST /auth/logout`. The browser clears the token locally.

### Demo seed accounts

| Role | Email | Password |
| --- | --- | --- |
| Citizen | `citizen1@civicfix.local` | `Citizen@12345` |
| Staff | `staff1@civicfix.local` | `Staff@12345` |
| Admin | `admin@civicfix.local` | `Admin@12345` |

### Frontend token storage

- `localStorage` key: `civicfix.accessToken`
- Cookie: `civicfix_access_token` (so `src/proxy.ts` can gate desks)
- On **401**, the client clears the token

---

## Users

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/users/me` | Yes | Any | Own profile. |
| `PATCH` | `/users/me` | Yes | Any | Body: optional `fullName`, `phone`. |
| `GET` | `/users` | Yes | ADMIN | Query: `page`, `limit`, `search`, `role`, `sortBy` (`createdAt` \| `fullName` \| `email`), `sortOrder`. No `isActive` filter. |
| `GET` | `/users/{id}` | Yes | ADMIN | One user. |
| `PATCH` | `/users/{id}/status` | Yes | ADMIN | Body: `{ isActive: boolean }`. |

---

## Departments

Public list/get. Writes are admin-only.

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/departments` | No | — | Query: `page`, `limit`, `search`, `sortBy` (`name` \| `createdAt`), `sortOrder`, `isActive`. |
| `GET` | `/departments/{id}` | No | — | One department. |
| `POST` | `/departments` | Yes | ADMIN | Create. |
| `PATCH` | `/departments/{id}` | Yes | ADMIN | Update. |
| `DELETE` | `/departments/{id}` | Yes | ADMIN | Delete. |

---

## Categories

Public list/get. Writes are admin-only.

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/categories` | No | — | Query: `page`, `limit`, `search`, `departmentId`, `sortBy` (`name` \| `createdAt`), `sortOrder`, `isActive`. |
| `GET` | `/categories/{id}` | No | — | One category. |
| `POST` | `/categories` | Yes | ADMIN | Create. Links a department. |
| `PATCH` | `/categories/{id}` | Yes | ADMIN | Update. |
| `DELETE` | `/categories/{id}` | Yes | ADMIN | Delete. |

When a complaint is filed, the department is copied from the chosen category.

---

## Complaints

All complaint routes require auth. Lists are role-scoped by the API:

| Role | List scope |
| --- | --- |
| CITIZEN | Own complaints |
| STAFF | Complaints with an active assignment to that staff account |
| ADMIN | Every complaint |

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/complaints` | Yes | Any | Query: `page`, `limit`, `search`, `status`, `priority`, `categoryId`, `departmentId`, `sortBy` (`createdAt` \| `updatedAt` \| `priority` \| `status` \| `title`), `sortOrder`. |
| `POST` | `/complaints` | Yes | CITIZEN, ADMIN | Create. Body below. |
| `GET` | `/complaints/{id}` | Yes | Scoped | Detail with category, department, location, assignments, feedback. |
| `PATCH` | `/complaints/{id}` | Yes | Scoped | Citizen may edit only while **SUBMITTED**. Staff cannot edit details. |
| `DELETE` | `/complaints/{id}` | Yes | Scoped | Citizen may delete only while **SUBMITTED**. |
| `PATCH` | `/complaints/{id}/status` | Yes | Scoped | Body: `{ status, note? }`. Must follow transitions. |
| `POST` | `/complaints/{id}/assign` | Yes | ADMIN | Body: `{ staffId, departmentId?, notes? }`. |
| `GET` | `/complaints/{id}/history` | Yes | Scoped | Status history. |
| `GET` | `/complaints/{id}/comments` | Yes | Scoped | Comments. Staff internal notes are filtered by the API for citizens. |
| `POST` | `/complaints/{id}/comments` | Yes | Scoped | Body: `{ content, isInternal? }`. |
| `GET` | `/complaints/{id}/feedback` | Yes | Scoped | Existing feedback, or **404** if none. |
| `POST` | `/complaints/{id}/feedback` | Yes | CITIZEN | Body: `{ rating: 1–5, comment? }`. Allowed after **RESOLVED** or **CLOSED**. |

### Create body

```json
{
  "title": "Standing water across the lane",
  "description": "Water has stayed for two days beside the school gate.",
  "categoryId": "uuid",
  "priority": "HIGH",
  "location": {
    "address": "Lane 4",
    "city": "Dhaka",
    "area": "Ward 12",
    "latitude": 23.81,
    "longitude": 90.41
  }
}
```

`title` needs at least five characters. `priority` defaults on the API when omitted. `area`, `latitude`, and `longitude` are optional.

### Statuses

`SUBMITTED` · `UNDER_REVIEW` · `ASSIGNED` · `IN_PROGRESS` · `RESOLVED` · `CLOSED` · `REJECTED` · `CANCELLED`

### Priorities

`LOW` · `MEDIUM` · `HIGH` · `URGENT`

### Allowed transitions

Matches backend `COMPLAINT_TRANSITIONS` and `src/lib/complaints/workflow.ts`.

| From | To |
| --- | --- |
| SUBMITTED | UNDER_REVIEW, REJECTED, CANCELLED |
| UNDER_REVIEW | ASSIGNED, REJECTED, CANCELLED |
| ASSIGNED | IN_PROGRESS, REJECTED, CANCELLED |
| IN_PROGRESS | RESOLVED, CANCELLED |
| RESOLVED | CLOSED |
| CLOSED / REJECTED / CANCELLED | _(none)_ |

Role limits on top of that map:

| Role | Extra limit |
| --- | --- |
| CITIZEN | Only `CANCELLED`, and only from `SUBMITTED` or `UNDER_REVIEW` |
| STAFF | Only `IN_PROGRESS` or `RESOLVED` on an assigned complaint |
| ADMIN | Full transition map, plus assignment |

---

## Assignments

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/assignments/staff` | Yes | ADMIN | Staff accounts that can be assigned. |

Assignment itself is `POST /complaints/{id}/assign`.

---

## Payments

Amounts are **integer cents**. `500` with currency `usd` is `$5.00`.

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/payments/create-session` | Yes | CITIZEN, ADMIN | Body: `{ amount, currency?, complaintId?, description? }`. Returns `{ payment, checkoutUrl, sessionId }`. |
| `GET` | `/payments/{id}` | Yes | Owner / admin | Stored payment. Browser never marks paid. |
| `POST` | `/payments/webhook` | Stripe | — | Webhook authority. Not called from this frontend. |

There is **no payment list** endpoint. The payments desk looks up one payment id (remembered in `sessionStorage` as `civicfix.lastPaymentId` before Stripe redirect).

Payment statuses: `PENDING` · `PAID` · `FAILED` · `CANCELLED`.

Backend Stripe return URLs should point at this site:

- Success → `/payment/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel → `/payment/cancel`

The success page reads the remembered CivicFix payment id, then calls `GET /payments/{id}`. It does not mark the payment paid.

---

## Notifications

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/notifications` | Yes | Any | Inbox for the signed-in user. |
| `PATCH` | `/notifications/{id}/read` | Yes | Owner | Marks one notification read. |

---

## Analytics

Admin only. There is no staff analytics feed.

| Method | Path | Auth | Role | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/analytics/overview` | Yes | ADMIN | Totals for complaints, users, payments. |
| `GET` | `/analytics/complaints` | Yes | ADMIN | `byStatus`, `byPriority`, `byCategory`, `recent`. |

No time-series or department-workload series is returned. Staff workload on this site is counted from `GET /complaints` for that staff session.

---

## Health

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/health` | No | `{ status, database, redis, timestamp }`. |

---

## Missing endpoints (do not invent)

| Missing | What this frontend does instead |
| --- | --- |
| Payment list | Look up one payment by id |
| Staff analytics API | Count assigned complaints |
| User list `isActive` query | Activate/deactivate from the row |
| `POST /auth/logout` | Clear token in the browser |
| Contact inbox | Validate the form, then say it was not sent |
| Lookup payment by Stripe session id | Use remembered CivicFix payment id |

---

## Role → desk map

| Role | Frontend home | Typical API use |
| --- | --- | --- |
| CITIZEN | `/dashboard` | Own complaints, feedback, checkout, notifications, profile |
| STAFF | `/staff` | Assigned queue, status moves, comments, profile |
| ADMIN | `/admin` | Users, departments, categories, all complaints, assign, analytics |

Route checks in `src/proxy.ts` are UX only. The API remains the authority on every request.

---

## Frontend client map

| Module | Paths |
| --- | --- |
| `src/lib/api/auth.ts` | `/auth/*` |
| `src/lib/api/users.ts` | `/users/*` |
| `src/lib/api/departments.ts` | `/departments/*` |
| `src/lib/api/categories.ts` | `/categories/*` |
| `src/lib/api/complaints.ts` | `/complaints/*` (except assign) |
| `src/lib/api/assignments.ts` | `/complaints/{id}/assign`, `/assignments/staff` |
| `src/lib/api/feedback.ts` | `/complaints/{id}/feedback` |
| `src/lib/api/payments.ts` | `/payments/create-session`, `/payments/{id}` |
| `src/lib/api/notifications.ts` | `/notifications/*` |
| `src/lib/api/analytics.ts` | `/analytics/*` |
| `src/lib/api/client.ts` | Shared `apiRequest`, `ApiClientError` |

Interactive OpenAPI UI for the live backend: [https://civicfix-backend-nine.vercel.app/api/docs](https://civicfix-backend-nine.vercel.app/api/docs).
