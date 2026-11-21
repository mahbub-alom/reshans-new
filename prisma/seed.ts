import { Role, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';
import { PRODUCTS } from '../src/data/products';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_COUPONS, INITIAL_REVIEWS, INITIAL_BANNERS, INITIAL_SETTINGS } from '../src/data/adminInitialData';

async function main() {
  console.log('🌱 Starting Reshans Fashion Atelier database seeding...');

  // 1. Seed Users (Admin & Customer)
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedCustomerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@reshans.com' },
    update: {},
    create: {
      name: 'Reshans Admin',
      email: 'admin@reshans.com',
      password: hashedAdminPassword,
      role: Role.ADMIN,
      phone: '+880 1700 000 000',
      avatar: '/assets/img/others/dashboard-avater.jpg',
      city: 'Dhaka',
      status: 'Active',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'floyd.miles@example.com' },
    update: {},
    create: {
      name: 'Floyd Miles',
      email: 'floyd.miles@example.com',
      password: hashedCustomerPassword,
      role: Role.CUSTOMER,
      phone: '+880 1711 234 567',
      avatar: '/assets/img/others/dashboard-avater.jpg',
      city: 'Dhaka',
      status: 'Active',
    },
  });

  console.log('👤 Users seeded:', { admin: admin.email, customer: customer.email });

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'Men Collection',
      slug: 'men-collection',
      image: '/assets/img/fashion-1/category/category-1.jpg',
      description: 'Tailored shirts, structured trousers, linen suits and premium outerwear.',
    },
    {
      name: 'Women Collection',
      slug: 'women-collection',
      image: '/assets/img/fashion-1/category/category-2.jpg',
      description: 'Chic silhouettes, artisanal silk blouses, evening gowns and essentials.',
    },
    {
      name: 'Casual Wear',
      slug: 'casual-wear',
      image: '/assets/img/fashion-1/category/category-3.jpg',
      description: 'Everyday cotton tees, breathable knits, and relaxed weekend sets.',
    },
    {
      name: 'Workleisure',
      slug: 'workleisure',
      image: '/assets/img/fashion-1/category/category-4.jpg',
      description: 'Blended formal-comfort wear engineered for modern professionals in Dhaka.',
    },
    {
      name: 'Accessories & Bags',
      slug: 'accessories-bags',
      image: '/assets/img/fashion-1/category/category-5.jpg',
      description: 'Handcrafted leather wallets, canvas totes, belts, and caps.',
    },
    {
      name: 'Knitwear',
      slug: 'knitwear',
      image: '/assets/img/fashion-1/category/category-3.jpg',
      description: 'Ultra-soft knitted pullovers and lightweight cotton sweaters.',
    },
    {
      name: 'Outerwear',
      slug: 'outerwear',
      image: '/assets/img/fashion-1/category/category-4.jpg',
      description: 'Artisanal overshirts, tailored blazers, and twill coats.',
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        description: cat.description,
        status: 'Active',
      },
    });
    categoryMap[cat.name] = record.id;
  }

  // 3. Seed Brands
  const brandsData = [
    { name: 'Reshans Atelier', origin: 'Dhaka, Bangladesh' },
    { name: 'Reshans Studio', origin: 'Dhaka, Bangladesh' },
    { name: 'Reshans Casuals', origin: 'Gazipur, Bangladesh' },
    { name: 'Urban Silk Co.', origin: 'Rajshahi, Bangladesh' },
    { name: 'Bengal Cotton Works', origin: 'Narayanganj, Bangladesh' },
  ];

  const brandMap: Record<string, string> = {};
  for (const br of brandsData) {
    const record = await prisma.brand.upsert({
      where: { name: br.name },
      update: {},
      create: {
        name: br.name,
        origin: br.origin,
      },
    });
    brandMap[br.name] = record.id;
  }

  // 4. Seed Products from PRODUCTS catalog
  for (const p of PRODUCTS) {
    const sku = `RSH-${p.id.toUpperCase()}`;
    const categoryId = categoryMap[p.category] || categoryMap['Men Collection'];
    const brandId = brandMap['Reshans Atelier'];

    const colorsString = p.colors ? p.colors.map((c) => `${c.name}:${c.hex}`).join(',') : '';
    const sizesString = p.sizes ? p.sizes.join(',') : 'S,M,L,XL';

    await prisma.product.upsert({
      where: { sku },
      update: {
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || null,
        discount: p.discount || null,
        badge: p.badge || null,
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 10,
        frontImage: p.frontImage,
        backImage: p.backImage || p.frontImage,
        inStock: p.inStock ?? true,
        isTrending: !!p.isTrending,
        isBestSeller: !!p.isBestSeller,
        isNewArrival: p.tabCategory === 'new',
        tabCategory: p.tabCategory || 'new',
        department: p.department || 'men',
        sizes: sizesString,
        colors: colorsString,
        categoryId,
        brandId,
      },
      create: {
        id: p.id,
        name: p.name,
        sku,
        description: p.description || 'Modern luxury artisanal apparel tailored in Dhaka.',
        price: p.price,
        originalPrice: p.originalPrice || null,
        discount: p.discount || null,
        badge: p.badge || null,
        rating: p.rating || 5.0,
        reviewsCount: p.reviewsCount || 10,
        frontImage: p.frontImage,
        backImage: p.backImage || p.frontImage,
        inStock: p.inStock ?? true,
        stockCount: 25,
        isTrending: !!p.isTrending,
        isBestSeller: !!p.isBestSeller,
        isNewArrival: p.tabCategory === 'new',
        tabCategory: p.tabCategory || 'new',
        department: p.department || 'men',
        sizes: sizesString,
        colors: colorsString,
        categoryId,
        brandId,
      },
    });
  }

  // 5. Seed Coupons
  for (const c of INITIAL_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minSpend: c.minSpend,
        usageLimit: c.usageLimit,
        usageCount: c.usageCount,
        isActive: c.isActive,
      },
    });
  }

  // 6. Seed Banners
  for (const b of INITIAL_BANNERS) {
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!existing) {
      await prisma.banner.create({
        data: {
          type: b.type,
          title: b.title,
          subtitle: b.subtitle || null,
          buttonText: b.buttonText || null,
          link: b.link || '/shop',
          imageUrl: b.imageUrl || null,
          isActive: b.isActive,
        },
      });
    }
  }

  // 7. Seed Website Settings
  for (const [key, value] of Object.entries(INITIAL_SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }

  console.log('✅ Reshans database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
