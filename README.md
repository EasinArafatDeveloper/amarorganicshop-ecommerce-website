# Amar Organic Shop 🛒

Welcome to the **Amar Organic Shop** repository! This is a complete, production-ready E-commerce application tailored for selling 100% pure, authentic, and naturally sourced organic products (honey, dates, ghee, seeds, and more) across Bangladesh. 

🌐 **Live Website:** [https://amarorganicshop.com](https://amarorganicshop.com)

---

## ⚡ Tech Stack

- **Frontend:** Next.js 14/15 (App Router), React, Tailwind CSS
- **Backend:** Next.js Serverless API Routes
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Custom JWT-based Auth with HTTP-only Cookies
- **Analytics:** Vercel Analytics & Vercel Speed Insights
- **Hosting:** Vercel

---

## 🔥 Features List

### 🛍️ Customer Frontend (E-Commerce Store)
- **Dynamic Homepage:** Beautiful Hero Section, Top Selling Products, Featured Categories, Promotional Posters, and Testimonials.
- **Shop & Category Pages:** Dynamically generated grid layouts mapping directly to database inventory.
- **Product Details:** High-quality image rendering, rich product descriptions, and dynamic pricing.
- **Floating Cart:** A sticky right-side floating shopping bag that tracks cart contents and total pricing in real-time.
- **Live Search Autocomplete:** Real-time product search from the navbar with thumbnail and price previews.
- **Cart Context & Storage:** Complex global cart state management persisting across page reloads using browser local storage.
- **Responsive Design:** 100% mobile-first CSS architecture for perfectly smooth cross-device browsing.
- **Dynamic SEO:** Fully automatic Google OpenGraph tags metadata including images injected based on fetched product database entries!
- **Sitemap & Bots Crawler:** Automated XML `sitemap.js` and `robots.txt`.

### 🛡️ Secure Admin Dashboard (CMS)
- **Headless Architecture:** Code-free control over the website's content layout and inventory.
- **Route Protection:** A custom Next.js Edge Middleware blocking unwanted users from even viewing or executing any `/api/admin` requests without a valid secure session token.
- **UI & Layout Settings:** A real-time toggle dashboard to turn homepage sections on or off, edit section titles, and modify UI text on the fly.
- **Inventory Management:** Full CRUD (Create, Read, Update, Delete) capability for Products! Add images, prices, markdown descriptions, categories right from the dashboard.
- **Category Control Panel:** Dynamically manage product categories, automated slug generation.
- **Testimonial Manager:** Approve, create, hide, or delete customer reviews appearing on the homepage.
- **Order Tracking System:** Modern data table interface viewing incoming customer orders.
- **Data Analytics Charts:** Real-time beautiful graph visualizations representing system statistics and user engagement.

---

## 🚀 How to Run Locally

If you want to run this application on your local machine:

**1. Clone the repository:**
```bash
git clone https://github.com/EasinArafatDeveloper/amarorganicshop-ecommerce-website.git
cd amarorganicshop-ecommerce-website
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_secure_authentication_token"
```

**4. Run the Dev Server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

### 🎨 Developed With Passion
Designed to bring premium organic products straight to healthy homes with a modern, fluid user experience!
