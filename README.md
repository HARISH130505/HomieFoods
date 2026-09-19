# 🍲 Homie Foods

> **Taste the Warmth of Home.** A modern hyper-local marketplace connecting passionate home chefs with food lovers craving authentic, fresh, and hygienic home-cooked meals.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql)](https://www.mysql.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 🌟 Overview

**Homie Foods** empowers neighbourhood culinary artists to share their traditional dishes while providing customers with a healthy, authentic alternative to mass-produced restaurant food. Built with a modern full-stack architecture (**Next.js 15 App Router**, **Express 5**, and **MySQL**), Homie Foods features real-time geolocation kitchen discovery, automated chef onboarding, interactive menus, order tracking, and installable Progressive Web App (PWA) functionality.

---

## ✨ Key Features

- 📍 **Interactive Kitchen Discovery Map**: Explore nearby home kitchens on a live interactive OpenStreetMap with neighborhood filter pills and live device GPS coordinate detection.
- 👨‍🍳 **Chef Onboarding & Profile Management**: Comprehensive registration for home cooks to set their brand name, description, neighborhood, exact GPS pin, and menu offerings.
- 🍛 **Curated Menus & Dish Exploration**: Browse regional specialties, homestyle delicacies, and healthy daily specials with dietary preferences and live pricing.
- 🛵 **Partner With Us (Chef & Delivery)**: Dedicated onboarding flows for chefs wanting to monetize their cooking and riders looking to deliver meals.
- 🛒 **Intuitive Cart & Fast Checkout**: Streamlined basket management, delivery address inputs, special cooking notes, and instant order placement.
- 🔐 **Secure Authentication**: Clerk-powered authentication for frictionless user onboarding and secure session management.
- 📱 **Progressive Web App (PWA)**: Installable directly onto mobile devices (iOS/Android) and desktop browsers with offline fallback support.
- 🛡️ **Enterprise-Grade Cloud Database**: Built-in MySQL connection pooling with SSL certificate verification (`ca.pem`), automatic table migrations, and error handling.

---

## 🏗️ Tech Stack

### **Frontend**
| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (Turbopack)** | React Framework with App Router & Server Components |
| **React 19** | Modern reactive component architecture |
| **Tailwind CSS v4** | Utility-first responsive design & modern styling |
| **Framer Motion** | Smooth UI animations and micro-interactions |
| **Lucide React** | Clean, modern iconography |
| **Clerk Auth (`@clerk/nextjs`)** | User identity, authentication, and session handling |
| **Leaflet & OpenStreetMap** | Dynamic interactive map and kitchen pinpoints |
| **next-pwa** | Service worker registration, offline caching, and PWA manifest |

### **Backend**
| Technology | Purpose |
| :--- | :--- |
| **Node.js & Express 5** | RESTful API server and request routing |
| **MySQL 2 (`mysql2`)** | High-performance connection pool with SSL support |
| **dotenv** | Secure environment configuration |
| **cors & body-parser** | Cross-Origin Resource Sharing and JSON request parsing |
| **nodemon** | Development hot-reloading |

---

## 📁 Repository Structure

```text
Homie Foods/
├── backend/
│   ├── index.js             # Express API server, routes, and DB pool
│   ├── migrate-location.js  # Database migration script for kitchen locations
│   ├── ca.pem               # SSL Certificate authority (for Cloud MySQL)
│   ├── package.json         # Backend dependencies & npm scripts
│   └── .env                 # Database credentials & server config
│
├── frontend/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Landing page (Hero, Map, Dishes, Kitchens)
│   │   ├── about/           # About Us & platform mission
│   │   ├── cart/            # Cart management & order checkout
│   │   ├── chefmenu/[id]/   # Dynamic chef menu & kitchen details
│   │   └── pwu/             # "Partner With Us"
│   │       ├── chef/        # Chef onboarding with GPS detection
│   │       └── delivery/    # Delivery rider onboarding
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx       # Responsive navigation bar & Clerk user profile
│   │   ├── Hero.tsx         # Hero banner with call-to-actions
│   │   ├── Map.tsx          # Real-time kitchen map with filters
│   │   ├── Dishes.tsx       # Dish showcase & add-to-cart triggers
│   │   ├── Vendor.tsx       # Featured home chefs / kitchen cards
│   │   ├── InstallButton.tsx# PWA install button & prompts
│   │   └── Footer.tsx       # Footer links & copyright
│   ├── context/             # React Context for global state (Cart, User)
│   ├── public/              # Static media, app icons, and manifest.json
│   ├── .env.local           # Clerk public/secret API keys
│   └── package.json         # Frontend dependencies & npm scripts
│
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to run Homie Foods locally on your machine.

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL**: v8.0 or compatible cloud database (e.g. TiDB, Aiven, PlanetScale, AWS RDS)

---

### 2. Backend Setup

1. Open your terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   FRONTEND_URL=http://localhost:3000
   ```
   *(Note: If connecting to a cloud database with SSL, place your `ca.pem` certificate in `backend/`)*

4. Launch the backend server:
   ```bash
   npm run dev
   ```
   > The API server will start on `http://localhost:3001`. On first run, it will automatically ensure database tables (`restaurants`, `dishes`, `orders`, `order_items`) are created and updated.

---

### 3. Frontend Setup

1. Open a second terminal window and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   > Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📡 REST API Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check endpoint |
| `GET` | `/restaurants` | Fetch all registered kitchens with location, ratings, and tags |
| `GET` | `/restaurants/:id` | Fetch single kitchen details with its corresponding menu items |
| `POST` | `/chef` | Register a new chef & kitchen (includes neighborhood & GPS coordinates) |
| `GET` | `/dishes` | Retrieve all available dishes across all kitchens |
| `POST` | `/dishes` | Add a new dish to a chef's kitchen |
| `GET` | `/orders` | Fetch orders list |
| `POST` | `/orders` | Submit a new order with items and customer details |
| `PUT` | `/orders/:id/status` | Update order delivery status (`Pending`, `Preparing`, `Out for Delivery`, `Delivered`) |

---

## 💾 Database Schema Highlights

- **`restaurants`**: Stores kitchen name, chef name, bio, image, contact, neighborhood area name (`location`), latitude, longitude, and rating.
- **`dishes`**: Stores dish name, description, price, category, dietary type (veg/non-veg), image URL, and foreign key reference to `restaurant_id`.
- **`orders`**: Stores customer name, phone, delivery address, order total, payment mode, delivery status, and timestamp.
- **`order_items`**: Line items linking each order with dishes, quantities, and item prices.

---

## 📱 Progressive Web App (PWA)

Homie Foods is optimized as a **Progressive Web App**:
- **Desktop (Chrome/Edge):** Click the install badge in the browser address bar or use the **"Install App"** button in the navigation bar.
- **iOS (Safari):** Tap **Share** → **Add to Home Screen**.
- **Android (Chrome):** Tap **Add Homie Foods to Home Screen** from the banner or browser menu.

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!

1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/CoolFeature`)
3. Commit your changes (`git commit -m 'feat: add cool feature'`)
4. Push to the Branch (`git push origin feature/CoolFeature`)
5. Open a Pull Request