# 🚀 Wellness Platform — Implemented Features

---

## Feature 1: Authentication & User Management

### What it does
Full JWT-based auth with register, login, session refresh, and secure password reset.

### How it works

**Backend:**
- `AuthController` → `/api/auth/**`
- `AuthService` handles BCrypt password hashing, JWT generation (access + refresh tokens)
- `JwtAuthenticationFilter` intercepts every request and validates the Bearer token
- `PasswordResetToken` model stores one-time tokens for forgotten passwords

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Creates new user (PATIENT, PRACTITIONER, ADMIN roles) |
| `/api/auth/login` | POST | Returns `accessToken` + `refreshToken` + `user` |
| `/api/auth/refresh` | POST | Issues new access token using refresh token |
| `/api/auth/forgot-password` | POST | Sends reset link to email (generic message for security) |
| `/api/auth/reset-password` | POST | Validates token + sets new BCrypt-hashed password |

**Frontend:**
- `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`
- `authService.js` handles all HTTP calls
- `localStorage` stores `accessToken`, `refreshToken`, `user`, `userRole`
- `jwtService.js` decodes and checks token expiry

---

## Feature 2: Practitioner Profiles

### What it does
Practitioners create and manage their professional profiles. Admins verify them. Patients browse verified practitioners.

### How it works

**Backend:**
- `PractitionerController` → `/api/practitioners/**`
- `PractitionerService` handles CRUD, verification flag toggling, document upload to disk (`/uploads/`)
- `PractitionerProfile` model stores specialization, rating, qualifications, experience, verified status

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `GET /api/practitioners` | GET | Public | All practitioners |
| `GET /api/practitioners/verified` | GET | Public | Only verified practitioners |
| `GET /api/practitioners/{id}` | GET | Public | Get one practitioner |
| `POST /api/practitioners` | POST | PRACTITIONER | Create profile |
| `PUT /api/practitioners/{id}` | PUT | PRACTITIONER | Update profile |
| `PUT /api/practitioners/{id}/verify` | PUT | ADMIN | Toggle verified flag |
| `GET /api/practitioners/search?specialization=` | GET | Public | Filter by specialization |
| `POST /api/practitioners/{id}/documents/upload` | POST | PRACTITIONER | Upload credentials (PDF/images) |
| `GET /api/practitioners/{id}/documents` | GET | ADMIN | View uploaded docs |
| `GET /api/practitioners/me/documents` | GET | PRACTITIONER | View own docs |
| `GET /api/practitioners/documents/{id}/download` | GET | PRACTITIONER/ADMIN | Stream file |

**Frontend:**
- `PractitionerOnboarding.jsx` — multi-step form: create profile + upload documents
- `BrowseSessions.jsx` — lists verified practitioners with filters
- `PractitionerDashboard.jsx` — practitioner's own profile management

---

## Feature 3: Practitioner Availability

### What it does
Practitioners define their weekly schedule (day, start time, end time, slot duration). The system uses this to compute available booking slots.

### How it works

**Backend:**
- `AvailabilityController` → `/api/availability/**`
- `AvailabilityService` saves day-of-week slots per practitioner
- `PractitionerAvailability` model stores: day (MONDAY–SUNDAY), start/end time, slot duration (default 60 min)

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/availability/{practitionerId}` | GET | Returns all weekly slots |
| `POST /api/availability/{practitionerId}` | POST | Set/update a day's schedule |

**Frontend:**
- `AvailabilityDayCard.jsx` — renders one day's schedule
- `SessionCalendar.jsx` — calendar view of availability
- `PractitionerDashboard.jsx` — practitioner sets their availability

---

## Feature 4: Therapy Session Booking

### What it does
Patients book time slots with practitioners. Sessions can be cancelled or rescheduled. The system prevents double-booking via a unique DB constraint.

### How it works

**Backend:**
- `TherapySessionController` → `/api/sessions/**`
- `TherapySessionService` calculates available slots using availability + existing bookings, creates session, sends confirmation notification
- `TherapySession` model: status (`BOOKED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`), type (`ONLINE`/`OFFLINE`), payment status, notes, cancellation reason

| Endpoint | Method | Description |
|---|---|---|
| `POST /api/sessions/book` | POST | Create booking (practitionerId, date, startTime, type, notes) |
| `PUT /api/sessions/{id}/cancel` | PUT | Cancel with reason + who cancelled |
| `PUT /api/sessions/{id}/reschedule` | PUT | Reschedule to new date/time |
| `GET /api/sessions/user/{userId}` | GET | All sessions for a patient |
| `GET /api/sessions/practitioner/{id}` | GET | All sessions for a practitioner |
| `GET /api/sessions/{id}/slots?date=` | GET | Free slots on a given date |

**Slot Calculation Logic:**
1. Load practitioner's `PractitionerAvailability` for that day-of-week
2. Generate all possible slots (start → end, stepping by slot duration)
3. Remove slots already booked in `therapy_session` table
4. Return remaining free slots

**Frontend:**
- `BookingForm.jsx` — takes practitioner + date + slot
- `BrowseSessions.jsx` — browse practitioners, open booking modal
- `MyBookings.jsx` — view, cancel, reschedule existing bookings
- `sessionService.js` — all API calls for sessions

---

## Feature 5: Practitioner Request System

### What it does
Patients send consultation requests to practitioners before booking. Practitioners can accept, reject, complete, or cancel these requests.

### How it works

**Backend:**
- `PractitionerRequestController` → `/api/practitioners/requests/**`
- `PractitionerRequestService` manages status transitions and sends notifications on changes
- `PractitionerRequest` model: status (`pending`, `accepted`, `rejected`, `completed`, `cancelled`), priority, description

| Endpoint | Method | Who |
|---|---|---|
| `POST /create/{practitionerId}` | POST | PATIENT to create |
| `GET /practitioner/{id}` | GET | Get all requests for practitioner |
| `GET /practitioner/{id}/pending` | GET | Only pending requests |
| `PUT /{id}/accept` | PUT | PRACTITIONER accepts |
| `PUT /{id}/reject?reason=` | PUT | PRACTITIONER rejects |
| `PUT /{id}/complete` | PUT | PRACTITIONER marks done |
| `PUT /{id}/cancel` | PUT | Any party cancels |
| `GET /practitioner/{id}/pending-count` | GET | Count of pending |

**Frontend:**
- `PractitionerDashboard.jsx` — shows incoming requests with accept/reject buttons
- `UserDashboard.jsx` — shows sent requests and their status
- `requestService.js` — wraps all request API calls

---

## Feature 6: Product Marketplace

### What it does
An online store where patients can browse wellness/medicine products, filter by category, search, add to cart, and place orders.

### How it works

**Backend:**
- `ProductController` → `/api/products/**`
- `OrderController` → `/api/orders/**`
- `ProductService` → CRUD for products, stock validation
- `OrderService` → creates orders from cart items, tracks status, handles cancellation and payment

| Endpoint | Description |
|---|---|
| `GET /api/products` | All products |
| `GET /api/products/available` | In-stock only |
| `GET /api/products/search?query=` | Keyword search |
| `GET /api/products/category/{cat}` | By category |
| `POST /api/products` | ADMIN create product |
| `POST /api/orders` | Create order from cart items |
| `GET /api/orders/history` | User's order history |
| `PUT /api/orders/{id}/pay` | Mark as paid |
| `PUT /api/orders/{id}/cancel` | Cancel order |
| `PUT /api/orders/{id}/status` | ADMIN update status |

**Cart is 100% localStorage** — `orderService.js` has full cart CRUD functions stored in `localStorage['cart']`.

**Frontend:**
- `ProductMarketplace.jsx` — browse products with filters
- `Cart.jsx` — review cart items, checkout
- `OrderHistory.jsx` — view past orders

---

## Feature 7: Real-time Notifications (In-App)

### What it does
Users and practitioners receive in-app notifications for session events: booking confirmed, cancelled, rescheduled, reminder. Unread count badge updates live.

### How it works

**Backend:**
- `NotificationController` → `/api/notifications/**`
- `SessionNotificationService` creates `Notification` records and pushes WebSocket messages
- `Notification` model: `receiverId`, `receiverRole` (USER/PRACTITIONER), `sessionId`, `type`, `message`, `isRead`, `emailSent`
- `NotificationCleanupService` — `@Scheduled` task cleans old (read) notifications

| Endpoint | Description |
|---|---|
| `GET /api/notifications?page=&size=` | Paginated notifications for logged-in user |
| `GET /api/notifications/unread-count` | Count of unread notifications |
| `PUT /api/notifications/{id}/read` | Mark one as read |

**Frontend:**
- `NotificationContext.jsx` — global React context that polls `unreadCount` on an interval
- `NotificationDropdown.jsx` — bell icon in navbar, shows list of notifications with mark-as-read
- `notificationService.js` — fetches and marks notifications

---

## Feature 8: WebSocket Real-time Updates

### What it does
Provides real-time push updates to patients and practitioners for session changes, without requiring page reload.

### How it works

**Backend:**
- `WebSocketController` handles STOMP `/app/` message mappings
- `SimpMessagingTemplate` pushes to user-specific queues

| STOMP Endpoint | Action |
|---|---|
| `/app/session/subscribe` | Subscribe to session updates for a userId |
| `/app/notifications/subscribe` | Subscribe to notification updates |
| `/app/orders/subscribe` | Subscribe to order updates |
| `/app/availability/subscribe` | Subscribe to availability updates |
| `/app/ping` → `/topic/pong` | Heartbeat keep-alive |

**Frontend:**
- `websocketService.js` — manages STOMP client connection lifecycle: connect, subscribe, disconnect, reconnect on drop

---

## Feature 9: Email Notifications

### What it does
Sends transactional emails to users and practitioners for booking confirmation, cancellation, rescheduling, and reminders.

### How it works

**Backend:**
- `EmailService` — Spring `JavaMailSender` connected to Gmail SMTP
- Called by `TherapySessionService`, `SessionNotificationService`, `SessionReminderScheduler`
- Sends HTML-formatted emails with session details

Email types implemented:
- Booking confirmation (to both user and practitioner)
- Session cancellation
- Session rescheduled
- 30-minute reminder
- 1-hour reminder

---

## Feature 10: Session Reminder Scheduler

### What it does
Automatically monitors upcoming sessions and sends push + email reminders at 30 minutes and 1 hour before the session starts.

### How it works

**Backend:**
- `SessionReminderScheduler` — `@Scheduled(fixedRate = 60000)` runs every 60 seconds
- Queries DB for sessions with `status=BOOKED` and `reminderSent=false` within the next 30-minute window
- Calls `SessionNotificationService.notifySessionReminder30Min()` → saves DB notification + pushes WebSocket
- Sets `reminderSent=true` on the session to prevent duplicates
- A second scheduler handles 1-hour reminders with `oneHourReminderSent` flag

Config via `application.properties`:
```
app.session.reminder.enabled=true
app.session.reminder.interval-minutes=30
app.session.reminder.one-hour-enabled=true
```

---

## Feature 11: Role-Based Access Control

### What it does
Three roles (PATIENT, PRACTITIONER, ADMIN) with different access rights enforced at both HTTP and method level.

### How it works

**Backend:**
- `SecurityConfig` — `@EnableMethodSecurity` + `authorizeHttpRequests()` rules
- Public: auth endpoints, GET practitioners/verified, GET availability
- Authenticated: sessions, notifications
- PRACTITIONER only: profile creation, document upload, availability setup
- ADMIN only: verify practitioner, update order status, manage all requests

**Frontend:**
- `RoleBasedRoute.jsx` — `AdminRoute` and `PractitionerRoute` wrappers
- Reads `userRole` from localStorage, redirects to `/unauthorized` if wrong role

---

## Feature 12: Admin Dashboard

### What it does
Centralized panel for the admin to manage all platform entities.

### How it works

**Frontend:**
- `AdminDashboard.jsx` — multi-tab dashboard
- Tabs: Users list, Practitioners (verify/reject), Orders management, Practitioner requests overview
- All calls protected by `AdminRoute` wrapper
