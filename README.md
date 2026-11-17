# Findingmate

## Wanderlust Meet — Global Travel Meetup Marketplace

> "Meet people. Explore places. Share experiences."

**Wanderlust Meet** is a global travel networking and meetup marketplace connecting international tourists with local residents, solo travelers with companions, and visitors in the same destination. 

This platform is strictly **not a dating application**, **not a travel booking application**, and **not a generic social media feed**. It is a purpose-built marketplace for cultural discoveries, photography walks, food crawls, and group travel meetups.

---

## 🎨 Branding & Design System

The application features a minimalist editorial design inspired by high-end travel platforms and Airbnb:

- **Primary Forest Green**: `#174C3B`
- **Warm Ivory Background**: `#FAF9F6`
- **Soft Sage**: `#E5EEE8`
- **Warm Orange Accent**: `#E89A55`
- **Primary Text**: `#202522`
- **Secondary Muted Text**: `#777F79`
- **Borders**: `#E8EAE6`
- **Typography**: Playfair Display (editorial headings) & Plus Jakarta Sans (clean UI body)

---

## 🚀 Key Features

1. **Authentication & Multi-Step Onboarding**
   - Secure JWT & bcrypt password hashing
   - Age 18+ verification requirement
   - 5-step onboarding: Role selection (Traveler / Local Host / Both), Profile photo, Travel interests, Connection preferences, and persona preview.

2. **Explore & Discovery Feed**
   - Search by name, city, country, or keyword
   - Tabs: For You, Available Now (Open to Meet), Locals, Solo Travelers, All Members
   - Filter by destination, interest tags, languages, and gender preferences
   - Verified member badges and dynamic age privacy shields

3. **Meetup Marketplace**
   - Create, browse, search, and manage small group meetups (2–20 participants)
   - Categories: Food, Sightseeing, Photography, Coffee, Cultural Experiences, Walking Tours, Adventure, Nightlife, Museums, Shopping, Sports
   - Join request workflow with host approval, rejection, and capacity management
   - Participant reviews with 1–5 star ratings and written feedback

4. **Dedicated Interactive Map**
   - Geospatial city meetup discovery with interactive visual canvas
   - Filter by cities: Tokyo, Paris, New Delhi, Barcelona, New York, London
   - Mapview and listview toggle with meetup preview cards
   - Mapbox GL ready (set `VITE_MAPBOX_TOKEN`)

5. **Trip Itinerary Management**
   - Publish upcoming journeys with multi-city routes (e.g. London → Delhi → Agra → Jaipur)
   - Companion preferences, arrival/departure times, and travel dates

6. **"Open to Meet" Availability System**
   - Quick one-click activation broadcast in your current city
   - Automatic 8-hour expiration
   - Privacy guarantee: Live GPS coordinates are never publicly exposed

7. **Real-Time Messaging & Sockets**
   - Direct chats and meetup group conversations powered by Socket.IO
   - Message timestamps, unread counts, and embedded meetup cards

8. **Trust & Safety Controls**
   - Report profiles, meetups, or reviews with categorized policy violations
   - Instant user blocking and content shielding
   - Strict public venue requirements for all gatherings

9. **Dedicated Admin Console**
   - Protected role-based administration dashboard (`role: 'admin'`)
   - Platform metrics: Registered users, active users, total trips, meetups, pending reports
   - Moderation tools: Suspend account, ban user, verify ID status, cancel or delete meetups, resolve safety tickets

---

## 👥 Seed & Demo Accounts

The project includes pre-populated development seed data:

| Role | Email | Details |
|------|-------|---------|
| **Chief Safety Admin** | `admin@wanderlustmeet.com` | Access to `/admin` dashboard |
| **Traveler (Paris/Tokyo)** | `elena@example.com` | Open to Meet active in Tokyo |
| **Local Host (Tokyo)** | `kenji@example.com` | Host of Shinjuku Izakaya Crawl |
| **Local Host (New Delhi)** | `aarav@example.com` | Host of Old Delhi Heritage Walk |
| **Solo Traveler (Barcelona)**| `sophia@example.com` | Traveling across Asia |

Seeded accounts share the locally configured `SEED_DEMO_PASSWORD`. Set a unique value in `backend/.env` before running the seed command; there are no default account passwords.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide React, Axios, Socket.IO Client.
- **Backend**: Node.js, Express, TypeScript, Mongoose, MongoDB, Socket.IO, Helmet, CORS, Morgan, Multer.
- **Database Fallback**: In-Memory MongoDB Server (`mongodb-memory-server`) automatically runs out-of-the-box if no external MongoDB URI is provided, ensuring zero manual database setup is required.

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Copy `backend/.env.example` to `backend/.env` and set a unique `JWT_SECRET` (at least 32 characters). Set `SEED_DEMO_PASSWORD` (at least 16 characters) if you plan to seed demo accounts.

### 2. Start the Backend API
\`\`\`bash
cd global-travel-meetup/backend
npm install
npm run seed     # (Optional: seeds sample users, trips, and meetups)
npm run dev      # Runs API server on http://localhost:5000
\`\`\`

### 3. Start the Frontend Application
\`\`\`bash
cd global-travel-meetup/frontend
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
\`\`\`

Open your browser at **`http://localhost:5173`**.

---

## ☁️ Deployment Guide

### Frontend on Vercel
1. Push this repository to GitHub.
2. In Vercel, import the repository and select `frontend` as the **Root Directory**.
3. Framework Preset: **Vite**.
4. Add Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://your-api.onrender.com/api`)
   - `VITE_SOCKET_URL`: Your backend root URL (e.g. `https://your-api.onrender.com`)
   - `VITE_MAPBOX_TOKEN`: *(Optional)* Your Mapbox public key.
5. Deploy. The included `vercel.json` ensures client-side routing works seamlessly.

### Backend on Render
1. In Render, select **New Web Service** and link the repository.
2. Root Directory: `backend`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: A unique random string of at least 32 characters
   - `FRONTEND_URL`: Your Vercel frontend URL
   - Do not configure `SEED_DEMO_PASSWORD` in production; automatic demo seeding is disabled there.
6. Click **Create Web Service**.

### MongoDB Atlas Setup
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Clusters > Connect > Drivers**, copy the connection string and paste into `MONGODB_URI` on Render.

---

## 🔒 Security Standards

- Personal phone numbers, email addresses, and home addresses are never exposed.
- Live GPS coordinates are strictly abstracted to neighborhood/city levels.
- All meetups require designated public landmarks or establishments.
- Passwords hashed with salted bcrypt rounds.
- JWT authentication requires a configured secret; there is no hardcoded fallback.
