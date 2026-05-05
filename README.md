# ElevenLineUp

แพลตฟอร์มฟุตบอลแบบ **Community + Lineup Builder + Fixtures/Standings + Mini Games**  
เอกสารนี้เขียนสำหรับการคุยงานเชิงธุรกิจ (BA style) เพื่อให้ทีม Dev, Product และลูกค้าเห็นภาพเดียวกัน

---

## 1) โปรเจกต์นี้ทำอะไร

`ElevenLineUp` คือเว็บแอปสำหรับแฟนฟุตบอลที่รวม 4 ส่วนหลักไว้ในระบบเดียว:

- **Lineup Builder**: จัดตัวผู้เล่นด้วย Drag & Drop และบันทึกแผนทีม
- **Match Center**: ดูตารางคะแนน (Standings), โปรแกรมแข่ง (Fixtures), และรายละเอียดแมตช์
- **Community**: โพสต์, คอมเมนต์, Follow, Poll, Trending
- **Mini Games**: เกมตอบคำถามฟุตบอลและเกมทายผู้เล่น

มุมมองธุรกิจ:
- เพิ่ม **Engagement** ผ่านการกลับมาใช้งานบ่อย (dashboard + mini game)
- เพิ่ม **Retention** ผ่านระบบโปรไฟล์, สถิติผู้ใช้, และ community interaction
- เปิดทางต่อยอดสู่ **Monetization** เช่น Premium Feature, Sponsored Challenge, หรือ In-app Competition

---

## 2) กลุ่มผู้ใช้งาน (Target Users)

- แฟนฟุตบอลที่ชอบจัดทีมและแชร์ความเห็น
- ผู้ใช้งานที่ต้องการดูตารางแข่ง/คะแนนแบบสั้นและเร็ว
- กลุ่มที่ชอบเกมทายผู้เล่นและ Challenge รายวัน

---

## 3) ภาพรวมการทำงานของระบบ (Business Flow)

1. ผู้ใช้สมัครสมาชิก / Login  
2. เข้า Dashboard เพื่อดู Standings + Fixtures + สถิติตัวเอง  
3. สร้าง/แก้ไข Lineup จากทีมที่เลือก  
4. มีส่วนร่วมใน Community (โพสต์, คอมเมนต์, โหวต Poll)  
5. เล่น Mini Games เพื่อเก็บสถิติการเล่น

---

## 4) โมดูลหลัก

### 4.1 Dashboard
- แสดงภาพรวมผู้ใช้ (XP, Win Rate, จำนวน Lineup)
- แสดง Standings ตามลีกที่เลือก
- แสดง Fixtures ตามลีก และเปิดดู Match Detail Modal ได้

### 4.2 Lineup Builder
- รองรับการลากผู้เล่นลงตำแหน่งในสนาม
- มีการตรวจความเหมาะสมของตำแหน่ง (Position Compatibility)
- บันทึกชุดผู้เล่นเป็น Lineup และแก้ไขได้ภายหลัง

### 4.3 Community
- Feed โพสต์แบบโซเชียล
- Like / Comment / Follow
- Poll และ Suggested Team

### 4.4 Public Profile
- หน้าโปรไฟล์สาธารณะ `/u/[username]`
- มี UI แบบการ์ดและ Animation ด้วย Three.js

### 4.5 Mini Games
- Quiz Hub / Guessing Games / TicTacToe
- บางเกมพร้อมใช้งานจริง บางเกมยังเป็น mock data (ดูหัวข้อสถานะ)

---

## 5) Data Source สำคัญ (โดยเฉพาะ “จัดทีมนักเตะ”)

### 5.1 แหล่งข้อมูลสำหรับ “เลือกทีม” และ “ผู้เล่น”

### ทีม (Team Search)
- Endpoint ภายใน: `/api/teams/search`
- Endpoint ภายนอกที่เรียกต่อ: `${EXTERNAL_API_URL}/api/teams/search`
- รองรับการค้นหาทีมจากหลายลีกหลัก (เช่น GB1, ES1, IT1, L1, FR1)

### ผู้เล่นในทีม (Players by Team)
- Endpoint ภายใน: `/api/teams/[teamId]/players`
- Endpoint ภายนอกที่เรียกต่อ: `${EXTERNAL_API_URL}/api/teams/{teamId}/players`
- มี filter เช่น `position`, `search`, `nationality`, `foot`, `season`
- ระบบจะแปลงข้อมูลผู้เล่นเป็น format กลางเพื่อใช้กับ Lineup Builder

> สรุปเชิง BA: ข้อมูลจัดทีม “ไม่ได้ hardcode ในหน้า UI” แต่ดึงจาก External Football Data Service ผ่าน API layer ของระบบเรา เพื่อควบคุม format และกติกาให้คงที่

### 5.2 ข้อมูลตารางคะแนน (Standings)
- Endpoint ภายใน: `/api/standings?league=PL`
- Source หลัก: `football-data.org` (`/v4/competitions/{league}/standings`)
- ถ้า API quota หมด (`429`) หรือไม่พบลีก จะ fallback เป็น empty payload เพื่อไม่ให้หน้า Dashboard พัง

### 5.3 ข้อมูลโปรแกรมแข่ง (Fixtures)
- Endpoint ภายใน: `/api/fixtures?leagueId=PL`
- Source หลัก: `football-data.org` (`/v4/competitions/{leagueId}/matches?status=SCHEDULED`)
- ถ้าเรียก external ไม่สำเร็จ จะ fallback ไปอ่านจากฐานข้อมูล `Fixture` ใน PostgreSQL

### 5.4 ข้อมูลที่เก็บในระบบเราเอง (PostgreSQL + Prisma)
- User / Auth / Refresh Token
- Lineup / LineupSlot
- Community Data (Post, Comment, Like, Follow, Poll)
- MatchPrediction
- User Stats และ Mini-game attempts

---

## 6) โครงสร้างเทคนิค (Technical Stack)

- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS
- **Animation/UI**: Framer Motion, Three.js (`@react-three/fiber`, `@react-three/drei`)
- **State/Data**: Zustand, TanStack Query
- **Backend**: Next.js Route Handlers + Custom Node Server (`server.js`)
- **Realtime**: Socket.IO
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + HttpOnly Cookie

---

## 7) วิธีติดตั้งและรันระบบ (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm

### Setup

```bash
git clone <your-repo-url>
cd ElevenLineUp
npm install
```

สร้างไฟล์ `.env` แล้วใส่ค่าอย่างน้อย:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>"
JWT_SECRET="your-strong-secret"
NEXT_PUBLIC_API_URL="http://localhost:3000"
FOOTBALL_API_KEY="your-football-data-api-key"
EXTERNAL_API_URL="http://localhost:8000"
```

เตรียมฐานข้อมูล:

```bash
npx prisma generate
npx prisma db push
npm run dev:seed
```

รันโปรเจกต์:

```bash
npm run dev
```

ระบบจะเริ่มที่ `http://localhost:3000`

---

## 8) API หลักที่ใช้บ่อย

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Lineup
- `GET /api/lineups`
- `POST /api/lineups`
- `GET /api/lineups/[id]`
- `PUT /api/lineups/[id]`
- `DELETE /api/lineups/[id]`

### Match Data
- `GET /api/standings?league=PL`
- `GET /api/fixtures?leagueId=PL`
- `GET /api/predictions`
- `POST /api/predictions`

### Team/Player Data
- `GET /api/teams/search`
- `GET /api/teams/[teamId]/players`

---

## 9) สถานะฟีเจอร์ปัจจุบัน (Project Status)

### พร้อมใช้งาน (Production-ready ในระดับฟีเจอร์)
- ระบบ Login/Register + Session
- Dashboard (Standings + Fixtures)
- Match detail modal
- Lineup Builder พร้อม Drag & Drop และกติกาตำแหน่ง
- Community หลัก (โพสต์/คอมเมนต์/ไลก์/ติดตาม)
- Public Profile (พร้อม Three.js visual effect)

### กำลังพัฒนา (In Progress)
- ปรับคุณภาพข้อมูล Mini Games ให้เป็น dynamic มากขึ้น
- เพิ่มความสมบูรณ์ของ realtime interaction ในบาง flow
- ปรับ UX บางจุดของเกมให้สื่อสารผลลัพธ์ชัดเจนขึ้น
- ปรับปรุง test coverage และ hardening ฝั่ง API

### ยังเป็น Mock Data บางส่วน
- `GET /api/minigames/tictactoe`
- `GET/POST /api/minigames/who-are-ya`
- `GET/POST /api/minigames/missing-xi`

> หมายเหตุ BA: เกมที่ยังเป็น mock ใช้เพื่อ validate UX flow และเก็บ feedback ก่อนเชื่อมข้อมูลจริงเต็มรูปแบบ

---

## 10) ข้อควรทราบสำหรับฝั่งธุรกิจ

- หากไม่มี `FOOTBALL_API_KEY` ระบบยังเปิดได้ แต่ Standings/Fixtures จะมี fallback mode (ข้อมูลอาจไม่ครบ)
- คุณภาพข้อมูลผู้เล่นขึ้นกับ `EXTERNAL_API_URL` ที่เชื่อมต่อ
- โมดูล Community + Lineup เหมาะกับการต่อยอดแคมเปญระยะยาว (เช่น Ranking, Contest, Rewards)

---

## 11) โครงสร้างหน้าใช้งานหลัก (User-facing Routes)

- `/login`, `/register`
- `/dashboard`
- `/dashboard/create`
- `/lineups`, `/lineups/[teamId]`, `/lineup/[slug]`
- `/community`
- `/fixtures`
- `/minigames/*`
- `/u/[username]`
- `/admin/*` (สำหรับหลังบ้าน)

---

## 12) License

โปรเจกต์นี้ใช้เพื่อการพัฒนาและต่อยอดผลิตภัณฑ์ สามารถกำหนด License ให้ตรงนโยบายองค์กรได้ในขั้น deploy จริง