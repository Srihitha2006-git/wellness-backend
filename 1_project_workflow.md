# 🏥 Wellness Platform — Full Project Workflow

## Overview

The Wellness Platform is a **Spring Boot + React** full-stack application that connects **patients** with **wellness practitioners** for therapy session booking, practitioner discovery, product purchasing, and real-time notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA |
| Database | MySQL (`wellness_db`) |
| Frontend | React 18 + Vite, React Router v6, Tailwind CSS |
| Real-time | WebSocket (STOMP over SockJS) |
| Email | Spring Mail (Gmail SMTP) |
| Auth | JWT Access + Refresh Tokens |
| Scheduler | Spring `@Scheduled` |

---

## Architecture

```
wellness-frontend (React/Vite :5173)
        │
        │ HTTP REST + WebSocket
        ▼
wellness-backend (Spring Boot :8081)
        │
        │ JPA / Hibernate
        ▼
  MySQL wellness_db
```

---

## Database Schema — Tables Built

| # | Table | Purpose |
|---|---|---|
| 1 | `users` | Stores all users (PATIENT, PRACTITIONER, ADMIN roles) |
| 2 | `practitioner_profile` | Extended profile linked to PRACTITIONER user |
| 3 | `practitioner_availability` | Weekly schedule slots per practitioner |
| 4 | `practitioner_request` | Patient-to-practitioner consultation requests |
| 5 | `therapy_session` | Booked/confirmed/cancelled sessions |
| 6 | `notifications` | System-generated in-app notifications |
| 7 | `product` | Wellness products for marketplace |
| 8 | `orders` | Customer orders |
| 9 | `order_item` | Line items within an order |
| 10 | `review` | Post-session reviews (schema only, no API yet) |
| 11 | `question` | Q&A from users (schema only, no API yet) |
| 12 | `answer` | Practitioner answers to questions (schema only, no API yet) |

---

## Development Workflow (Done in This Order)

```
1.  Database Schema Design (schema.sql - 12 tables)
2.  Backend Models + Repos (JPA Entities & Repositories)
3.  Auth System (JWT Register/Login/Refresh, Forgot & Reset Password)
4.  Practitioner Module (Profile CRUD, Verification, Document Upload)
5.  Availability Module (Weekly Slot Setup)
6.  Therapy Session Module (Book / Cancel / Reschedule, Slot calculation)
7.  Practitioner Request Module (Patient sends request, Practitioner accepts/rejects)
8.  Product Marketplace (Product CRUD, Categories, Search & Filter)
9.  Orders + Cart (Create Order, History, Cancel, Pay, Status Update)
10. Email Service (Booking confirmations, Reminders via Gmail SMTP)
11. WebSocket / Real-time (SockJS + STOMP subscriptions)
12. Notification System (In-app notifications, Automatic cleanup)
13. Session Reminder Scheduler (30-min and 1-hour auto-reminders)
14. Admin Dashboard (User mgmt, Practitioner verify, Order management)
15. Frontend Pages & Routing (All pages + React Router v6)
16. Bug Fixes (Booking 500 errors, Enum fixes, 403 Notification errors fixed)
```

---

## User Journey Flows

### 🧑‍💼 Patient Journey
1. **Register** → `POST /api/auth/register` (role: PATIENT)
2. **Login** → `POST /api/auth/login` → receives JWT tokens
3. **Browse Practitioners** → `GET /api/practitioners/verified`
4. **Check Availability** → `GET /api/availability/{practitionerId}`
5. **See Available Slots** → `GET /api/sessions/{practitionerId}/slots?date=YYYY-MM-DD`
6. **Book Session** → `POST /api/sessions/book`
7. **Get Confirmation Email** → Spring Mail sends booking confirmation
8. **View My Bookings** → `GET /api/sessions/user/{userId}`
9. **Cancel/Reschedule** → `PUT /api/sessions/{id}/cancel` or `/reschedule`
10. **Browse Products** → `GET /api/products/available`
11. **Add to Cart** → localStorage cart management
12. **Checkout** → `POST /api/orders`
13. **View Order History** → `GET /api/orders/history`
14. **Receive Notifications** → WebSocket + in-app bell

### 🧑‍⚕️ Practitioner Journey
1. **Register** → `POST /api/auth/register` (role: PRACTITIONER)
2. **Onboard** → `/practitioner/onboarding` → create profile, upload documents
3. **Set Availability** → `POST /api/availability/{practitionerId}`
4. **Wait for Admin Verification** → Admin calls `PUT /api/practitioners/{id}/verify`
5. **View Dashboard** → `/practitioner/dashboard`
6. **See Upcoming Sessions** → `GET /api/sessions/practitioner/{practitionerId}`
7. **Handle Patient Requests** → Accept/Reject via `PUT /api/practitioners/requests/{id}/accept`
8. **Receive Reminders** → Scheduler sends 30-min and 1-hour WebSocket notifications

### 🛠️ Admin Journey
1. **Login** (hardcoded admin or admin role in DB)
2. **View Admin Dashboard** → `/admin/dashboard`
3. **Verify Practitioners** → `PUT /api/practitioners/{id}/verify?verified=true`
4. **Manage Users** → View all users
5. **Manage Orders** → `PUT /api/orders/{id}/status`
6. **View All Requests** → `GET /api/practitioners/requests/all`
