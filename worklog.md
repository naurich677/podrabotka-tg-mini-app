# Worklog

## Task 2: Prisma Schema & Backend API Routes

**Date**: 2024-01-01
**Agent**: backend-agent
**Status**: ✅ Completed

### Summary
Built the complete Prisma schema and all backend API routes for the Telegram Mini App for finding part-time work (подработка) in Kazakhstan.

### Files Created

#### Prisma Schema
- `prisma/schema.prisma` — Complete database schema with 8 models: User, WorkerProfile, EmployerProfile, Job, Application, Review, Notification, PhoneVerification

#### Library Files
- `src/lib/telegram.ts` — Telegram initData validation with HMAC-SHA256, dev mode fallback
- `src/lib/auth.ts` — Session user helper, extracts initData from Authorization header or body, find-or-create user

#### Auth API Routes
- `src/app/api/auth/telegram/init/route.ts` — POST: validate initData, create/update user, return session token
- `src/app/api/auth/me/route.ts` — GET: return current user from session

#### User Phone API Routes
- `src/app/api/user/request-phone/route.ts` — POST: create phone verification record
- `src/app/api/user/phone/confirm/route.ts` — POST: save phone from Mini App requestContact
- `src/app/api/user/phone/bot-contact/route.ts` — POST: webhook for bot-received contact

#### Jobs API Routes
- `src/app/api/jobs/route.ts` — GET: list jobs with filters + POST: create job (employer only)
- `src/app/api/jobs/[id]/route.ts` — GET: single job + PATCH: update job (owner only)
- `src/app/api/jobs/[id]/publish/route.ts` — POST: publish draft job
- `src/app/api/jobs/[id]/close/route.ts` — POST: cancel job
- `src/app/api/jobs/[id]/apply/route.ts` — POST: worker applies to job

#### Applications API Routes
- `src/app/api/applications/my/route.ts` — GET: list current user's applications
- `src/app/api/applications/[id]/approve/route.ts` — PATCH: approve application
- `src/app/api/applications/[id]/reject/route.ts` — PATCH: reject application
- `src/app/api/applications/[id]/arrived/route.ts` — PATCH: mark worker as arrived
- `src/app/api/applications/[id]/complete/route.ts` — PATCH: mark as completed
- `src/app/api/applications/[id]/paid/route.ts` — PATCH: mark as paid

#### Profile API Routes
- `src/app/api/profile/route.ts` — GET: current user with profiles + PATCH: update user fields
- `src/app/api/profile/worker/route.ts` — PATCH: update worker profile
- `src/app/api/profile/employer/route.ts` — PATCH: update employer profile

#### Notifications API Route
- `src/app/api/notifications/route.ts` — GET: list notifications with unread count

#### Environment
- `.env.local` — DATABASE_URL and TELEGRAM_BOT_TOKEN placeholder

### Key Design Decisions
1. **SQLite-compatible schema**: Used `String` for JSON fields (categories, skills) with app-side JSON.parse/stringify; used `Int` for telegramId instead of bigint
2. **Dev mode auth**: When TELEGRAM_BOT_TOKEN is not set, initData validation is skipped with a warning
3. **Notification creation**: Notifications are automatically created on application approve/reject/complete/paid events
4. **Job status flow**: draft → active → full → in_progress → completed (or cancelled at any point)
5. **Application status flow**: applied → approved → arrived → completed → paid
6. **Auto profile creation**: Worker/Employer profiles are auto-created when user switches role
7. **Consistent API response format**: `{ success: true, data: ... }` or `{ success: false, error: "message" }`

### Verification
- `bun run db:push` — Schema applied successfully
- `bun run lint` — No errors
- Dev server running normally on port 3000

---

## Task 5: Frontend Core — Complete Telegram Mini App UI

**Date**: 2024-01-02
**Agent**: frontend-agent
**Status**: ✅ Completed

### Summary
Built the complete frontend for the Telegram Mini App — a single-page application with screen-based navigation using Zustand for state management. Includes i18n (RU/KZ), Telegram WebApp integration, all worker and employer screens, and a mobile-first design using Tailwind CSS and shadcn/ui.

### Architecture
- **Single Page App**: All screens rendered within `src/app/page.tsx` via client-side Zustand state (`currentScreen`)
- **Screen Navigation**: Zustand store manages `currentScreen` and `screenHistory` for back navigation
- **i18n**: Custom translation system with dot-path access (`t(lang, 'feed.title')`)
- **API Client**: Centralized fetch wrapper with `Authorization: tma <initData>` header
- **Telegram Integration**: `useTelegram` hook initializes the WebApp SDK, reads theme, manages BackButton

### Files Created

#### Library / Core
- `src/lib/i18n.ts` — i18n system with full RU/KZ translations (200+ keys), dot-path helper `t()`, category/district key arrays
- `src/lib/store.ts` — Zustand store: Screen navigation (20 screens), User state, Language, Onboarding, Favorites, Filters, Loading state
- `src/lib/api.ts` — API client with `setInitData()`, auto-auth headers, methods for auth/phone/jobs/applications/profile/notifications
- `src/lib/telegram-types.ts` — TypeScript interfaces for TelegramWebApp SDK (WebApp, MainButton, BackButton, InitData, Contact, ThemeParams, etc.)
- `src/hooks/use-telegram.ts` — React hook: initializes TG WebApp, reads `initData`, `colorScheme`, manages ready state; dev mode fallback

#### Onboarding Screens
- `src/components/screens/SplashScreen.tsx` — Animated splash with Briefcase icon, auto-auth via `api.auth.init()`, navigates to selectLanguage or feed
- `src/components/screens/SelectLanguageScreen.tsx` — Language selection (🇷🇺/🇰🇿) cards, updates store language
- `src/components/screens/SelectRoleScreen.tsx` — Role selection: Worker (HardHat) / Employer (Building2) cards
- `src/components/screens/PhoneVerificationScreen.tsx` — Phone verification: TG requestContact, manual input fallback, skip option

#### Worker Screens
- `src/components/screens/WorkerFeedScreen.tsx` — Main job feed: search bar, filter pills (Сегодня/Завтра/Ежедневная/Рядом/Срочно), job cards with category icons/payment/district/spots, skeleton loading
- `src/components/screens/WorkerFiltersScreen.tsx` — Full filter screen: category checkboxes, district checkboxes, date picker, payment type radio, salary range inputs
- `src/components/screens/WorkerJobDetailScreen.tsx` — Job detail: back button, title, payment card (large), info grid (address/date/time/spots), badges (experience/documents), description/requirements, sticky apply button (disabled if phone not verified)
- `src/components/screens/WorkerApplicationsScreen.tsx` — My applications list: status badges (color-coded: applied=blue, approved=green, rejected=red, arrived=teal, completed=purple, paid=emerald)
- `src/components/screens/WorkerFavoritesScreen.tsx` — Saved jobs: same card layout as feed, heart toggle, empty state
- `src/components/screens/WorkerHistoryScreen.tsx` — Completed shifts history: total earned stats card, shift list with payment info

#### Employer Screens
- `src/components/screens/EmployerDashboardScreen.tsx` — Dashboard: 3 stat cards (active shifts, total applications, confirmed workers), create shift button, upcoming shifts list
- `src/components/screens/EmployerCreateShiftScreen.tsx` — Create shift form: title, category, description, city/district/address, date, start/end time, payment, payment type/schedule, workers needed, experience/documents switches, publish/draft buttons, field validation
- `src/components/screens/EmployerShiftListScreen.tsx` — Shift list with tabs: Черновики/Активные/Завершенные/Отмененные
- `src/components/screens/EmployerApplicationsScreen.tsx` — Application management: shift info card, applicant cards with status badges and action buttons (approve/reject → mark arrived → mark completed → mark paid)
- `src/components/screens/EmployerAttendanceScreen.tsx` — Attendance tracking: arrived/not arrived toggles, summary (X of Y arrived)
- `src/components/screens/EmployerPaymentTrackingScreen.tsx` — Payment tracking: paid/unpaid status, mark paid buttons, total paid summary

#### Profile & Settings
- `src/components/screens/ProfileScreen.tsx` — Profile view: avatar, name, role badge, phone verification status, worker/employer-specific info, settings (language toggle, switch role, city, logout)
- `src/components/screens/ProfileEditScreen.tsx` — Edit form: common fields + worker-specific (age, about, skills, categories) or employer-specific (company name, business type, BIN/IIN)
- `src/components/screens/NotificationsScreen.tsx` — Notification list: type-based icons, read/unread status, timestamps

#### Layout
- `src/components/layout/BottomNav.tsx` — Bottom navigation: worker (Лента/Отклики/Избранное/Профиль), employer (Смены/Отклики/Создать/Профиль), active tab highlighting, floating create button for employer
- `src/components/layout/AppShell.tsx` — Main shell: screen renderer, Telegram BackButton management, dark mode class, bottom nav visibility logic

#### Updated Files
- `src/app/page.tsx` — Replaced with `<AppShell />` component
- `src/app/layout.tsx` — Updated: Telegram WebApp script, mobile viewport meta, Russian lang, emoji favicon
- `src/app/globals.css` — Added: Telegram theme CSS variables (light + tg-dark), mobile-first base styles, safe area, hide-scrollbar, screen transition animations

### Key Design Decisions
1. **Single-page architecture**: Since user can only see `/` route, all navigation is client-side via Zustand `currentScreen` state
2. **Screen history**: Store maintains `screenHistory` stack for back navigation, integrated with Telegram BackButton
3. **i18n dot-path access**: `t('ru', 'feed.title')` with fallback to Russian if key missing in Kazakh
4. **Telegram theme integration**: CSS variables `--tg-*` for light/dark mode, `tg-dark` class toggled by AppShell
5. **Mobile-first**: max-w-md container, min-h-11 touch targets, bottom nav with safe area, no-scrollbar lists
6. **API client pattern**: `setInitData()` stores TG initData, all requests include `Authorization: tma <initData>` header
7. **Dev mode fallback**: `useTelegram` hook works outside Telegram with warning, manual phone input available
8. **Status color coding**: Consistent badge colors across all screens (applied=blue, approved=green, rejected=red, etc.)

### Verification
- `bun run lint` — No errors (fixed React 19 strict rules: setState in effect → startTransition, Function types → explicit signatures, ref access → useState)
- Dev server compiling successfully on port 3000

---

## Task 4: Telegram Bot Mini-Service

**Date**: 2024-01-03
**Agent**: telegram-bot-agent
**Status**: ✅ Completed

### Summary
Created a standalone Telegram Bot mini-service using grammy framework. The bot handles user onboarding, phone verification, profile lookup, and provides an HTTP notification API for the main Next.js app to send messages to Telegram users.

### Files Created

- `mini-services/telegram-bot/package.json` — Bun project config with grammy dependency
- `mini-services/telegram-bot/index.ts` — Complete bot service with all handlers and HTTP server

### Bot Features

1. **`/start` command** — Welcome message with inline keyboard:
   - "🔍 Открыть подработки" → opens Mini App (worker view)
   - "💼 Ищу работников" → opens Mini App (employer view, `?role=employer`)
   - "📱 Подтвердить номер" → triggers contact request flow
   - "❓ Помощь" → shows help text

2. **`/app` command** — Opens the Mini App directly via WebApp button

3. **`/profile` command** — Fetches user profile from Next.js API (`/api/profile`), displays:
   - Name, username, role, phone verification status, city
   - Worker-specific info (age, about, categories)
   - Employer-specific info (company name, business type)
   - Inline buttons for editing and refreshing

4. **`/help` command** — Shows available commands and tips

5. **Contact sharing handler** — When user shares phone via `request_contact`:
   - Calls `/api/user/phone/bot-contact` with `{ telegramId, phoneNumber }`
   - Confirms verification or shows error with fallback to Mini App

6. **Callback queries** — Handles `verify_phone`, `help`, `refresh_profile` inline button callbacks

### HTTP Notification API (port 3030)

- **`POST /notify`** — Send message to a single user
  - Body: `{ chatId, message, type? }`
  - Type prefixes: application=📩, approval=✅, rejection=❌, payment=💰, reminder=⏰
  - Returns 503 if bot is not running (no token)

- **`POST /notify/batch`** — Send message to multiple users
  - Body: `{ chatIds: number[], message, type? }`
  - Returns `{ total, succeeded, failed }` counts

- **`GET /health`** — Health check
  - Returns `{ status, bot: "running"|"disabled", port }`

### Key Design Decisions

1. **Graceful token fallback**: If `TELEGRAM_BOT_TOKEN` is not set, bot polling is disabled with a warning, but the HTTP notification server still runs on port 3030
2. **XTransformPort compliance**: All API calls to the Next.js app use `?XTransformPort=3000` for gateway compatibility
3. **Profile auth workaround**: The `/profile` command constructs a minimal initData payload for auth; works in dev mode (validation skipped)
4. **Notification type system**: Type-based emoji prefixes for better UX (application, approval, rejection, payment, reminder)
5. **Batch notifications**: `/notify/batch` endpoint with `Promise.allSettled` for reliable multi-user notifications
6. **Proper field naming**: `phoneNumber` (not `phone`) to match the `/api/user/phone/bot-contact` API contract

### Verification

- `bun install` — grammy@1.42.0 installed successfully
- HTTP server starts and responds on port 3030
- `GET /health` → `{"status":"ok","bot":"disabled","port":3030}`
- `POST /notify` without bot → 503 with descriptive error
- `POST /notify` missing fields → 400 validation error
- `GET /nonexistent` → 404
- Caddyfile already supports `XTransformPort=3030` routing
