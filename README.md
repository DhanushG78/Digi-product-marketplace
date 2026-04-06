# 🚀 DigiMark: Premium Digital Product Marketplace

DigiMark is a state-of-the-art digital marketplace built for modern creators and buyers. It provides a seamless platform for listing, discovering, and purchasing premium digital assets such as Notion templates, Figma UI Kits, Ebooks, and software assets.

---

## ✨ Key Features

### 🔐 Persona-Based Experience
DigiMark treats its community with specialized access controls to keep the interface clean and relevant:
- **Sellers**: Can list new products, manage their inventory (Edit/Delete), and view a dedicated dashboard.
- **Buyers**: Can discover items, maintain a personal Wishlist, manage their Shopping Cart, and proceed to secure checkout.
- **Unified Browse**: Both roles can explore the 40+ item catalog with advanced filtering.

### 🛍️ Comprehensive Marketplace
- **Advanced Filtering**: Filter by category, price (Free/Paid), file type (Figma, PDF, ZIP), and popular tags.
- **Interactive Cart & Wishlist**: Real-time state management using Zustand for a snappy user experience.
- **Mock Payment Flow**: Seamless simulated checkout process that persists your purchases to your Firebase account.
- **Creator Pages**: View all products from a specific creator at a glance.

### 🎨 Modern & Responsive Design
- **Aesthetic UI**: Custom dark mode support, glassmorphism effects, and smooth Framer Motion transitions.
- **Responsive Layout**: Optimized for desktop, tablet, and mobile views.
- **Dynamic Feedback**: Real-time toast notifications for all interactions (Cart, Wishlist, Auth).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with Persistence
- **Backend / DB**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18.x or higher
- A Firebase project configured

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DhanushG78/Digi-product-marketplace.git
   cd Digi-product-marketplace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Update your Firebase configuration in `src/lib/firebase.ts` with your credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📂 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages, API Routes)
│   ├── login/         # Auth pages (Login/Signup)
│   ├── cart/          # Shopping cart logic
│   ├── payment/       # Checkout flow
│   └── items/         # Dynamic product detail pages
├── components/        # Shared UI components
│   ├── layout/        # Navbar & Footer
│   └── sections/      # Hero, Home features
├── modules/           # Business logic modules
│   └── items/         # Product-specific components, hooks, & types
├── store/             # Zustand state management
├── lib/               # Firebase & utility configurations
└── hooks/             # Custom React hooks

For a deep dive into the modular architecture used in this project, check out the [Project Structure Guide](docs/project-structure.md).

---

## 🔐 Authentication & Roles

Upon registration, users can select a **Role** (Buyer or Seller). This selection is persisted in Firestore and used across the app to conditionally render features:

- **Buyer features**: `Heart` icon for Wishlist, `Cart` management, and `Payment` access.
- **Seller features**: `Create Product` form, `Edit/Delete` controls on items they’ve listed, and `Dashboard` link.

---

## 📜 Documentation & API

- **API Routes**: Located in `src/app/api/items/route.ts` for handling item fetch/creation.
- **Seeding**: Use `npx tsx scripts/seedFirebaseEsm.mjs` to populate your Firestore with starting data.

---

## 📄 License
This project is for internship educational purposes.
