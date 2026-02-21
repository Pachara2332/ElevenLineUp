# Eleven Lineup - Project Overview ⚽🔥

**Eleven Lineup** is a full-stack, responsive web application designed for Premier League fans. It allows users to build and visualize their "dream team" lineups, engage with a football community, and play mini-games, all powered by a robust backend and real-time database.

## 🚀 Key Features

### 1. Interactive Lineup Builder
- **Dynamic Pitch rendering:** Visual representation of a football pitch.
- **Formation Selection:** Choose from standard formations (4-4-2, 4-3-3, 3-5-2, etc.).
- **Drag-and-Drop / Click-to-Add:** Intuitive UI to assign real Premier League players to specific positions.
- **Budget constraints (Optional Feature):** Manage a virtual budget to select players based on their in-game price.
- **Save & Share:** Save custom lineups to the user profile and share them with the community.

### 2. Comprehensive Community & Social Features
- **Post & Discuss:** Share lineups, thoughts, and opinions with other users on the Community feed.
- **Interactive Engagement:** Like posts and comment on other users' content.
- **User Profiles:** Track user activity, saved lineups, and participation statistics (Posts/Comments counts).

### 3. Premier League Data Hub
- **Live-like Fixtures:** View upcoming and past matches with scores and statuses.
- **League Standings:** Up-to-date league table showing points, goal difference, wins, draws, and losses.
- **Player Database:** Scraped and seeded real-world Premier League player data sorted by team, position, and price.

### 4. Advanced Admin Control Panel (Back-Office)
- **Role-Based Access Control (RBAC):** Strict separation between regular `USER` and `ADMIN` roles using JWTs and Middleware edge protection.
- **Data Management:** Inline editing capabilities for `LeagueStandings` and `Fixtures` to update match results and tables instantly without deploying.
- **User Management:** Promote/demote users to Admins or ban/delete disruptive accounts.
- **Content Moderation (Clean Community):** Admins can monitor the feed and delete inappropriate posts (including cascading deletion of associated likes/comments).
- **Internationalization (i18n):** The Admin Dashboard supports both English and Thai via a cohesive Context-based Language Switcher.

### 5. Secure Authentication System
- **JWT-based Auth:** Stateless authentication using Access and Refresh tokens stored in HTTP-only cookies for maximum security against XSS.
- **Password Security:** Hashes passwords using `bcryptjs`.
- **User Experience (UX):** Fluid login/register forms featuring glassmorphism design, loading states, error handling, and show/hide password toggles.

---

## 🛠️ Technical Stack & Architecture

### Frontend (Client-Side)
- **Framework:** **Next.js 15 (App Router)** - Leveraging Server Components (RSC) for initial fast loads and SEO, and Client Components for interactivity.
- **Styling:** **Tailwind CSS** - Utilizing a custom theme (Emerald/Dark) with modern "Glassmorphism" UI patterns (backdrop-blur, translucent panels, micro-animations).
- **Icons:** Heroicons.
- **State Management:** React Hooks (`useState`, `useEffect`, Custom Context for globally managed states like `LanguageContext`).

### Backend (Server-Side)
- **API Runtime:** Next.js Route Handlers (`app/api/*`) executing in a Node.js environment.
- **Database:** **PostgreSQL** hosted on **Neon DB** (Serverless Postgres).
- **ORM:** **Prisma** - Provides type-safe database access, schema migrations, and relational modeling (e.g., cascading deletes, 1-to-N relationships between Users and Posts).
- **Security & Validation:** `Zod` for strict request payload validation. Rate limiting and custom `ApiHandler` wrappers for consistent error formatting and HTTP status codes.
- **Edge Middleware:** Next.js `middleware.ts` intercepts requests at the Edge to decode JWT payloads and forcefully redirect unauthorized users away from protected or Admin routes before the page even begins rendering.

### Core Logic & Patterns
- **Service Layer Pattern:** Authentication logic is extracted into specific classes (e.g., `AuthService`) to decouple business logic from API route controllers.
- **Global Error Handling:** Centralized error catching to prevent server crashes and return localized, friendly error messages to the client.

## 📈 High-Level Database Schema (Prisma)
- **`User`**: Core account details, encrypted passwords, roles (`USER`/`ADMIN`), and relations to activity.
- **`Post` / `Comment` / `Like`**: Relational tables driving the community feed.
- **`Lineup` / `LineupPlayer`**: Maps a user's saved squad formation to specific `Player` entities.
- **`Team` / `Player`**: Static-ish master data seeded into the DB.
- **`Fixture` / `LeagueStanding`**: Dynamic league data managed by Admins.

---

## 🎯 What makes this project stand out?
1. **Full-Stack Competency:** Demonstrates the ability to handle everything from database schema design and secure API creation to responsive UI/UX development.
2. **Security First:** Implements industry standards like HttpOnly cookies, JWT rotation concepts, and Edge middleware RBAC.
3. **Admin Tooling:** Shows an understanding of business needs by building a bespoke Back-Office panel for data entry and moderation, rather than just a front-end app.
4. **Modern UI/UX:** Proves a strong eye for design by moving beyond generic bootstrap templates to create a highly polished, heavily themed, and animated user interface suitable for a modern gaming/sports audience.
