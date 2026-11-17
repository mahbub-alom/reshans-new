(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/views/ShopPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShopPage",
    ()=>ShopPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/product/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ShopContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ShopContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
// Category circles data matching reference product-filter-top.html
const CATEGORY_CIRCLES = [
    {
        id: 'caps',
        label: 'Caps',
        image: '/assets/img/fashion-1/categories/category-7.jpg',
        filterKey: 'Caps'
    },
    {
        id: 'new',
        label: 'New Arrivals',
        image: '/assets/img/fashion-1/categories/category-5.jpg',
        filterKey: 'new'
    },
    {
        id: 'workleisure',
        label: 'Workleisure',
        image: '/assets/img/fashion-1/categories/category-11.jpg',
        filterKey: 'Workleisure'
    },
    {
        id: 'bottoms',
        label: 'Bottoms',
        image: '/assets/img/fashion-1/categories/category-12.jpg',
        filterKey: 'Bottoms'
    },
    {
        id: 'tops',
        label: 'Tops',
        image: '/assets/img/fashion-1/categories/category-13.jpg',
        filterKey: 'Tops'
    },
    {
        id: 'dresses',
        label: 'Dresses',
        image: '/assets/img/fashion-1/categories/category-14.jpg',
        filterKey: 'Dress'
    },
    {
        id: 'shorts',
        label: 'Shorts',
        image: '/assets/img/fashion-1/categories/category-15.jpg',
        filterKey: 'Shorts'
    },
    {
        id: 'clothes',
        label: 'Clothes',
        image: '/assets/img/fashion-1/categories/category-16.jpg',
        filterKey: 'Clothes'
    }
];
const COLOR_OPTIONS = [
    {
        name: 'Melon',
        hex: '#D3E0AA'
    },
    {
        name: 'Electric Black',
        hex: '#2B2929'
    },
    {
        name: 'Pastel Yellow',
        hex: '#F0E4CE'
    },
    {
        name: 'Endless Sky',
        hex: '#08457F'
    },
    {
        name: 'Earthy Khaki',
        hex: '#EEAE76'
    },
    {
        name: 'Camo Light',
        hex: '#836953'
    },
    {
        name: 'American Denim',
        hex: '#4F738E'
    },
    {
        name: 'Gray',
        hex: '#F2F2F2'
    },
    {
        name: 'Rose Gold',
        hex: '#B76E79'
    },
    {
        name: 'Forest Green',
        hex: '#093624'
    }
];
const SIZE_OPTIONS = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL'
];
const BRAND_OPTIONS = [
    {
        id: 'reshans-atelier',
        name: 'Reshans Atelier',
        count: 12
    },
    {
        id: 'reshans-casual',
        name: 'Reshans Casual',
        count: 9
    },
    {
        id: 'urban-minimal',
        name: 'Urban Minimalist',
        count: 7
    },
    {
        id: 'heritage-knit',
        name: 'Heritage Knitwear',
        count: 6
    },
    {
        id: 'dhaka-couture',
        name: 'Dhaka Couture',
        count: 4
    }
];
const ShopPage = ()=>{
    _s();
    const { products, navigate, formatPrice, activeCategoryFilter, setActiveCategoryFilter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ShopContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShop"])();
    // Active filter states
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(activeCategoryFilter || 'all');
    const [selectedAvailability, setSelectedAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [priceRange, setPriceRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10000);
    const [selectedSizes, setSelectedSizes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedColors, setSelectedColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedBrands, setSelectedBrands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('default');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const itemsPerPage = 8;
    // Sync when activeCategoryFilter changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopPage.useEffect": ()=>{
            if (activeCategoryFilter) {
                setSelectedCategory(activeCategoryFilter);
                setCurrentPage(1);
            }
        }
    }["ShopPage.useEffect"], [
        activeCategoryFilter
    ]);
    // Active opened dropdown
    const [openDropdown, setOpenDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close dropdown on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopPage.useEffect": ()=>{
            const handleOutsideClick = {
                "ShopPage.useEffect.handleOutsideClick": (event)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setOpenDropdown(null);
                    }
                }
            }["ShopPage.useEffect.handleOutsideClick"];
            document.addEventListener('mousedown', handleOutsideClick);
            return ({
                "ShopPage.useEffect": ()=>document.removeEventListener('mousedown', handleOutsideClick)
            })["ShopPage.useEffect"];
        }
    }["ShopPage.useEffect"], []);
    const toggleDropdown = (name)=>{
        setOpenDropdown((prev)=>prev === name ? null : name);
    };
    const handleCategoryCircleClick = (filterKey)=>{
        if (selectedCategory === filterKey) {
            setSelectedCategory('all');
        } else {
            setSelectedCategory(filterKey);
        }
        setCurrentPage(1);
    };
    const toggleAvailability = (val)=>{
        setSelectedAvailability((prev)=>prev.includes(val) ? prev.filter((i)=>i !== val) : [
                ...prev,
                val
            ]);
        setCurrentPage(1);
    };
    const toggleSize = (size)=>{
        setSelectedSizes((prev)=>prev.includes(size) ? prev.filter((s)=>s !== size) : [
                ...prev,
                size
            ]);
        setCurrentPage(1);
    };
    const toggleColor = (colorName)=>{
        setSelectedColors((prev)=>prev.includes(colorName) ? prev.filter((c)=>c !== colorName) : [
                ...prev,
                colorName
            ]);
        setCurrentPage(1);
    };
    const toggleBrand = (brandName)=>{
        setSelectedBrands((prev)=>prev.includes(brandName) ? prev.filter((b)=>b !== brandName) : [
                ...prev,
                brandName
            ]);
        setCurrentPage(1);
    };
    const resetAllFilters = ()=>{
        setSelectedCategory('all');
        setSelectedAvailability([]);
        setPriceRange(10000);
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedBrands([]);
        setSearchQuery('');
        setSortBy('default');
        setCurrentPage(1);
    };
    const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + selectedAvailability.length + (priceRange < 10000 ? 1 : 0) + selectedSizes.length + selectedColors.length + selectedBrands.length + (searchQuery.trim() ? 1 : 0);
    // Filter & Sort Products
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[filteredProducts]": ()=>{
            let result = [
                ...products && products.length ? products : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"]
            ];
            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                result = result.filter({
                    "ShopPage.useMemo[filteredProducts]": (p)=>p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
                }["ShopPage.useMemo[filteredProducts]"]);
            }
            // Category filter
            if (selectedCategory !== 'all') {
                if (selectedCategory === 'new') {
                    result = result.filter({
                        "ShopPage.useMemo[filteredProducts]": (p)=>p.isNewArrival || p.badge === 'new'
                    }["ShopPage.useMemo[filteredProducts]"]);
                } else {
                    result = result.filter({
                        "ShopPage.useMemo[filteredProducts]": (p)=>p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || p.name.toLowerCase().includes(selectedCategory.toLowerCase())
                    }["ShopPage.useMemo[filteredProducts]"]);
                }
            }
            // Availability filter
            if (selectedAvailability.length > 0) {
                result = result.filter({
                    "ShopPage.useMemo[filteredProducts]": (p)=>{
                        if (selectedAvailability.includes('in_stock') && p.inStock) return true;
                        if (selectedAvailability.includes('on_sale') && (p.originalPrice || p.discount || p.badge === 'sale')) return true;
                        if (selectedAvailability.includes('out_stock') && !p.inStock) return true;
                        return false;
                    }
                }["ShopPage.useMemo[filteredProducts]"]);
            }
            // Price filter
            result = result.filter({
                "ShopPage.useMemo[filteredProducts]": (p)=>p.price <= priceRange
            }["ShopPage.useMemo[filteredProducts]"]);
            // Size filter
            if (selectedSizes.length > 0) {
                result = result.filter({
                    "ShopPage.useMemo[filteredProducts]": (p)=>p.sizes && p.sizes.some({
                            "ShopPage.useMemo[filteredProducts]": (s)=>selectedSizes.includes(s)
                        }["ShopPage.useMemo[filteredProducts]"])
                }["ShopPage.useMemo[filteredProducts]"]);
            }
            // Color filter
            if (selectedColors.length > 0) {
                result = result.filter({
                    "ShopPage.useMemo[filteredProducts]": (p)=>p.colors && p.colors.some({
                            "ShopPage.useMemo[filteredProducts]": (c)=>selectedColors.includes(c.name)
                        }["ShopPage.useMemo[filteredProducts]"])
                }["ShopPage.useMemo[filteredProducts]"]);
            }
            // Sorting
            switch(sortBy){
                case 'price-asc':
                    result.sort({
                        "ShopPage.useMemo[filteredProducts]": (a, b)=>a.price - b.price
                    }["ShopPage.useMemo[filteredProducts]"]);
                    break;
                case 'price-desc':
                    result.sort({
                        "ShopPage.useMemo[filteredProducts]": (a, b)=>b.price - a.price
                    }["ShopPage.useMemo[filteredProducts]"]);
                    break;
                case 'rating':
                    result.sort({
                        "ShopPage.useMemo[filteredProducts]": (a, b)=>b.rating - a.rating
                    }["ShopPage.useMemo[filteredProducts]"]);
                    break;
                case 'newest':
                    result.sort({
                        "ShopPage.useMemo[filteredProducts]": (a, b)=>(b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)
                    }["ShopPage.useMemo[filteredProducts]"]);
                    break;
                default:
                    break;
            }
            return result;
        }
    }["ShopPage.useMemo[filteredProducts]"], [
        selectedCategory,
        selectedAvailability,
        priceRange,
        selectedSizes,
        selectedColors,
        selectedBrands,
        searchQuery,
        sortBy
    ]);
    // Paginated items
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopPage.useMemo[paginatedProducts]": ()=>{
            const start = (currentPage - 1) * itemsPerPage;
            return filteredProducts.slice(start, start + itemsPerPage);
        }
    }["ShopPage.useMemo[paginatedProducts]"], [
        filteredProducts,
        currentPage
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-[#F9F9F9] py-14 text-center border-b border-gray-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#55585B] font-satoshi-med mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>navigate('/'),
                                    className: "hover:text-[#093624] transition-colors cursor-pointer",
                                    children: "Home"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#141414] font-satoshi-bold",
                                    children: "Shop"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl md:text-5xl font-extrabold text-[#141414] font-satoshi-bold tracking-tight mb-2",
                            children: "New Arrival"
                        }, void 0, false, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 249,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm md:text-base text-[#55585B] font-satoshi-regular",
                            children: "Shop through our latest selection of Fashion"
                        }, void 0, false, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/views/ShopPage.tsx",
                    lineNumber: 238,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/ShopPage.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "pt-12 pb-6 border-b border-gray-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-start sm:justify-between gap-6 overflow-x-auto pb-4 no-scrollbar",
                        children: CATEGORY_CIRCLES.map((cat)=>{
                            const isSelected = selectedCategory === cat.filterKey;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleCategoryCircleClick(cat.filterKey),
                                className: "flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all duration-300 ${isSelected ? 'ring-2 ring-[#093624] scale-105' : 'border border-gray-200 group-hover:border-[#093624] group-hover:scale-105'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: cat.image,
                                            alt: cat.label,
                                            className: "w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110",
                                            onError: (e)=>{
                                                e.target.src = '/assets/img/fashion-2/category/cat-1.jpg';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 277,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/ShopPage.tsx",
                                        lineNumber: 270,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `mt-2.5 text-xs sm:text-sm font-satoshi-med transition-colors ${isSelected ? 'text-[#093624] font-bold' : 'text-[#141414] group-hover:text-[#093624]'}`,
                                        children: cat.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/ShopPage.tsx",
                                        lineNumber: 287,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, cat.id, true, {
                                fileName: "[project]/src/views/ShopPage.tsx",
                                lineNumber: 265,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/views/ShopPage.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/views/ShopPage.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/ShopPage.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-8 bg-white",
                ref: dropdownRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-6 border-b border-gray-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>toggleDropdown('category'),
                                            className: `w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${openDropdown === 'category' || selectedCategory !== 'all' ? 'border-[#093624] text-[#093624] bg-[#093624]/5' : 'border-gray-200 text-[#141414] hover:border-gray-300'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: selectedCategory !== 'all' ? selectedCategory : 'Category'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: `transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        openDropdown === 'category' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b",
                                                    children: "Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-1.5 text-xs font-satoshi-med text-[#141414]",
                                                    children: [
                                                        {
                                                            key: 'all',
                                                            label: 'All Categories'
                                                        },
                                                        {
                                                            key: 'Tops',
                                                            label: 'Tops (14)'
                                                        },
                                                        {
                                                            key: 'Blazers',
                                                            label: 'Blazers (3)'
                                                        },
                                                        {
                                                            key: 'T-Shirts',
                                                            label: 'T-Shirts (2)'
                                                        },
                                                        {
                                                            key: 'Dress',
                                                            label: 'Dress (6)'
                                                        },
                                                        {
                                                            key: 'Sweaters',
                                                            label: 'Sweaters (4)'
                                                        },
                                                        {
                                                            key: 'Knitwear',
                                                            label: 'Knitwear (5)'
                                                        },
                                                        {
                                                            key: 'Men Collection',
                                                            label: 'Men Collection (8)'
                                                        }
                                                    ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    setSelectedCategory(item.key);
                                                                    setOpenDropdown(null);
                                                                    setCurrentPage(1);
                                                                },
                                                                className: `w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between cursor-pointer ${selectedCategory === item.key ? 'bg-[#093624] text-white font-bold' : 'hover:bg-gray-50 text-gray-700'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: item.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    selectedCategory === item.key && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                                        lineNumber: 359,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/views/ShopPage.tsx",
                                                                lineNumber: 345,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, item.key, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 329,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>toggleDropdown('availability'),
                                            className: `w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${openDropdown === 'availability' || selectedAvailability.length > 0 ? 'border-[#093624] text-[#093624] bg-[#093624]/5' : 'border-gray-200 text-[#141414] hover:border-gray-300'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: selectedAvailability.length > 0 ? `Availability (${selectedAvailability.length})` : 'Availability'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: `transition-transform duration-200 ${openDropdown === 'availability' ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 370,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        openDropdown === 'availability' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 top-full mt-2 w-52 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b",
                                                    children: "Availability"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-xs font-satoshi-med",
                                                    children: [
                                                        {
                                                            key: 'on_sale',
                                                            label: 'On Sale'
                                                        },
                                                        {
                                                            key: 'in_stock',
                                                            label: 'In Stock'
                                                        },
                                                        {
                                                            key: 'out_stock',
                                                            label: 'Out of Stock'
                                                        }
                                                    ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-2 cursor-pointer hover:text-[#093624]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: selectedAvailability.includes(item.key),
                                                                    onChange: ()=>toggleAvailability(item.key),
                                                                    className: "rounded text-[#093624] focus:ring-[#093624] cursor-pointer"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: item.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, item.key, true, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 393,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>toggleDropdown('price'),
                                            className: `w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${openDropdown === 'price' || priceRange < 10000 ? 'border-[#093624] text-[#093624] bg-[#093624]/5' : 'border-gray-200 text-[#141414] hover:border-gray-300'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: priceRange < 10000 ? `≤ ${formatPrice(priceRange)}` : 'Price'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 432,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: `transition-transform duration-200 ${openDropdown === 'price' ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 423,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        openDropdown === 'price' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 top-full mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-100 p-4 z-30 animate-in fade-in slide-in-from-top-1 duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 pb-1 border-b",
                                                    children: "Filter by Price"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: 1000,
                                                    max: 10000,
                                                    step: 250,
                                                    value: priceRange,
                                                    onChange: (e)=>{
                                                        setPriceRange(Number(e.target.value));
                                                        setCurrentPage(1);
                                                    },
                                                    className: "w-full accent-[#093624] cursor-pointer mb-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between text-xs font-satoshi-bold text-[#141414]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: formatPrice(1000)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[#093624] font-extrabold",
                                                            children: formatPrice(priceRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                priceRange < 10000 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setPriceRange(10000),
                                                    className: "mt-3 text-[11px] text-gray-500 hover:text-[#093624] underline block w-full text-center",
                                                    children: "Reset Price"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 444,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 422,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>toggleDropdown('size'),
                                            className: `w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${openDropdown === 'size' || selectedSizes.length > 0 ? 'border-[#093624] text-[#093624] bg-[#093624]/5' : 'border-gray-200 text-[#141414] hover:border-gray-300'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: selectedSizes.length > 0 ? `Size (${selectedSizes.length})` : 'Size'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: `transition-transform duration-200 ${openDropdown === 'size' ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 490,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        openDropdown === 'size' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b",
                                                    children: "Size"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-1.5",
                                                    children: SIZE_OPTIONS.map((size)=>{
                                                        const isSelected = selectedSizes.includes(size);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>toggleSize(size),
                                                            className: `py-1.5 text-xs font-satoshi-bold rounded-xs border transition-colors cursor-pointer ${isSelected ? 'bg-[#093624] text-[#F9F295] border-[#093624]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`,
                                                            children: size
                                                        }, size, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 507,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 499,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>toggleDropdown('color'),
                                            className: `w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${openDropdown === 'color' || selectedColors.length > 0 ? 'border-[#093624] text-[#093624] bg-[#093624]/5' : 'border-gray-200 text-[#141414] hover:border-gray-300'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: selectedColors.length > 0 ? `Color (${selectedColors.length})` : 'Color'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: `transition-transform duration-200 ${openDropdown === 'color' ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 540,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 528,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        openDropdown === 'color' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-100 p-3.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b",
                                                    children: "Color Palette"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2 text-xs font-satoshi-med",
                                                    children: COLOR_OPTIONS.map((c)=>{
                                                        const isSelected = selectedColors.includes(c.name);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>toggleColor(c.name),
                                                            className: `flex items-center gap-2 p-1.5 rounded-xs border text-left cursor-pointer transition-colors ${isSelected ? 'border-[#093624] bg-[#093624]/10 font-bold' : 'border-gray-100 hover:border-gray-200'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-4 h-4 rounded-full border border-gray-300 shrink-0",
                                                                    style: {
                                                                        backgroundColor: c.hex
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                                    lineNumber: 567,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate text-gray-700",
                                                                    children: c.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                                    lineNumber: 571,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, c.name, true, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 549,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 527,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>toggleDropdown('brand'),
                                            className: `w-full py-2.5 px-3.5 rounded-sm border text-xs sm:text-sm font-satoshi-med flex items-center justify-between transition-all cursor-pointer ${openDropdown === 'brand' || selectedBrands.length > 0 ? 'border-[#093624] text-[#093624] bg-[#093624]/5' : 'border-gray-200 text-[#141414] hover:border-gray-300'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: selectedBrands.length > 0 ? `Brand (${selectedBrands.length})` : 'Brand'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    size: 14,
                                                    className: `transition-transform duration-200 ${openDropdown === 'brand' ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 582,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        openDropdown === 'brand' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 pb-1 border-b",
                                                    children: "Brand Label"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5 text-xs font-satoshi-med",
                                                    children: BRAND_OPTIONS.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center justify-between py-1 px-1 rounded-xs hover:bg-gray-50 cursor-pointer text-gray-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: selectedBrands.includes(b.name),
                                                                            onChange: ()=>toggleBrand(b.name),
                                                                            className: "rounded text-[#093624] focus:ring-[#093624] cursor-pointer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                                            lineNumber: 614,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: b.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                                            lineNumber: 620,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                                    lineNumber: 613,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] text-gray-400",
                                                                    children: [
                                                                        "(",
                                                                        b.count,
                                                                        ")"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                                    lineNumber: 622,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, b.id, true, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 609,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 603,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 581,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-[#55585B] font-satoshi-regular",
                                            children: [
                                                "Showing",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "text-[#141414]",
                                                    children: filteredProducts.length === 0 ? 0 : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredProducts.length)}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 636,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                ' ',
                                                "of ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "text-[#141414]",
                                                    children: filteredProducts.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 20
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " results"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 634,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        selectedCategory !== 'all' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200",
                                            children: [
                                                selectedCategory,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSelectedCategory('all'),
                                                    className: "hover:text-[#093624] cursor-pointer",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 651,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 649,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        selectedAvailability.map((avail)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200",
                                                children: [
                                                    avail.replace('_', ' '),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleAvailability(avail),
                                                        className: "hover:text-[#093624] cursor-pointer",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 664,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                        lineNumber: 663,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, avail, true, {
                                                fileName: "[project]/src/views/ShopPage.tsx",
                                                lineNumber: 658,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))),
                                        priceRange < 10000 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200",
                                            children: [
                                                "≤ ",
                                                formatPrice(priceRange),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setPriceRange(10000),
                                                    className: "hover:text-[#093624] cursor-pointer",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                        lineNumber: 673,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 672,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 670,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        selectedSizes.map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200",
                                                children: [
                                                    "Size: ",
                                                    size,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleSize(size),
                                                        className: "hover:text-[#093624] cursor-pointer",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 685,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                        lineNumber: 684,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, size, true, {
                                                fileName: "[project]/src/views/ShopPage.tsx",
                                                lineNumber: 679,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))),
                                        selectedColors.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-satoshi-med bg-gray-100 text-gray-800 border border-gray-200",
                                                children: [
                                                    "Color: ",
                                                    col,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleColor(col),
                                                        className: "hover:text-[#093624] cursor-pointer",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/views/ShopPage.tsx",
                                                            lineNumber: 697,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/views/ShopPage.tsx",
                                                        lineNumber: 696,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, col, true, {
                                                fileName: "[project]/src/views/ShopPage.tsx",
                                                lineNumber: 691,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))),
                                        activeFiltersCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: resetAllFilters,
                                            className: "text-xs text-[#093624] hover:underline font-bold ml-1 flex items-center gap-1 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                    size: 11
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 708,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Clear All"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 703,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 633,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-[#55585B] font-satoshi-med whitespace-nowrap",
                                            children: "Sort by:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 716,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: sortBy,
                                            onChange: (e)=>setSortBy(e.target.value),
                                            className: "py-1.5 px-3 border border-gray-200 rounded-sm text-xs font-satoshi-med text-[#141414] focus:outline-hidden focus:border-[#093624] bg-white cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "default",
                                                    children: "Default Sorting"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 722,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "newest",
                                                    children: "Newest Arrivals"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 723,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "rating",
                                                    children: "Top Rated"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "price-asc",
                                                    children: "Price: Low to High"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "price-desc",
                                                    children: "Price: High to Low"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/views/ShopPage.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/views/ShopPage.tsx",
                                            lineNumber: 717,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 715,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 632,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/views/ShopPage.tsx",
                    lineNumber: 303,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/ShopPage.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "pb-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: [
                        paginatedProducts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-20 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-bold text-gray-800 mb-2",
                                    children: "No products found"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 738,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 mb-6",
                                    children: "Try loosening your filters or resetting your search."
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 739,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "primary",
                                    onClick: resetAllFilters,
                                    children: "Reset All Filters"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 742,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 737,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7",
                            children: paginatedProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$product$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductCard"], {
                                    product: product
                                }, product.id, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 749,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 747,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-14 pt-8 border-t border-gray-100 flex items-center justify-center gap-2",
                            children: [
                                Array.from({
                                    length: totalPages
                                }, (_, i)=>i + 1).map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setCurrentPage(page);
                                            window.scrollTo({
                                                top: 400,
                                                behavior: 'smooth'
                                            });
                                        },
                                        className: `w-10 h-10 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer flex items-center justify-center ${currentPage === page ? 'bg-[#093624] text-[#F9F295] shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#093624] hover:text-[#093624]'}`,
                                        children: page < 10 ? `0${page}` : page
                                    }, page, false, {
                                        fileName: "[project]/src/views/ShopPage.tsx",
                                        lineNumber: 758,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))),
                                currentPage < totalPages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setCurrentPage((prev)=>prev + 1);
                                        window.scrollTo({
                                            top: 400,
                                            behavior: 'smooth'
                                        });
                                    },
                                    className: "px-4 h-10 rounded-full text-xs font-satoshi-bold bg-white text-gray-700 border border-gray-200 hover:border-[#093624] hover:text-[#093624] transition-all cursor-pointer flex items-center justify-center",
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/ShopPage.tsx",
                                    lineNumber: 775,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/views/ShopPage.tsx",
                            lineNumber: 756,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/views/ShopPage.tsx",
                    lineNumber: 735,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/ShopPage.tsx",
                lineNumber: 734,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/ShopPage.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ShopPage, "9vU9T4NithbTFVE4KEiIOdVaHGc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ShopContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShop"]
    ];
});
_c = ShopPage;
var _c;
__turbopack_context__.k.register(_c, "ShopPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_views_ShopPage_tsx_1opt9764iav4r._.js.map