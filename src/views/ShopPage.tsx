import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X, Check, Search, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';

// Category circles data matching reference product-filter-top.html
const CATEGORY_CIRCLES = [
  { id: 'caps', label: 'Caps', image: '/assets/img/fashion-1/categories/category-7.jpg', filterKey: 'Caps' },
  { id: 'new', label: 'New Arrivals', image: '/assets/img/fashion-1/categories/category-5.jpg', filterKey: 'new' },
  { id: 'workleisure', label: 'Workleisure', image: '/assets/img/fashion-1/categories/category-11.jpg', filterKey: 'Workleisure' },
  { id: 'bottoms', label: 'Bottoms', image: '/assets/img/fashion-1/categories/category-12.jpg', filterKey: 'Bottoms' },
  { id: 'tops', label: 'Tops', image: '/assets/img/fashion-1/categories/category-13.jpg', filterKey: 'Tops' },
  { id: 'dresses', label: 'Dresses', image: '/assets/img/fashion-1/categories/category-14.jpg', filterKey: 'Dress' },
  { id: 'shorts', label: 'Shorts', image: '/assets/img/fashion-1/categories/category-15.jpg', filterKey: 'Shorts' },
  { id: 'clothes', label: 'Clothes', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'Clothes' },
];

const COLOR_OPTIONS = [
  { name: 'Melon', hex: '#D3E0AA' },
  { name: 'Electric Black', hex: '#2B2929' },
  { name: 'Pastel Yellow', hex: '#F0E4CE' },
  { name: 'Endless Sky', hex: '#08457F' },
  { name: 'Earthy Khaki', hex: '#EEAE76' },
  { name: 'Camo Light', hex: '#836953' },
  { name: 'American Denim', hex: '#4F738E' },
  { name: 'Gray', hex: '#F2F2F2' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Forest Green', hex: '#093624' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ShopPage: React.FC = () => {
  const { products, categories, navigate, formatPrice, activeCategoryFilter, setActiveCategoryFilter } = useShop();

  // Active filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryFilter || 'all');
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Dynamic Shop Page categories (all active categories across the store so customer can browse anything in Shop)
  const shopCategories = useMemo(() => {
    // Return all active categories deduplicated by name
    const active = categories.filter((c) => c.status === 'Active');
    const seen = new Set<string>();
    return active.filter((c) => {
      const lower = c.name.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [categories]);

  // Dynamic Category Circles for Shop page showing all categories
  const categoryCircles = useMemo(() => {
    if (shopCategories.length > 0) {
      return [
        { id: 'shop-all', label: 'All Shop', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'all' },
        ...shopCategories.map((c) => ({
          id: c.id,
          label: c.name,
          image: c.image || '/assets/img/fashion-1/categories/category-13.jpg',
          filterKey: c.name,
        })),
      ];
    }
    return CATEGORY_CIRCLES;
  }, [shopCategories]);

  // Sync when activeCategoryFilter changes
  useEffect(() => {
    if (activeCategoryFilter) {
      setSelectedCategory(activeCategoryFilter);
      setCurrentPage(1);
    }
  }, [activeCategoryFilter]);

  // Active opened dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Category circles mouse drag-to-scroll state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isDragMoved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    isDragMoved.current = false;
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // drag speed multiplier
    if (Math.abs(walk) > 5) {
      isDragMoved.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleCategoryCircleClick = (filterKey: string) => {
    if (selectedCategory === filterKey) {
      setSelectedCategory('all');
    } else {
      setSelectedCategory(filterKey);
    }
    setCurrentPage(1);
  };

  const toggleAvailability = (val: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedAvailability([]);
    setPriceRange(10000);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
    setSortBy('default');
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedAvailability.length +
    (priceRange < 10000 ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (searchQuery.trim() ? 1 : 0);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    // In Shop page, display all products across all categories & pages without duplicates
    const seenIds = new Set<string>();
    let result = (products && products.length ? products : PRODUCTS).filter((p) => {
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    });

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'new') {
        result = result.filter((p) => p.isNewArrival || p.badge === 'new');
      } else {
        result = result.filter((p) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          p.name.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      result = result.filter((p) => {
        if (selectedAvailability.includes('in_stock') && p.inStock) return true;
        if (selectedAvailability.includes('on_sale') && (p.originalPrice || p.discount || p.badge === 'sale')) return true;
        if (selectedAvailability.includes('out_stock') && !p.inStock) return true;
        return false;
      });
    }

    // Price filter
    result = result.filter((p) => p.price <= priceRange);

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes && p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors && p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [
    selectedCategory,
    selectedAvailability,
    priceRange,
    selectedSizes,
    selectedColors,
    searchQuery,
    sortBy,
  ]);

  // Paginated items
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Breadcrumb Area - Exact style from product-filter-top.html */}
      <section className="bg-[#F9F9F9] py-14 text-center border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#55585B] font-satoshi-med mb-3">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#141414] font-satoshi-bold">Shop</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#141414] font-satoshi-bold tracking-tight mb-2">
            New Arrival
          </h1>
          <p className="text-sm md:text-base text-[#55585B] font-satoshi-regular">
            Shop through our latest selection of Fashion
          </p>
        </div>
      </section>

      {/* 2. Categories Circular Area (Slider/Row) - Exact Aqlova Style with Drag-to-Scroll */}
      <section className="pt-12 pb-6 border-b border-gray-100 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 no-scrollbar cursor-grab active:cursor-grabbing ${
              isDragging ? 'cursor-grabbing select-none' : ''
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categoryCircles.map((cat) => {
              const isSelected = selectedCategory === cat.filterKey;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (!isDragMoved.current) {
                      handleCategoryCircleClick(cat.filterKey);
                    }
                  }}
                  className="flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-hidden"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all duration-300 pointer-events-none ${
                      isSelected
                        ? 'ring-2 ring-[#093624] scale-105'
                        : 'border border-gray-200 group-hover:border-[#093624] group-hover:scale-105'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      draggable={false}
                      className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110 pointer-events-none select-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/assets/img/fashion-2/category/cat-1.jpg';
                      }}
                    />
                  </div>
                  <span
                    className={`mt-2.5 text-xs sm:text-sm font-satoshi-med transition-colors pointer-events-none ${
                      isSelected ? 'text-[#093624] font-bold' : 'text-[#141414] group-hover:text-[#093624]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Top Filter Bar & Interactive Dropdowns (6 Columns) */}
      <section className="py-8 bg-white" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top 5 Horizontal Filter Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pb-6 border-b border-gray-100">
            {/* 1. Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('category')}
                className={`w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${
                  openDropdown === 'category' || selectedCategory !== 'all'
                    ? 'border-[#093624] text-[#093624] bg-[#093624]/5'
                    : 'border-gray-200 text-[#141414] hover:border-gray-300'
                }`}
              >
                <span className="truncate">
                  {selectedCategory !== 'all' ? selectedCategory : 'Category'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'category' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'category' && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b">
                    Category
                  </h4>
                  <ul className="space-y-1.5 text-xs font-satoshi-med text-[#141414]">
                    {(
                      shopCategories.length > 0
                        ? [
                            { key: 'all', label: 'All Categories' },
                            ...shopCategories.map((c) => ({ key: c.name, label: c.name })),
                          ]
                        : [
                            { key: 'all', label: 'All Categories' },
                            { key: 'Tops', label: 'Tops (14)' },
                            { key: 'Blazers', label: 'Blazers (3)' },
                            { key: 'T-Shirts', label: 'T-Shirts (2)' },
                            { key: 'Dress', label: 'Dress (6)' },
                            { key: 'Sweaters', label: 'Sweaters (4)' },
                            { key: 'Knitwear', label: 'Knitwear (5)' },
                            { key: 'Men Collection', label: 'Men Collection (8)' },
                          ]
                    ).map((item) => (
                      <li key={item.key}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(item.key);
                            setOpenDropdown(null);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between cursor-pointer ${
                            selectedCategory === item.key
                              ? 'bg-[#093624] text-white font-bold'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{item.label}</span>
                          {selectedCategory === item.key && <Check size={12} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Availability Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('availability')}
                className={`w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${
                  openDropdown === 'availability' || selectedAvailability.length > 0
                    ? 'border-[#093624] text-[#093624] bg-[#093624]/5'
                    : 'border-gray-200 text-[#141414] hover:border-gray-300'
                }`}
              >
                <span className="truncate">
                  {selectedAvailability.length > 0
                    ? `Availability (${selectedAvailability.length})`
                    : 'Availability'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'availability' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'availability' && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b">
                    Availability
                  </h4>
                  <div className="space-y-2 text-xs font-satoshi-med">
                    {[
                      { key: 'on_sale', label: 'On Sale' },
                      { key: 'in_stock', label: 'In Stock' },
                      { key: 'out_stock', label: 'Out of Stock' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 cursor-pointer hover:text-[#093624]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes(item.key)}
                          onChange={() => toggleAvailability(item.key)}
                          className="rounded text-[#093624] focus:ring-[#093624] cursor-pointer"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Price Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('price')}
                className={`w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${
                  openDropdown === 'price' || priceRange < 10000
                    ? 'border-[#093624] text-[#093624] bg-[#093624]/5'
                    : 'border-gray-200 text-[#141414] hover:border-gray-300'
                }`}
              >
                <span className="truncate">
                  {priceRange < 10000 ? `≤ ${formatPrice(priceRange)}` : 'Price'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'price' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'price' && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-100 p-4 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 pb-1 border-b">
                    Filter by Price
                  </h4>
                  <input
                    type="range"
                    min={1000}
                    max={10000}
                    step={250}
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full accent-[#093624] cursor-pointer mb-3"
                  />
                  <div className="flex items-center justify-between text-xs font-satoshi-bold text-[#141414]">
                    <span>{formatPrice(1000)}</span>
                    <span className="text-[#093624] font-extrabold">{formatPrice(priceRange)}</span>
                  </div>
                  {priceRange < 10000 && (
                    <button
                      onClick={() => setPriceRange(10000)}
                      className="mt-3 text-[11px] text-gray-500 hover:text-[#093624] underline block w-full text-center"
                    >
                      Reset Price
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. Size Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('size')}
                className={`w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${
                  openDropdown === 'size' || selectedSizes.length > 0
                    ? 'border-[#093624] text-[#093624] bg-[#093624]/5'
                    : 'border-gray-200 text-[#141414] hover:border-gray-300'
                }`}
              >
                <span className="truncate">
                  {selectedSizes.length > 0 ? `Size (${selectedSizes.length})` : 'Size'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'size' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'size' && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b">
                    Size
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SIZE_OPTIONS.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`py-1.5 text-xs font-satoshi-bold rounded-xs border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#093624] text-[#F9F295] border-[#093624]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Color Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('color')}
                className={`w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${
                  openDropdown === 'color' || selectedColors.length > 0
                    ? 'border-[#093624] text-[#093624] bg-[#093624]/5'
                    : 'border-gray-200 text-[#141414] hover:border-gray-300'
                }`}
              >
                <span className="truncate">
                  {selectedColors.length > 0 ? `Color (${selectedColors.length})` : 'Color'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'color' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'color' && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-100 p-3.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b">
                    Color Palette
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-satoshi-med">
                    {COLOR_OPTIONS.map((c) => {
                      const isSelected = selectedColors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => toggleColor(c.name)}
                          className={`flex items-center gap-2 p-1.5 rounded-xs border text-left cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#093624] bg-[#093624]/10 font-bold'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="truncate text-gray-700">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Status Bar, Active Chips & Sort Selector */}
          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#55585B] font-satoshi-regular">
                Showing{' '}
                <strong className="text-[#141414]">
                  {filteredProducts.length === 0
                    ? 0
                    : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                        currentPage * itemsPerPage,
                        filteredProducts.length
                      )}`}
                </strong>{' '}
                of <strong className="text-[#141414]">{filteredProducts.length}</strong> results
              </span>

              {/* Active Filter Chips */}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-[#093624] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedAvailability.map((avail) => (
                <span
                  key={avail}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {avail.replace('_', ' ')}
                  <button onClick={() => toggleAvailability(avail)} className="hover:text-[#093624] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}

              {priceRange < 10000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200">
                  ≤ {formatPrice(priceRange)}
                  <button onClick={() => setPriceRange(10000)} className="hover:text-[#093624] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedSizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200"
                >
                  Size: {size}
                  <button onClick={() => toggleSize(size)} className="hover:text-[#093624] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}

              {selectedColors.map((col) => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200"
                >
                  Color: {col}
                  <button onClick={() => toggleColor(col)} className="hover:text-[#093624] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-[#093624] hover:underline font-bold ml-1 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} />
                  Clear All
                </button>
              )}
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#55585B] font-satoshi-med whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 border border-gray-200 rounded-sm text-xs font-satoshi-med text-[#141414] focus:outline-hidden focus:border-[#093624] bg-white cursor-pointer"
              >
                <option value="default">Default Sorting</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Grid Area */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-bold text-gray-800 mb-2">No products found</p>
              <p className="text-sm text-gray-500 mb-6">
                Try loosening your filters or resetting your search.
              </p>
              <Button variant="primary" onClick={resetAllFilters}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* 5. Pagination Area */}
          {totalPages > 1 && (
            <div className="mt-14 pt-8 border-t border-gray-100 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-[#093624] text-[#F9F295] shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#093624] hover:text-[#093624]'
                  }`}
                >
                  {page < 10 ? `0${page}` : page}
                </button>
              ))}

              {currentPage < totalPages && (
                <button
                  onClick={() => {
                    setCurrentPage((prev) => prev + 1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-4 h-10 rounded-full text-xs font-satoshi-bold bg-white text-gray-700 border border-gray-200 hover:border-[#093624] hover:text-[#093624] transition-all cursor-pointer flex items-center justify-center"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
