# 🎰 Casino

[Русский](README.md)

A full-stack slot machine web app built with **Nuxt 4**, **Vue 3**, **PixiJS** and **PostgreSQL**. Players sign up, top up a virtual balance of gems, spin an animated 3-reel slot machine and track their spin history. The whole stack starts with one command via Docker Compose.

![слоты](docs/images/demo1.png)
![регистрация](docs/images/demo2.png)
![настройки](docs/images/demo3.png)
## ✨ Features

- **Animated slot machine** rendered on a PixiJS canvas: three reels, staggered stops, win highlighting
- **Authoritative server-side game logic**: the outcome is rolled on the server with weighted probabilities, the client only animates the result it receives
- **Atomic bets**: balance check, deduction, payout and spin log happen in a single SQL transaction with a row lock (`SELECT ... FOR UPDATE`), so concurrent requests can't double-spend
- **Authentication**: sign up / log in with username and password, passwords hashed with `scrypt` + per-user salt and verified with `timingSafeEqual`
- **Live balance**: balance updates are pushed to the browser over Server-Sent Events
- **Spin history**: paginated history of all bets and payouts (`limit` / `offset`)
- **Gem store**: top up the balance with preset packs (demo, no real payment)
- **Account settings**: change username, change password, delete account (with typed confirmation)
- **Dockerized**: separate dev and production targets, Postgres initialized automatically from SQL scripts

## 🎲 Game mechanics

Each spin picks a reward tier by weighted random selection:

| Tier | Chance | Multiplier |
| --- | --- | --- |
| Consumer (trash) | 60% | ×0 (reels never match) |
| Rare | 25% | ×1.5 |
| Classified | 10% | ×5 |
| Covert | 4.5% | ×25 |
| Knife / Jackpot | 0.5% | ×100 |

On a winning spin, all three reels stop on the same symbol. On a losing spin the server generates a random combination that is guaranteed **not** to be three of a kind, so the visuals always match the result.

## 🧱 Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Nuxt 4 (Vue 3, Nitro server, file-based routing) |
| Rendering | PixiJS 8 |
| Language | TypeScript |
| Database | PostgreSQL 17 via `pg` (raw SQL, connection pool) |
| Realtime | Server-Sent Events |
| Infrastructure | Docker, Docker Compose, multi-stage Dockerfile |
| Tooling | pnpm, Node.js 24 |

## 🚀 Getting started

### Option 1: Docker (recommended)

Requirements: Docker with Compose.

```bash
git clone https://github.com/nerdinhisprime/casino.git
cd casino

cp .env.example .env     # adjust values if you want

docker compose up --build
```

Open **http://localhost:3000** (or the port set in `VITE_APP_PORT`).

The `postgres` container runs every script from `./db` on its first start, so the tables are created automatically. To reset the database, remove the volume:

```bash
docker compose down -v
```

### Option 2: Local development

Requirements: Node.js 24, pnpm (`corepack enable`), a running PostgreSQL instance.

```bash
pnpm install

psql -U <user> -d <db> -f db/01-users.sql -f db/02-spins.sql

pnpm dev
```

### Production build

```bash
docker build --target runner -t casino .
docker run -p 3000:3000 --env-file .env casino
```

### Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_APP_PORT` | Port the app is exposed on | `3000` |
| `DB_USR` | Postgres user | `Ludoman` |
| `DB_PSWD` | Postgres password | `sixseven` |
| `DB_NAME` | Database name | `CazikDB` |
| `DB_PORT` | Postgres port | `5432` |
| `DB_HOST` | Postgres host (`postgres` inside Compose) | `postgres` |
| `MAX_SPINS` | Max stored spins per user (reserved, see roadmap) | `8` |
| `RESTORE_TIMING` | Minutes to restore one spin (reserved, see roadmap) | `16` |

The values in `.env.example` are development defaults only. Use your own credentials anywhere beyond localhost.

## 🗂 Application structure

```
casino/
├── app/                      # Frontend (Nuxt 4 app directory)
│   ├── pages/                # index, slots, login, signup, settings/{index,history,store}
│   ├── components/           # SlotMachine (PixiJS), AppButton, AppInput, AppDialog, AppDropDown, AppNav
│   ├── composables/          # useUser, useAuth, usePixiApp
│   ├── layouts/              # default layout
│   ├── utils/                # client helpers
│   └── assets/               # styles, fonts, images
├── server/                   # Backend (Nitro)
│   ├── api/                  # REST endpoints (file-based routing)
│   └── utils/                # db pool, password hashing, auth guard
├── db/                       # SQL schema, executed on first Postgres start
│   ├── 01-users.sql
│   └── 02-spins.sql
├── Dockerfile                # multi-stage: deps → dev / build → runner
├── Dockerfile.db             # Postgres 17 (+ pgcli)
└── docker-compose.yml        # app + postgres
```

## 🗄 Database schema

```
users                                   spins
├── id            UUID  PK              ├── id         UUID  PK
├── username      TEXT  UNIQUE          ├── user_id    UUID  FK → users.id
├── password_hash TEXT                  ├── bet        INTEGER
├── balance       INTEGER               ├── reward_id  TEXT
├── spins         INTEGER               ├── win_amount INTEGER
├── is_guest      BOOLEAN               └── created_at TIMESTAMPTZ
├── last_spin_at / last_spin_restore_at
└── created_at / updated_at
```

## 📄 License

[MIT](LICENSE) © 2026 nerdinhisprime
