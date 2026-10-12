<div align="center">

# 🎟️ EventNest

**Discover. Experience. Remember.**  
*The Ultimate Live Experience Hub & Next-Generation Event Ticketing Platform*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.4-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Explore Features](#-key-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Demo Accounts](#-demo-accounts)

---

</div>

## 📖 About EventNest

**EventNest** is a full-featured, modern web application engineered for discovering, hosting, and booking live concerts, music festivals, comedy specials, sports championships, tech summits, and cultural workshops.

Designed with an immersive **event-stage aesthetic**, real-time digital ticket generation with dynamic QR codes, interactive seat mapping, and a dedicated organizer suite with analytics dashboards.

---

## ✨ Key Features

### 🎸 1. Cinematic Hero Arena
- **Live Atmosphere Background**: Concert crowd backdrop with stage lasers, ambient glows, and dark glassmorphic overlays.
- **Smart Command Bar**: Instant keyword discovery combined with dynamic city filtering (*Mumbai, Bengaluru, Delhi, Hyderabad, Goa, Kolkata*).
- **VIP Spotlight Showcase**: Multi-event carousel switcher featuring top headlined events.
- **Real-Time LED Countdown Timer**: Precision live countdown (*Days : Hours : Mins : Secs*) for headlined events.
- **Live Audio Waveform Visualizer**: Synchronized pulsing equalizer bars reflecting stage sound vibes.
- **Social Proof & Urgency Indicators**: Real-time attendee counts and ticket availability progress bars.

### 🔍 2. Event Discovery & Smart Filtering
- **8+ Curated Categories**: Music & Concerts, Standup Comedy, Sports & Fitness, Technology & AI, Theatre & Performing Arts, Workshops, Art & Exhibitions, and Festivals.
- **Multi-Faceted Filter Panel**: Filter by City, Category, Date Range (*Anytime, Upcoming, This Month*), Price Range slider, and Minimum Star Rating.
- **Instant Search (`Ctrl + K` / `Cmd + K`)**: Global modal search with keyboard navigation, recent searches, and instant category jumps.
- **Sorting Modes**: Sort by Popularity, Trending, Price (Low to High / High to Low), and Date.

### 🎫 3. Digital Ticketing & Seat Selection
- **Tiered Ticket Packages**: General Admission, Early Bird, VIP SkyDeck, and Backstage passes.
- **Interactive Seat Map**: Live visual seat picker with real-time price updates and seat statuses (*Available, Selected, Reserved*).
- **Verifiable Digital Pass**: High-resolution ticket view with dynamic scannable QR code, barcode, NFC pass styling, and simulated mobile ticket scanner modal.

### 🛒 4. Cart, Checkout & Payment Simulation
- **Persistent Cart System**: Manage quantities, view itemized totals, convenience fees, and taxes in Indian Rupees (₹ INR).
- **Checkout Flow**: Contact details autofill, simulated payment methods (UPI / Google Pay, RuPay Debit/Credit, Net Banking), and animated confetti celebration on order completion.
- **Instant E-Ticket Delivery**: Direct redirect to digital pass vault with automated order ID generation.

### 📊 5. Event Organizer & Admin Suite
- **Comprehensive Organizer Dashboard**: Track gross ticket revenue, total bookings, active attendee counts, and conversion metrics.
- **Revenue Analytics**: Interactive line & bar charts powered by `Chart.js` and `react-chartjs-2`.
- **Event Management**: Create new events, manage existing listings, adjust ticket tiers, and view transaction records.
- **Event Hosting Platform Fee**: Verified user event hosting charge integration (₹499 INR).

### 🌓 6. UI/UX Design Engineering
- **Dark & Light Modes**: System-aware theme toggle with smooth transitions.
- **Glassmorphism & Micro-animations**: Frosted glass panels, hover elevations, and responsive micro-interactions powered by Framer Motion.
- **Fully Responsive**: Optimized for ultra-wide monitors, laptops, tablets, and mobile smartphones.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Library** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS 4](https://tailwindcss.com/) + Custom Glassmorphism |
| **Animations** | [Framer Motion 13](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualizations** | [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/) |
| **QR Code Engine** | [qrcode](https://www.npmjs.com/package/qrcode) |
| **Visual Effects** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Linter & Code Quality** | [Oxlint](https://oxc.rs/) |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### 1. Clone the Repository
```bash
git clone https://github.com/nishantrami/Event-Nest.git
cd Event-Nest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal).

### 4. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🔑 Demo Accounts

For testing both user discovery and organizer dashboard permissions, the app includes pre-configured local storage accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Platform Admin / Organizer** | `admin@eventnest.com` | *(Any password / Demo)* | Full access to Organizer Dashboard, event metrics, fee tracking & event management |
| **Regular Fan / Attendee** | `user@eventnest.com` | *(Any password / Demo)* | Event discovery, seat selection, booking tickets, favorites, and digital pass vault |

---

## 📁 Project Structure

```text
Event-Nest/
├── public/                     # Static public assets (favicons, banners)
│   ├── favicon.svg
│   ├── hero-banner.jpg
│   └── icons.svg
├── src/
│   ├── animations/             # Framer motion transition variants
│   ├── assets/                 # Images, SVG icons, and hero illustrations
│   ├── components/             # Reusable UI components
│   │   ├── booking/            # Seat map, digital ticket, QR modal, ticket selector
│   │   ├── cart/               # Cart item cards, pricing breakdown
│   │   ├── common/             # Button, Badge, Modal, CountdownTimer, SearchModal
│   │   ├── events/             # Filter panel, event cards, sorting chips
│   │   ├── home/               # HeroSection with live audio visualizer & command bar
│   │   └── layout/             # Glassmorphic Navbar, mobile drawer & Footer
│   ├── context/                # React state providers
│   │   ├── AuthContext.jsx     # User authentication, roles & demo accounts
│   │   ├── BookingContext.jsx  # Digital pass vault & ticket storage
│   │   ├── CartContext.jsx     # Cart state, item counts & tax calculation
│   │   ├── EventsContext.jsx   # Event database, reviews & custom event creations
│   │   ├── FavoritesContext.jsx# User wishlist & favorites
│   │   ├── NotificationContext.jsx # Toast alerts
│   │   └── ThemeContext.jsx    # Dark / Light theme state
│   ├── data/                   # Initial datasets (30+ events, categories)
│   │   ├── categories.js
│   │   └── events.js
│   ├── pages/                  # Page views
│   │   ├── organizer/          # OrganizerDashboard, CreateEvent, EditEvent, MyEvents
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── DigitalTicketPage.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Events.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx / Register.jsx
│   │   └── MyBookings.jsx
│   ├── utils/                  # Helper utilities (formatDate, ticketQr, storage)
│   ├── App.jsx                 # Routes & Application shell
│   ├── index.css               # Global styles, Tailwind directives & keyframe animations
│   └── main.jsx                # React DOM entry point
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration with Tailwind CSS plugin
└── README.md                   # Project documentation
```

---

## 💻 Available Scripts

- `npm run dev`: Starts the local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles production build to `/dist`.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs Oxlint for high-speed JavaScript and JSX linting.

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the Project (`https://github.com/nishantrami/Event-Nest/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Crafted with ❤️ by **[Nishant Rami](https://github.com/nishantrami)**

</div>
