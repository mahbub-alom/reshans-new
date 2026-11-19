import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X, Check, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useShop } from '../../context/ShopContext';
import { Button } from '../common/Button';

export interface CategoryCircleItem {
  id: string;
  label: string;
  image: string;
  filterKey: string;
}

export interface DedicatedProductCatalogProps {
  pageTitle: string;
  pageSubtitle: string;
  breadcrumbLabel: string;
  categoryCircles?: CategoryCircleItem[];
  defaultCategoryFilter?: string;
  departmentFilter?: 'all' | 'men' | 'women';
  isNewArrivalsOnly?: boolean;
  isOnSaleOnly?: boolean;
  isCollectionsOnly?: boolean;
  collectionPresets?: { id: string; label: string; filterKey: string; count?: number }[];
  categoryOptions?: { key: string; label: string }[];
}

const DEFAULT_COLOR_OPTIONS = [
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

const DEFAULT_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

export const DedicatedProductCatalog: React.FC<DedicatedProductCatalogProps> = ({
  pageTitle,
  pageSubtitle,
  breadcrumbLabel,
  categoryCircles,
  defaultCategoryFilter = 'all',
  departmentFilter,
  isNewArrivalsOnly,
  isOnSaleOnly,
  isCollectionsOnly,
  collectionPresets,
  categoryOptions,
}) => {
  const { products, navigate, formatPrice } = useShop();

  // Active filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategoryFilter);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Active opened dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setSelectedCategory(defaultCategoryFilter);
    setSelectedCollection('all');
    setSelectedAvailability([]);
    setPriceRange(10000);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
    setSortBy('default');
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' && selectedCategory !== defaultCategoryFilter ? 1 : 0) +
    (selectedCollection !== 'all' ? 1 : 0) +
    selectedAvailability.length +
    (priceRange < 10000 ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (searchQuery.trim() ? 1 : 0);

  // Dynamic filter products
  const filteredProducts = useMemo(() => {
    let result = [...(products && products.length ? products : [])];

    // Department constraint (Men vs Women)
    if (departmentFilter && departmentFilter !== 'all') {
      result = result.filter((p) => {
        if (p.department) {
          return p.department === departmentFilter || p.department === 'all';
        }
        if (departmentFilter === 'men') {
          return (
            p.category.toLowerCase().includes('men') ||
            p.category.toLowerCase().includes('shirt') ||
            p.category.toLowerCase().includes('trouser') ||
            p.category.toLowerCase().includes('outerwear')
          );
        }
        if (departmentFilter === 'women') {
          return (
            p.category.toLowerCase().includes('women') ||
            p.category.toLowerCase().includes('dress') ||
            p.category.toLowerCase().includes('tops') ||
            p.category.toLowerCase().includes('bag')
          );
        }
        return true;
      });
    }

    // New arrivals constraint
    if (isNewArrivalsOnly) {
      result = result.filter((p) => p.isNewArrival || p.badge === 'new' || p.tabCategory === 'new');
    }

    // On sale constraint
    if (isOnSaleOnly) {
      result = result.filter(
        (p) =>
          p.badge === 'sale' ||
          (p.originalPrice && p.originalPrice > p.price) ||
          !!p.discount
      );
    }

    // Collections preset filter
    if (selectedCollection !== 'all') {
      const col = selectedCollection.toLowerCase();
      result = result.filter(
        (p) =>
          p.category.toLowerCase().includes(col) ||
          p.name.toLowerCase().includes(col) ||
          p.description.toLowerCase().includes(col)
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Subcategory / Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'new') {
        result = result.filter((p) => p.isNewArrival || p.badge === 'new');
      } else if (selectedCategory === 'sale') {
        result = result.filter((p) => p.badge === 'sale' || p.originalPrice || p.discount);
      } else {
        result = result.filter(
          (p) =>
            p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            p.name.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      result = result.filter((p) => {
        if (selectedAvailability.includes('in_stock') && p.inStock) return true;
        if (
          selectedAvailability.includes('on_sale') &&
          (p.originalPrice || p.discount || p.badge === 'sale')
        )
          return true;
        if (selectedAvailability.includes('out_stock') && !p.inStock) return true;
        return false;
      });
    }

    // Price filter
    result = result.filter((p) => p.price <= priceRange);

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter(
        (p) => p.colors && p.colors.some((c) => selectedColors.includes(c.name))
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
    products,
    departmentFilter,
    isNewArrivalsOnly,
    isOnSaleOnly,
    selectedCollection,
    selectedCategory,
    defaultCategoryFilter,
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
      {/* 1. Breadcrumb Hero Area */}
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
            <span className="text-[#141414] font-satoshi-bold">{breadcrumbLabel}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#141414] font-satoshi-bold tracking-tight mb-2">
            {pageTitle}
          </h1>
          <p className="text-sm md:text-base text-[#55585B] font-satoshi-regular max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Optional Categories Circular Slider / Row */}
      {categoryCircles && categoryCircles.length > 0 && (
        <section className="pt-12 pb-6 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto pb-4 no-scrollbar">
              {categoryCircles.map((cat) => {
                const isSelected = selectedCategory === cat.filterKey;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryCircleClick(cat.filterKey)}
                    className="flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-hidden"
                  >
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                        isSelected
                          ? 'ring-2 ring-[#093624] scale-105'
                          : 'border border-gray-200 group-hover:border-[#093624] group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/assets/img/fashion-2/category/cat-1.jpg';
                        }}
                      />
                    </div>
                    <span
                      className={`mt-2.5 text-xs sm:text-sm font-satoshi-med transition-colors ${
                        isSelected
                          ? 'text-[#093624] font-bold'
                          : 'text-[#141414] group-hover:text-[#093624]'
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
      )}

      {/* 2.5 Optional Curated Collections Pills */}
      {collectionPresets && collectionPresets.length > 0 && (
        <section className="pt-8 pb-4 border-b border-gray-100 bg-[#FAF9F8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-xs uppercase tracking-wider font-bold text-[#55585B] mr-2 shrink-0">
                Collections:
              </span>
              <button
                onClick={() => {
                  setSelectedCollection('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-satoshi-bold transition-all shrink-0 cursor-pointer ${
                  selectedCollection === 'all'
                    ? 'bg-[#093624] text-[#F9F295] shadow-xs'
                    : 'bg-white text-[#141414] border border-gray-200 hover:border-[#093624]'
                }`}
              >
                All Curated
              </button>
              {collectionPresets.map((col) => {
                const isActive = selectedCollection === col.filterKey;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedCollection(col.filterKey);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-satoshi-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#093624] text-[#F9F295] shadow-xs'
                        : 'bg-white text-[#141414] border border-gray-200 hover:border-[#093624]'
                    }`}
                  >
                    <span>{col.label}</span>
                    {col.count !== undefined && (
                      <span className="text-[10px] opacity-80">({col.count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Top Filter Bar & Interactive Dropdowns */}
      <section className="py-8 bg-white" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    Subcategories
                  </h4>
                  <ul className="space-y-1.5 text-xs font-satoshi-med text-[#141414] max-h-60 overflow-y-auto">
                    {(
                      categoryOptions || [
                        { key: 'all', label: 'All Categories' },
                        { key: 'Tops', label: 'Tops' },
                        { key: 'Shirts', label: 'Shirts' },
                        { key: 'Bottoms', label: 'Bottoms & Trousers' },
                        { key: 'Outerwear', label: 'Outerwear & Jackets' },
                        { key: 'Knitwear', label: 'Knitwear & Sweaters' },
                        { key: 'Dress', label: 'Dresses' },
                        { key: 'Accessories', label: 'Bags & Accessories' },
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
                    ? `Status (${selectedAvailability.length})`
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
                      { key: 'on_sale', label: 'On Sale / Deals' },
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
                  {priceRange < 10000 ? `≤ ${formatPrice(priceRange)}` : 'Price Range'}
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
                    min={500}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full accent-[#093624] cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-xs font-satoshi-med text-gray-600 mt-2">
                    <span>{formatPrice(500)}</span>
                    <span className="font-bold text-[#093624]">{formatPrice(priceRange)}</span>
                  </div>
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
                  {selectedSizes.length > 0 ? `Sizes (${selectedSizes.length})` : 'Sizes'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'size' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'size' && (
                <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b">
                    Select Sizes
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {DEFAULT_SIZE_OPTIONS.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`py-1.5 px-2 border rounded-xs font-satoshi-med transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#093624] bg-[#093624] text-white font-bold'
                              : 'border-gray-200 hover:border-gray-400 text-gray-700'
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
                  {selectedColors.length > 0 ? `Colors (${selectedColors.length})` : 'Colors'}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openDropdown === 'color' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'color' && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b">
                    Select Colors
                  </h4>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {DEFAULT_COLOR_OPTIONS.map((col) => {
                      const isSelected = selectedColors.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => toggleColor(col.name)}
                          className="w-full flex items-center justify-between py-1 px-2 rounded-xs hover:bg-gray-50 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs"
                              style={{ backgroundColor: col.hex }}
                            />
                            <span className="font-satoshi-med text-gray-700">{col.name}</span>
                          </div>
                          {isSelected && <Check size={12} className="text-[#093624]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Pills + Search + Sort Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* Search Input Box */}
            <div className="relative min-w-[240px] flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search within this page..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-xs sm:text-sm font-satoshi-med focus:outline-hidden focus:border-[#093624]"
              />
              <Search size={15} className="absolute left-3 top-3 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & Result Count */}
            <div className="flex items-center gap-4 text-xs sm:text-sm font-satoshi-med">
              <span className="text-[#55585B]">
                Showing <strong className="text-[#141414]">{paginatedProducts.length}</strong> of{' '}
                <strong className="text-[#141414]">{filteredProducts.length}</strong> products
              </span>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="py-1.5 px-3 border border-gray-200 rounded-sm text-xs sm:text-sm font-satoshi-med bg-white focus:outline-hidden focus:border-[#093624] cursor-pointer"
                >
                  <option value="default">Default Sorting</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Tags with Clear Button */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-gray-200">
              <span className="text-xs text-gray-500 font-satoshi-med">Active filters:</span>

              {selectedCategory !== 'all' && selectedCategory !== defaultCategoryFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs rounded-full font-satoshi-med text-[#141414]">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X size={12} className="hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedCollection !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#093624]/10 text-xs rounded-full font-satoshi-bold text-[#093624]">
                  Collection: {selectedCollection}
                  <button onClick={() => setSelectedCollection('all')}>
                    <X size={12} className="hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedAvailability.map((avail) => (
                <span
                  key={avail}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs rounded-full font-satoshi-med text-[#141414]"
                >
                  {avail === 'on_sale' ? 'On Sale' : avail === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  <button onClick={() => toggleAvailability(avail)}>
                    <X size={12} className="hover:text-red-500" />
                  </button>
                </span>
              ))}

              {priceRange < 10000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs rounded-full font-satoshi-med text-[#141414]">
                  Max: {formatPrice(priceRange)}
                  <button onClick={() => setPriceRange(10000)}>
                    <X size={12} className="hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs rounded-full font-satoshi-med text-[#141414]"
                >
                  Size: {s}
                  <button onClick={() => toggleSize(s)}>
                    <X size={12} className="hover:text-red-500" />
                  </button>
                </span>
              ))}

              {selectedColors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs rounded-full font-satoshi-med text-[#141414]"
                >
                  Color: {c}
                  <button onClick={() => toggleColor(c)}>
                    <X size={12} className="hover:text-red-500" />
                  </button>
                </span>
              ))}

              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-satoshi-med ml-2 cursor-pointer underline"
              >
                <RotateCcw size={12} />
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Products Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#FAFAFA] rounded-md border border-gray-100">
              <SlidersHorizontal size={40} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-2">
                No products found
              </h3>
              <p className="text-sm text-[#55585B] font-satoshi-regular mb-6 max-w-sm mx-auto">
                We couldn&apos;t find any apparel matching your active filters. Try adjusting your search query or reset the filters.
              </p>
              <Button variant="black" size="md" onClick={resetAllFilters}>
                Reset All Filters
              </Button>
            </div>
          )}

          {/* 5. Pagination Area */}
          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3.5 py-2 border border-gray-200 rounded-xs text-xs font-satoshi-bold text-[#141414] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xs text-xs font-satoshi-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#093624] text-[#F9F295] shadow-xs'
                      : 'border border-gray-200 hover:border-gray-400 text-[#141414]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3.5 py-2 border border-gray-200 rounded-xs text-xs font-satoshi-bold text-[#141414] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
