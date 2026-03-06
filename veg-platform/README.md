# 🥬 VegFresh - Vegetable E-Commerce Platform

A full-stack vegetable selling e-commerce web application built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

![VegFresh](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 🛒 Customer Store
- Beautiful hero section with animations
- Browse products by category (Leafy Greens, Root Vegetables, Herbs, etc.)
- Search & sort products (by price, rating, newest)
- Product detail pages with quantity selector
- Shopping cart with delivery fee calculation (free above ₹500)
- Checkout with Razorpay payment gateway
- Order history tracking

### 🔧 Admin Panel
- Secure JWT-based login
- Dashboard with stats (products, orders, revenue)
- Add / Edit / Delete vegetables (with image picker)
- Manage order statuses (placed → confirmed → preparing → delivered)

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Glassmorphism effects, smooth animations
- Premium typography (Inter + Playfair Display)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9 or higher | Comes with Node.js |
| **Git** | Any | [git-scm.com](https://git-scm.com/) |

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd veg-ecom/veg-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then edit .env.local with your values (see below)

# 4. Start the development server
npm run dev
```

The app will be running at **http://localhost:3000** 🎉

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure these values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `ADMIN_USERNAME` | ✅ | Admin login username | `admin` |
| `ADMIN_PASSWORD` | ✅ | Admin login password | `admin123` |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens | `vegfresh-admin-secret-key-2026` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ❌* | Razorpay API Key ID | `rzp_test_demo` (demo mode) |
| `RAZORPAY_KEY_SECRET` | ❌* | Razorpay API Secret | `demo_secret` (demo mode) |

> **Note:** The app works without Razorpay keys — it runs in **demo mode** where all payments are auto-approved. To accept real payments, you need a Razorpay account.

### Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 💳 Razorpay Payment Setup

The payment gateway works in **demo mode** out of the box. To enable **real payments**:

1. **Create a Razorpay account** at [dashboard.razorpay.com](https://dashboard.razorpay.com/signup)
2. **Get your API keys** from Settings → API Keys
3. **Add keys to `.env.local`:**
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. **Uncomment the production code** in `lib/razorpay.ts` (replace the demo functions with real Razorpay SDK calls)

> 💡 Use **Test Mode** keys first (prefix `rzp_test_`) to simulate payments without real money.

---

## 🗄️ Database

This project uses **JSON file-based storage** (no external database needed!):

```
data/
├── products.json     # All vegetable products
├── categories.json   # Product categories
└── orders.json       # Customer orders
```

**Pros:** Zero setup, no database installation, easy to get started.

**Want to upgrade to a real database?** Replace the functions in `lib/db.ts` with your preferred database (MongoDB, PostgreSQL, MySQL, etc.).

---

## 🔑 Admin Access

| Field | Default Value |
|-------|--------------|
| URL | `http://localhost:3000/admin/login` |
| Username | `admin` |
| Password | `admin123` |

> ⚠️ **Change these** in `.env.local` for production!

---

## 📁 Project Structure

```
veg-platform/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (store)
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Design system & styles
│   ├── products/[id]/      # Product detail page
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout & payment
│   ├── orders/             # Order history
│   ├── admin/              # Admin panel
│   │   ├── login/          # Admin login
│   │   ├── products/       # Product management (CRUD)
│   │   └── orders/         # Order management
│   └── api/                # Backend API routes
│       ├── products/       # Products CRUD API
│       ├── categories/     # Categories API
│       ├── orders/         # Orders API
│       ├── auth/           # Admin auth API
│       └── payment/        # Razorpay integration
├── components/store/       # UI components (Navbar, Footer, etc.)
├── context/                # React contexts (Cart, Auth)
├── lib/                    # Utilities (db, auth, razorpay)
├── data/                   # JSON data storage
├── types/                  # TypeScript types
└── public/images/          # SVG vegetable images
```

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (supports `?category=`, `?search=`, `?sort=`, `?featured=`) |
| POST | `/api/products` | Create a new product |
| GET | `/api/products/:id` | Get a single product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a category |
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create an order |
| PUT | `/api/orders` | Update order status |
| POST | `/api/auth` | Admin login (returns JWT) |
| POST | `/api/payment/create` | Create Razorpay payment order |
| POST | `/api/payment/verify` | Verify payment signature |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | JSON file storage |
| Auth | JWT (jsonwebtoken) |
| Payment | Razorpay |
| Icons | Lucide React |
| Language | TypeScript |

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

Made with 💚 by VegFresh Team
