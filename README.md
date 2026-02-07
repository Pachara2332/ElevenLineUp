# Premier League Lineup Builder

> A production-ready lineup builder for Premier League Big Six teams with drag & drop interface

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Data Design](#-data-design)
- [UI/UX Structure](#-uiux-structure)
- [API Endpoints](#-api-endpoints)
- [Features](#-features)
- [Roadmap](#-roadmap)
- [Tech Stack](#-tech-stack)
- [Design Decisions](#-design-decisions)

---

## 🎯 Overview

**Premier League Lineup Builder** is a tactical lineup management system that allows users to:

- Select from Big Six Premier League teams
- Build custom lineups using drag & drop
- Manage starting XI and bench players
- Save and share lineups
- Switch between different formations

### Key Principles

✅ **UI-First** - No complex ratings or AI scoring  
✅ **Clean Data** - JSON-based player roster  
✅ **Production-Ready** - Scalable and maintainable  
✅ **User-Friendly** - Intuitive drag & drop interface

---

## 🏗️ System Architecture

### Domain Model

```
User
 └── Lineup
       ├── PremierTeam (Big Six - Read-only)
       │     └── players (JSON Array)
       │
       ├── Pitch Slots (11 players)
       └── Bench Slots (7 substitutes)
```

### Data Flow

```
Login → Select Team → Create/Select Lineup → Build Formation → Save
```

---

## 📊 Data Design

### Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  lineups   Lineup[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PremierTeam {
  id        String   @id @default(cuid())
  name      String
  logo      String
  players   Json     // Array of player objects
  createdAt DateTime @default(now())
  lineups   Lineup[]
}

model Lineup {
  id            String       @id @default(cuid())
  name          String
  formation     String
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  premierTeamId String
  premierTeam   PremierTeam  @relation(fields: [premierTeamId], references: [id])
  slots         LineupSlot[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model LineupSlot {
  id          String   @id @default(cuid())
  lineupId    String
  lineup      Lineup   @relation(fields: [lineupId], references: [id], onDelete: Cascade)
  position    String   // GK, LCB, RCM, ST, etc.
  x           Float    // Position on pitch (0-1)
  y           Float    // Position on pitch (0-1)
  playerId    String?  // Reference to player in JSON
  playerName  String?
  playerImage String?
  
  @@unique([lineupId, position])
}
```

### Player JSON Structure

```json
{
  "id": "salah",
  "name": "Mohamed Salah",
  "number": 11,
  "primaryPosition": "RW",
  "secondaryPositions": ["ST"],
  "imageKey": "players/liverpool/salah.png"
}
```

### Big Six Teams (Master Data)

- Manchester City
- Arsenal
- Liverpool
- Manchester United
- Chelsea
- Tottenham Hotspur

---

## 🎨 UI/UX Structure

### Page Flow

```
/login
  ↓
/register
  ↓
/select-team
  ↓
/lineups (List of user's lineups)
  ↓
/lineups/:id (Lineup Builder)
```

### Lineup Builder Layout

```
┌─────────────────────────────────────────────────────────┐
│                    Player List (Sidebar)                 │
│  • Search by name                                        │
│  • Filter by position                                    │
│  • Draggable player cards                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Football Pitch                        │
│                                                          │
│                         GK                               │
│                                                          │
│              LB    LCB    RCB    RB                      │
│                                                          │
│                  LCM    CM    RCM                        │
│                                                          │
│              LW          ST         RW                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Bench (7 substitutes)                 │
│   Sub1  |  Sub2  |  Sub3  |  Sub4  |  Sub5  |  Sub6  | 7│
└─────────────────────────────────────────────────────────┘
```

### Key Components

| Component           | Description                          |
|---------------------|--------------------------------------|
| `AuthProvider`      | Global authentication context        |
| `ProtectedRoute`    | Route guard for authenticated users  |
| `TeamSelectPage`    | Choose from Big Six teams            |
| `LineupListPage`    | View all saved lineups               |
| `LineupBuilder`     | Main formation builder               |
| `FormationSelector` | Switch between formations            |
| `Pitch`             | Football field with slot positions   |
| `PitchSlot`         | Drop zone for players                |
| `PlayerSidebar`     | Searchable player list               |
| `PlayerCard`        | Draggable player element             |
| `BenchPanel`        | Substitute management                |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | `/api/auth/register`  | Create new user       |
| POST   | `/api/auth/login`     | Login user            |
| POST   | `/api/auth/logout`    | Logout user           |
| GET    | `/api/auth/me`        | Get current user      |

### Master Data

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/premier-teams`      | List all Big Six teams   |
| GET    | `/api/premier-teams/:id`  | Get team with players    |
| GET    | `/api/formations`         | List available formations|

### Lineup Management

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/lineups`        | Create new lineup          |
| GET    | `/api/lineups`        | Get user's lineups         |
| GET    | `/api/lineups/:id`    | Get specific lineup        |
| PUT    | `/api/lineups/:id`    | Update lineup              |
| DELETE | `/api/lineups/:id`    | Delete lineup              |

### Slot Management

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| PUT    | `/api/lineups/:id/slots`    | Update all slots (full state)  |

### Assets

| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| GET    | `/api/images/:key`      | Serve player/team images     |

---

## ✨ Features

### V1 - Core Features

- [x] User authentication (JWT + bcrypt)
- [x] Big Six team selection
- [x] Lineup CRUD operations
- [x] Drag & drop pitch interface
- [x] Formation presets (4-3-3, 4-2-3-1, 3-5-2)
- [x] Save lineup functionality

### V1.5 - UX Enhancement

- [ ] Bench/substitute system
- [ ] Player swap animation
- [ ] Search & filter players
- [ ] Real-time formation switching
- [ ] Validation feedback

### V2 - Advanced Features

- [ ] Share lineup (public link)
- [ ] Duplicate lineup
- [ ] Add more leagues
- [ ] Mobile responsive design
- [ ] Light AI suggestions (optional)
- [ ] Export as image

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: react-dnd / dnd-kit
- **State**: React Context / Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5.10.2
- **Auth**: JWT + HttpOnly Cookies
- **Password**: bcrypt

### Infrastructure
- **Storage**: Backend file storage (local/S3/Supabase)
- **Deployment**: Vercel / Railway
- **Database**: Neon PostgreSQL

---

## 🧠 Design Decisions

### Why Players as JSON?

**Decision**: Store players in JSON field instead of separate table

**Reasons**:
- Players are read-only master data
- Fixed roster per team (no user modifications)
- Reduces database joins
- Better performance for drag & drop UI
- Simpler seed data management

**Trade-off**: Less normalized but more practical for this use case

---

### Why Separate LineupSlot Table?

**Decision**: Create dedicated table for pitch/bench slots

**Reasons**:
- Unified abstraction for pitch and bench
- Easy swap/animation logic
- Clean validation rules
- Scalable for future features
- Clear slot positioning (x, y coordinates)

**Alternative Considered**: Inline JSON slots in Lineup table  
**Why Rejected**: Harder to query, validate, and update individual slots

---

### Why Separate Image Management?

**Decision**: Store images in backend storage with metadata table

**Reasons**:
- Decouple storage provider (local → S3 → CDN)
- Enable caching and CDN integration
- Better security and access control
- Production-grade approach
- Easy migration between storage solutions

**Alternative Considered**: Store paths directly in JSON  
**Why Rejected**: Hardcoded paths, no flexibility, harder to manage at scale

---

### Why Custom Auth Instead of NextAuth?

**Decision**: Implement JWT + HttpOnly Cookie authentication

**Reasons**:
- Full control over auth flow
- Simpler for MVP scope
- No external dependencies
- Educational value (demonstrates auth implementation)
- Easy to migrate to NextAuth/Clerk later

**Trade-off**: More code to maintain but better learning experience

---

## 📅 Roadmap

### Sprint 1 - Core (2 weeks)
- Set up Next.js + Prisma
- Implement authentication
- Seed Big Six teams data
- Build lineup CRUD
- Create drag & drop pitch
- Basic save functionality

**Deliverable**: Working prototype for portfolio

---

### Sprint 2 - UX Polish (2 weeks)
- Implement bench system
- Add swap animations
- Search and filter players
- Formation switching
- Validation messages
- Responsive design (desktop)

**Deliverable**: Production-quality product

---

### Sprint 3 - Extension (2 weeks)
- Public lineup sharing
- Lineup duplication
- Add more leagues/teams
- Mobile optimization
- Optional AI suggestions
- Export as image/PDF

**Deliverable**: SaaS-ready platform

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

```bash
# Clone repository
git clone <repo-url>
cd lineup-builder

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run Prisma migrations
npx prisma db push
npx prisma generate

# Seed database
npm run seed

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## 📝 Validation Rules

### System Validation
- ✅ Each player can only be in one location (pitch or bench)
- ✅ Exactly 1 goalkeeper on pitch
- ✅ Position slots must match player primary position
- ✅ Player ID must exist in team's JSON roster
- ✅ User can only edit their own lineups
- ✅ Maximum 7 substitutes on bench

### Drag & Drop Rules
- ✅ Sidebar → Pitch (adds player)
- ✅ Pitch → Bench (removes from pitch)
- ✅ Bench → Pitch (adds to pitch, removes from bench)
- ✅ Pitch → Pitch (swap positions)
- ✅ Invalid drop → snap back animation

---

## 🎤 Interview Talking Points

### "Why not store players in a separate table?"

> "Players are master data that never change per session. They're read-only roster information, similar to how a sports API would return team data. Using JSON reduces unnecessary joins and makes the UI faster. For this use case, it's the right trade-off between normalization and performance."

### "How would you scale this?"

> "The architecture is designed for extension: separate image storage for CDN integration, formation presets as data for easy expansion, slot abstraction that works for any formation, and clean API boundaries. To scale, we'd add caching, implement CDN for images, and potentially move to microservices for user-generated content vs. master data."

### "What about real-time collaboration?"

> "The slot-based architecture makes this straightforward. We'd add WebSocket connections, implement optimistic updates, and use conflict resolution for simultaneous edits. The state is already centralized in the database, so adding real-time sync is a natural extension."

---

## 📄 License

MIT License - Feel free to use for portfolio projects

---

## 🤝 Contributing

This is a portfolio/educational project. Feel free to fork and customize for your own use!

---

**Built with ❤️ for learning and demonstration purposes**