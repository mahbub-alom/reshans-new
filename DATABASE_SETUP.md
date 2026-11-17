# Reshans Fashion Atelier - MySQL & phpMyAdmin Database Guide (Prisma 7)

This Next.js full-stack eCommerce application is powered by **Prisma 7** and configured to connect to a **MySQL** database managed via **phpMyAdmin** (e.g., XAMPP, WampServer, Laragon, or standalone MySQL).

---

## Method 1: Instant 1-Click Import in phpMyAdmin (Recommended)

1. Open your browser and go to `http://localhost/phpmyadmin`.
2. Click **"New"** in the left sidebar and create a database named `my-app` (Collation: `utf8mb4_unicode_ci`).
3. Click on the `my-app` database in the left sidebar.
4. Click the **"Import"** tab in the top navigation.
5. Under **"File to import"**, choose the file:
   ```
   prisma/phpmyadmin-my-app.sql
   ```
6. Scroll down and click **"Go"** (or **"Import"**).
7. All 11 tables and full sample data (all 12 products, categories, brands, coupons, banners, admin & customer users) are immediately imported!

---

## Method 2: CLI Push & Seed via Prisma 7

### Step 1: Ensure MySQL is running
Start your MySQL server (via XAMPP / WAMP control panel or `sudo service mysql start`).

### Step 2: Environment Configuration (`.env`)
Make sure `.env` contains:
```env
DATABASE_URL="mysql://root:@localhost:3306/my-app"
JWT_SECRET=d8be2ac500193ec824aba2c03bf4a5a4ad2f225d447f2879b645f154070c2f3b0aeb704d7998fc006db1d098f84d82ba33c73447351362f9e308607e36ae562f
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_CURRENCY="BDT"
NEXT_PUBLIC_CURRENCY_SYMBOL="৳"
```

### Step 3: Push Schema to MySQL
```bash
npx prisma db push
```
Prisma 7 loads `prisma.config.ts` and pushes all models directly to `my-app`:
- `users` — Administrator & customer credentials, hashed passwords, roles
- `products` — Garment details, sizes, colors, pricing in BDT (`৳`), stock levels
- `categories` — Clothing departments (Men Collection, Women, Casual, Workleisure, etc.)
- `brands` — Designer labels (Reshans Atelier, Reshans Casuals, Reshans Studio, etc.)
- `orders` — Customer orders, delivery addresses, payment methods (bKash, Nagad, COD)
- `order_items` — Garments attached to each order
- `coupons` — Promotional discount vouchers (`RESHANS20`, `EID2026`, etc.)
- `reviews` — Customer product ratings and verified purchase feedback
- `banners` — Hero slider slides, campaign banners, and marquee ticker copy
- `settings` — Store details, Dhaka vs outside delivery tariffs, payment toggles
- `addresses` — Customer delivery addresses

### Step 4: Seed Initial Records
```bash
npm run prisma:seed
```
This populates:
- **Admin account**: `admin@reshans.com` / Password: `admin123`
- **Customer account**: `floyd.miles@example.com` / Password: `customer123`
- All 12 fashion products with authentic BDT pricing and full color/size variants
- Active coupons (`RESHANS20`, `EID2026`, `DHAKAFREE`) and promotional campaign banners

---

## 3. Real-Time Frontend & Admin Integration

- Frontend catalog (`/shop`, `/`, product details, and category filters) automatically syncs from `/api/products` and `/api/categories`.
- Adding, updating, or deleting products in the Admin Dashboard (`/admin`) performs live updates via the backend API routes.
- Placing orders in the customer checkout registers orders in the database.
- Toggling coupon status or modifying store settings immediately stores data.
