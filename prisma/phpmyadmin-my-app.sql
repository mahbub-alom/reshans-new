-- ==========================================================
-- Reshans Fashion Atelier - MySQL / phpMyAdmin Full Database
-- Target Database: my-app
-- Character Set: utf8mb4_unicode_ci
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, phpMyAdmin
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `my-app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `my-app`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- Table structure for `users`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `avatar` TEXT NULL,
  `phone` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL DEFAULT 'Dhaka',
  `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `categories`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `image` TEXT NOT NULL,
  `description` TEXT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `brands`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `origin` VARCHAR(191) NULL DEFAULT 'Dhaka, Bangladesh',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `products`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `sku` VARCHAR(191) NULL,
  `description` TEXT NOT NULL,
  `price` DOUBLE NOT NULL,
  `originalPrice` DOUBLE NULL,
  `discount` VARCHAR(191) NULL,
  `badge` VARCHAR(191) NULL,
  `rating` DOUBLE NOT NULL DEFAULT 5.0,
  `reviewsCount` INT NOT NULL DEFAULT 0,
  `frontImage` TEXT NOT NULL,
  `backImage` TEXT NULL,
  `inStock` BOOLEAN NOT NULL DEFAULT TRUE,
  `stockCount` INT NOT NULL DEFAULT 20,
  `isTrending` BOOLEAN NOT NULL DEFAULT FALSE,
  `isNewArrival` BOOLEAN NOT NULL DEFAULT FALSE,
  `isBestSeller` BOOLEAN NOT NULL DEFAULT FALSE,
  `tabCategory` VARCHAR(191) NULL,
  `department` VARCHAR(191) NULL DEFAULT 'men',
  `sizes` VARCHAR(191) NOT NULL DEFAULT 'S,M,L,XL',
  `colors` VARCHAR(191) NOT NULL DEFAULT 'Forest Green:#093624,Butter Cream:#F9F295',
  `categoryId` VARCHAR(191) NULL,
  `brandId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_key` (`sku`),
  KEY `products_categoryId_idx` (`categoryId`),
  KEY `products_brandId_idx` (`brandId`),
  CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `orders`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `customerEmail` VARCHAR(191) NOT NULL,
  `customerPhone` VARCHAR(191) NOT NULL,
  `customerAddress` TEXT NOT NULL,
  `total` DOUBLE NOT NULL,
  `subtotal` DOUBLE NOT NULL,
  `deliveryFee` DOUBLE NOT NULL DEFAULT 60.0,
  `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'Cash on Delivery',
  `paymentStatus` ENUM('PAID', 'PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `orderStatus` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `trackingNumber` VARCHAR(191) NULL,
  `note` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_orderNumber_key` (`orderNumber`),
  KEY `orders_userId_idx` (`userId`),
  CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `order_items`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NULL,
  `productName` VARCHAR(191) NOT NULL,
  `productImage` TEXT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `selectedColor` VARCHAR(191) NULL,
  `selectedSize` VARCHAR(191) NULL,
  `price` DOUBLE NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `order_items_orderId_idx` (`orderId`),
  KEY `order_items_productId_idx` (`productId`),
  CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `coupons`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `discountType` VARCHAR(191) NOT NULL DEFAULT 'percentage',
  `discountValue` DOUBLE NOT NULL,
  `minSpend` DOUBLE NOT NULL DEFAULT 0.0,
  `expiryDate` DATETIME(3) NULL,
  `usageLimit` INT NOT NULL DEFAULT 100,
  `usageCount` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `reviews`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `customerAvatar` TEXT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `isVerified` BOOLEAN NOT NULL DEFAULT TRUE,
  `status` VARCHAR(191) NOT NULL DEFAULT 'approved',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reviews_productId_idx` (`productId`),
  KEY `reviews_userId_idx` (`userId`),
  CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `banners`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'hero',
  `title` VARCHAR(191) NOT NULL,
  `subtitle` TEXT NULL,
  `buttonText` VARCHAR(191) NULL,
  `link` VARCHAR(191) NULL,
  `imageUrl` TEXT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `settings`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table structure for `addresses`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL DEFAULT 'Home',
  `name` VARCHAR(191) NOT NULL,
  `street` TEXT NOT NULL,
  `city` VARCHAR(191) NOT NULL DEFAULT 'Dhaka',
  `postalCode` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NOT NULL,
  `isDefault` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `addresses_userId_idx` (`userId`),
  CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA INSERTION
-- ==========================================================

-- 1. Users (Admin: admin@reshans.com / admin123, Customer: floyd.miles@example.com / customer123)
INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `avatar`, `phone`, `city`, `status`) VALUES
('USR-ADMIN-01', 'admin@reshans.com', '$2b$10$tZ20k9kHkG73XjY9rP.xMe20GZ9aX.vXG22Hl/hL6v1m4W3Gz2rO6', 'Reshans Admin', 'ADMIN', '/assets/img/others/dashboard-avater.jpg', '+880 1700 000 000', 'Dhaka', 'Active'),
('USR-CUST-01', 'floyd.miles@example.com', '$2b$10$w85vF64uXG9h9r1yqCgNGeP9W/4Fm3Z7J2yK6vH5P1t0L8n7A2mS.', 'Floyd Miles', 'CUSTOMER', '/assets/img/others/dashboard-avater.jpg', '+880 1711 234 567', 'Dhaka', 'Active')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `description`, `status`) VALUES
('CAT-01', 'Men Collection', 'men-collection', '/assets/img/fashion-1/category/category-1.jpg', 'Tailored shirts, structured trousers, linen suits and premium outerwear.', 'Active'),
('CAT-02', 'Women Collection', 'women-collection', '/assets/img/fashion-1/category/category-2.jpg', 'Chic silhouettes, artisanal silk blouses, evening gowns and essentials.', 'Active'),
('CAT-03', 'Casual Wear', 'casual-wear', '/assets/img/fashion-1/category/category-3.jpg', 'Everyday cotton tees, breathable knits, and relaxed weekend sets.', 'Active'),
('CAT-04', 'Workleisure', 'workleisure', '/assets/img/fashion-1/category/category-4.jpg', 'Blended formal-comfort wear engineered for modern professionals in Dhaka.', 'Active'),
('CAT-05', 'Accessories & Bags', 'accessories-bags', '/assets/img/fashion-1/category/category-5.jpg', 'Handcrafted leather wallets, canvas totes, belts, and caps.', 'Active'),
('CAT-06', 'Knitwear', 'knitwear', '/assets/img/fashion-1/category/category-3.jpg', 'Ultra-soft knitted pullovers and lightweight cotton sweaters.', 'Active'),
('CAT-07', 'Outerwear', 'outerwear', '/assets/img/fashion-1/category/category-4.jpg', 'Artisanal overshirts, tailored blazers, and twill coats.', 'Active')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Brands
INSERT INTO `brands` (`id`, `name`, `origin`) VALUES
('BR-1', 'Reshans Atelier', 'Dhaka, Bangladesh'),
('BR-2', 'Reshans Studio', 'Dhaka, Bangladesh'),
('BR-3', 'Reshans Casuals', 'Gazipur, Bangladesh'),
('BR-4', 'Urban Silk Co.', 'Rajshahi, Bangladesh'),
('BR-5', 'Bengal Cotton Works', 'Narayanganj, Bangladesh')
ON DUPLICATE KEY UPDATE `origin`=VALUES(`origin`);

-- 4. Products (All 12 items with full Bangladeshi pricing in BDT)
INSERT INTO `products` (`id`, `name`, `sku`, `description`, `price`, `originalPrice`, `discount`, `badge`, `rating`, `reviewsCount`, `frontImage`, `backImage`, `inStock`, `stockCount`, `isTrending`, `isNewArrival`, `isBestSeller`, `tabCategory`, `department`, `sizes`, `colors`, `categoryId`, `brandId`) VALUES
('prod-1', 'Slim-Fit Crew in Cozy Waffle', 'RSH-PROD-1', 'Designed with a textured waffle knit, this cozy crewneck sweater offers tailored warmth with everyday breathability.', 3850, 4800, '-20%', 'sale', 5.0, 32, '/assets/img/fashion-1/product/product-1/front-img-1.jpg', '/assets/img/fashion-1/product/product-1/back-img-1.jpg', 1, 25, 1, 0, 1, 'top_sellers', 'men', 'S,M,L,XL', 'Forest Green:#093624,Oatmeal:#D6C8B4,Charcoal:#2C2E30', 'CAT-01', 'BR-1'),
('prod-2', 'Sweater in Everyday Cotton', 'RSH-PROD-2', '100% combed organic cotton sweater with ribbed trims and relaxed shoulders for effortless layering.', 3600, 4500, '-20%', 'hot', 5.0, 19, '/assets/img/fashion-1/product/product-2/front-img-1.jpg', '/assets/img/fashion-1/product/product-2/back-img-1.jpg', 1, 30, 1, 0, 1, 'featured', 'women', 'XS,S,M,L', 'Butter Cream:#F9F295,Navy:#1B263B,Rust:#8D493A', 'CAT-03', 'BR-2'),
('prod-3', 'Fitted Waffle Texture Crew', 'RSH-PROD-3', 'A versatile mid-weight waffle knit top crafted from responsibly sourced cotton yarns.', 2450, 3200, '-23%', 'hot', 4.8, 45, '/assets/img/fashion-1/product/product-3/front-img-1.jpg', '/assets/img/fashion-1/product/product-3/back-img-1.jpg', 1, 18, 1, 1, 1, 'new', 'men', 'S,M,L,XL,XXL', 'Sage Green:#7A8B7B,Heather Gray:#A8A9AD,Midnight:#0F172A', 'CAT-06', 'BR-3'),
('prod-4', 'The Heavyweight Overshirt', 'RSH-PROD-4', 'Structured cotton twill jacket with utilitarian chest flap pockets and reinforced button seams.', 4950, 5800, '-15%', 'sale', 5.0, 28, '/assets/img/fashion-1/product/product-4/front-img-1.jpg', '/assets/img/fashion-1/product/product-4/back-img-1.jpg', 1, 14, 1, 0, 1, 'top_sellers', 'men', 'M,L,XL', 'Dark Pine:#17382B,Taupe:#8B7D70,Black:#141414', 'CAT-07', 'BR-1'),
('prod-5', 'The Cocoon Crew in Alpaca', 'RSH-PROD-5', 'Ultra-soft blend with a curved cocoon silhouette and refined ribbed cuffs for cool evenings.', 6200, 7500, '-17%', 'new', 5.0, 14, '/assets/img/fashion-1/product/product-5/front-img-1.jpg', '/assets/img/fashion-1/product/product-5/back-img-1.jpg', 1, 8, 0, 0, 1, 'featured', 'women', 'S,M,L', 'Bone:#EDE6D6,Mocha:#4A3728,Blush:#E8C5C8', 'CAT-02', 'BR-4'),
('prod-6', 'Waffle Knit Relaxed Cardigan', 'RSH-PROD-6', 'Button-front cardigan in thermal waffle stitch with horn buttons and patch pockets.', 4200, 5200, '-19%', 'sale', 4.9, 21, '/assets/img/fashion-1/product/product-6/front-img-1.jpg', '/assets/img/fashion-1/product/product-6/back-img-1.jpg', 1, 20, 1, 1, 0, 'new', 'men', 'S,M,L,XL', 'Clay Terracotta:#A0522D,Forest:#093624,Sand:#C2B280', 'CAT-06', 'BR-3'),
('prod-7', 'The Poplin Relaxed Shirt', 'RSH-PROD-7', 'Crisp 100% cotton poplin shirt with mother-of-pearl buttons and relaxed boxy cut.', 2850, 3400, '-16%', 'hot', 4.7, 36, '/assets/img/fashion-1/product/product-7/front-img-1.jpg', '/assets/img/fashion-1/product/product-7/back-img-1.jpg', 1, 22, 1, 0, 1, 'top_sellers', 'men', 'S,M,L,XL', 'Sky Blue:#87CEEB,Pure White:#FFFFFF,Olive:#556B2F', 'CAT-01', 'BR-1'),
('prod-8', 'The Linen Chore Jacket', 'RSH-PROD-8', 'Breathable heavy French flax linen chore coat tailored for tropical Bangladeshi climate.', 5400, 6500, '-17%', 'new', 5.0, 11, '/assets/img/fashion-1/product/product-8/front-img-1.jpg', '/assets/img/fashion-1/product/product-8/back-img-1.jpg', 1, 12, 1, 1, 0, 'new', 'men', 'M,L,XL', 'Natural Flax:#D2B48C,Navy:#000080,Olive Drab:#6B8E23', 'CAT-07', 'BR-1'),
('prod-9', 'The Ribbed Tank Top', 'RSH-PROD-9', 'Fitted modal-cotton blend tank top with bound scooped neckline.', 950, 1200, '-21%', NULL, 4.6, 52, '/assets/img/fashion-1/product/product-1/front-img-1.jpg', '/assets/img/fashion-1/product/product-1/back-img-1.jpg', 1, 40, 0, 0, 1, 'top_sellers', 'women', 'XS,S,M,L', 'White:#FFFFFF,Black:#141414,Tangerine:#F28500', 'CAT-03', 'BR-2'),
('prod-10', 'Tailored Linen Trouser', 'RSH-PROD-10', 'Single-pleat linen trousers with elastic back waistband and horn side adjusters.', 3450, 4200, '-18%', 'hot', 4.8, 17, '/assets/img/fashion-1/product/product-2/front-img-1.jpg', '/assets/img/fashion-1/product/product-2/back-img-1.jpg', 1, 15, 1, 0, 1, 'featured', 'men', '30,32,34,36', 'Khaki:#C3B091,Navy:#1A2A3A,Charcoal:#36454F', 'CAT-01', 'BR-1'),
('prod-11', 'Silk Blend Evening Blouse', 'RSH-PROD-11', 'Fluid draped mulberry silk blouse with concealed placket and delicate cuffs.', 4800, 6000, '-20%', 'new', 5.0, 8, '/assets/img/fashion-1/product/product-3/front-img-1.jpg', '/assets/img/fashion-1/product/product-3/back-img-1.jpg', 1, 9, 0, 1, 0, 'new', 'women', 'XS,S,M,L', 'Champagne:#F7E7CE,Emerald:#50C878,Onyx:#0F0F0F', 'CAT-02', 'BR-4'),
('prod-12', 'Handwoven Canvas Tote Bag', 'RSH-PROD-12', 'Heavy 16oz duck canvas tote reinforced with full-grain cowhide leather handles and brass rivets.', 1850, 2400, '-23%', 'sale', 4.9, 29, '/assets/img/fashion-1/product/product-4/front-img-1.jpg', '/assets/img/fashion-1/product/product-4/back-img-1.jpg', 1, 35, 1, 0, 1, 'featured', 'all', 'One Size', 'Ecru:#C2B280,Olive Green:#556B2F,Black:#141414', 'CAT-05', 'BR-5')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`);

-- 5. Coupons
INSERT INTO `coupons` (`id`, `code`, `discountType`, `discountValue`, `minSpend`, `expiryDate`, `usageLimit`, `usageCount`, `isActive`) VALUES
('CPN-1', 'RESHANS20', 'percentage', 20, 3000, '2026-04-30 23:59:59', 200, 84, 1),
('CPN-2', 'EID2026', 'percentage', 25, 5000, '2026-04-15 23:59:59', 500, 192, 1),
('CPN-3', 'DHAKAFREE', 'fixed', 120, 2000, '2026-05-31 23:59:59', 300, 110, 1),
('CPN-4', 'WELCOME10', 'percentage', 10, 1500, '2026-12-31 23:59:59', 1000, 432, 1)
ON DUPLICATE KEY UPDATE `discountValue`=VALUES(`discountValue`);

-- 6. Sample Orders
INSERT INTO `orders` (`id`, `orderNumber`, `userId`, `customerName`, `customerEmail`, `customerPhone`, `customerAddress`, `total`, `subtotal`, `deliveryFee`, `paymentMethod`, `paymentStatus`, `orderStatus`, `trackingNumber`, `note`) VALUES
('ORD-8921', 'ORD-8921', 'USR-CUST-01', 'Floyd Miles', 'floyd.miles@example.com', '+880 1711 234 567', 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230', 7450, 7390, 60, 'bKash', 'PAID', 'PROCESSING', 'REDX-DH-98231', 'Please call before delivery'),
('ORD-8920', 'ORD-8920', NULL, 'Anika Rahman', 'anika.rahman@gmail.com', '+880 1822 456 789', 'Apartment 4B, Concord Tower, Gulshan-2, Dhaka', 4950, 4890, 60, 'Credit / Debit Card', 'PAID', 'SHIPPED', 'STEAD-884129', NULL),
('ORD-8919', 'ORD-8919', NULL, 'Tanvir Hossain', 'tanvir.hossain@outlook.com', '+880 1933 789 012', 'Plot 55, Road 8/A, Dhanmondi, Dhaka-1209', 5850, 5790, 60, 'Cash on Delivery', 'PENDING', 'PENDING', NULL, 'Leave package at security desk if unavailable')
ON DUPLICATE KEY UPDATE `orderStatus`=VALUES(`orderStatus`);

-- 7. Order Items
INSERT INTO `order_items` (`id`, `orderId`, `productId`, `productName`, `productImage`, `quantity`, `selectedColor`, `selectedSize`, `price`) VALUES
('ITEM-1', 'ORD-8921', 'prod-1', 'Slim-Fit Crew in Cozy Waffle', '/assets/img/fashion-1/product/product-1/front-img-1.jpg', 1, 'Forest Green', 'L', 3850),
('ITEM-2', 'ORD-8921', 'prod-2', 'Sweater in Everyday Cotton', '/assets/img/fashion-1/product/product-2/front-img-1.jpg', 1, 'Butter Cream', 'M', 3600),
('ITEM-3', 'ORD-8920', 'prod-4', 'The Heavyweight Overshirt', '/assets/img/fashion-1/product/product-4/front-img-1.jpg', 1, 'Dark Pine', 'M', 4950)
ON DUPLICATE KEY UPDATE `quantity`=VALUES(`quantity`);

-- 8. Customer Reviews
INSERT INTO `reviews` (`id`, `productId`, `userId`, `customerName`, `customerAvatar`, `rating`, `comment`, `isVerified`, `status`) VALUES
('REV-1', 'prod-1', 'USR-CUST-01', 'Floyd Miles', '/assets/img/others/dashboard-avater.jpg', 5, 'The waffle texture is supreme! Keeps warm during cool evenings in Gulshan and fits like a dream.', 1, 'approved'),
('REV-2', 'prod-2', NULL, 'Anika Rahman', '/assets/img/others/dashboard-avater.jpg', 5, 'Butter cream shade looks luxurious in person. Soft combed cotton fabric with zero itching.', 1, 'approved'),
('REV-3', 'prod-4', NULL, 'Zubair Ahmed', '/assets/img/others/dashboard-avater.jpg', 5, 'Super heavy twill overshirt. Buttons are sturdy, pockets fit my phone effortlessly.', 1, 'approved')
ON DUPLICATE KEY UPDATE `comment`=VALUES(`comment`);

-- 9. Banners
INSERT INTO `banners` (`id`, `type`, `title`, `subtitle`, `buttonText`, `link`, `imageUrl`, `isActive`) VALUES
('BAN-1', 'hero', 'Spring Summer 2026 Luxury Capsule', 'Hand-dyed organic yarns & tailored contemporary silhouettes', 'Explore Collection', '/shop', '/assets/img/fashion-1/slider/slider-1.jpg', 1),
('BAN-2', 'dual', 'The Linen Atelier Edition', 'Up to 30% off tailored jackets', 'Shop Linen', '/shop', '/assets/img/fashion-1/banner/banner-1.jpg', 1),
('BAN-3', 'dual', 'Minimalist Wardrobe Staples', 'Combed organic cotton knitwear', 'Discover Tops', '/shop', '/assets/img/fashion-1/banner/banner-2.jpg', 1),
('BAN-4', 'marquee', 'FREE EXPRESS SHIPPING ACROSS BANGLADESH ON ORDERS OVER ৳ 2,500', 'USE CODE: EID2026 FOR 25% OFF', NULL, NULL, NULL, 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 10. Settings
INSERT INTO `settings` (`id`, `key`, `value`) VALUES
('SET-1', 'storeName', 'Reshans Fashion Atelier'),
('SET-2', 'tagline', 'Modern Bangladeshi Luxury & Contemporary Apparel'),
('SET-3', 'email', 'concierge@reshans.com'),
('SET-4', 'phone', '+880 1700 000 000'),
('SET-5', 'currency', 'BDT (৳)'),
('SET-6', 'shippingInsideDhaka', '60'),
('SET-7', 'shippingOutsideDhaka', '120'),
('SET-8', 'freeShippingThreshold', '2500'),
('SET-9', 'paymentCOD', 'true'),
('SET-10', 'paymentBkash', 'true'),
('SET-11', 'paymentNagad', 'true')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- END OF SCRIPT - Successfully setup for database `my-app`
-- ==========================================================
