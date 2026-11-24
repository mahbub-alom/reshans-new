'use client';

import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Loader2,
} from 'lucide-react';
import { Product } from '../../../types';
import { useShop } from '../../../context/ShopContext';

const PAGE_OPTIONS = ['Shop', 'Men', 'Women', 'Collections'] as const;
const FABRIC_OPTIONS = ['100% Cotton', 'Organic Linen', 'Pure Silk', 'Peruvian Alpaca & Wool', 'Denim Twill', 'Cashmere Blend', 'Cotton Waffle', 'Spandex Stretch'];
const FIT_OPTIONS = ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized', 'Tailored'];

export const AdminProductsTab: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    brands,
    formatPrice,
    showToast,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPageFilter, setSelectedPageFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Cloudinary upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const initialForm = {
    name: '',
    page: 'Shop' as 'Shop' | 'Men' | 'Women' | 'Collections',
    category: '',
    categoryId: '',
    brand: brands[0]?.name || 'Reshans Atelier',
    price: 3500,
    originalPrice: 4200,
    discount: '-15%',
    badge: 'new' as 'new' | 'hot' | 'sale' | undefined,
    frontImage: '',
    backImage: '',
    description: 'Artisanal garment handcrafted from premium organic fibers tailored for modern elegance.',
    fabric: '100% Cotton',
    fit: 'Regular Fit',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 30,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
  };

  const [formData, setFormData] = useState(initialForm);

  // Active categories filtered by currently selected page in form
  const pageCategories = categories.filter(
    (c) => (c.page || 'Shop').toLowerCase() === formData.page.toLowerCase()
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const initialPage = 'Shop';
    const firstCat = categories.find((c) => (c.page || 'Shop') === initialPage);
    setFormData({
      ...initialForm,
      page: initialPage,
      category: firstCat?.name || '',
      categoryId: firstCat?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    const prodPage = (prod.page as any) || 'Shop';
    const prodCategory = prod.category;
    const matchedCat = categories.find((c) => c.name === prodCategory || c.id === prod.categoryId);

    setFormData({
      name: prod.name,
      page: prodPage,
      category: matchedCat?.name || prod.category || '',
      categoryId: matchedCat?.id || prod.categoryId || '',
      brand: prod.brand || brands[0]?.name || 'Reshans Atelier',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      discount: prod.discount || '',
      badge: prod.badge,
      frontImage: prod.frontImage,
      backImage: prod.backImage || prod.frontImage,
      description: prod.description,
      fabric: prod.fabric || '100% Cotton',
      fit: prod.fit || 'Regular Fit',
      sizes: prod.sizes || ['S', 'M', 'L', 'XL'],
      inStock: prod.inStock,
      stockCount: prod.stockCount !== undefined ? prod.stockCount : 25,
      isTrending: !!prod.isTrending,
      isBestSeller: !!prod.isBestSeller,
      isNewArrival: !!prod.isNewArrival,
    });
    setIsModalOpen(true);
  };

  // Handle Page Change in Product Form
  const handlePageChange = (newPage: 'Shop' | 'Men' | 'Women' | 'Collections') => {
    // When the selected page changes, reset the previously selected category and load the relevant categories
    const relevantCats = categories.filter(
      (c) => (c.page || 'Shop').toLowerCase() === newPage.toLowerCase()
    );
    const firstCat = relevantCats[0];
    setFormData((prev) => ({
      ...prev,
      page: newPage,
      category: firstCat ? firstCat.name : '',
      categoryId: firstCat ? firstCat.id : '',
    }));
  };

  // Handle Category Change in Product Form
  const handleCategoryChange = (catName: string) => {
    const matched = categories.find(
      (c) => c.name === catName && (c.page || 'Shop').toLowerCase() === formData.page.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      category: catName,
      categoryId: matched?.id || '',
    }));
  };

  // Handle Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          frontImage: data.url,
          backImage: prev.backImage || data.url,
        }));
        showToast('Product image uploaded to Cloudinary!');
      } else {
        showToast(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      showToast(err.message || 'Image upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required');
      return;
    }

    if (!formData.page) {
      showToast('Please select a page placement');
      return;
    }

    if (!formData.category) {
      showToast(`Please select a category for page ${formData.page}`);
      return;
    }

    if (!formData.frontImage) {
      showToast('Product image is required (upload to Cloudinary)');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        page: formData.page,
        category: formData.category,
        categoryId: formData.categoryId,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: formData.discount || undefined,
        badge: formData.badge,
        frontImage: formData.frontImage,
        backImage: formData.backImage || formData.frontImage,
        description: formData.description,
        fabric: formData.fabric,
        fit: formData.fit,
        sizes: formData.sizes,
        inStock: formData.inStock,
        stockCount: Number(formData.stockCount),
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        department: formData.page === 'Men' ? 'men' : formData.page === 'Women' ? 'women' : 'all',
      });
    } else {
      addProduct({
        name: formData.name,
        page: formData.page,
        category: formData.category,
        categoryId: formData.categoryId,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: formData.discount || undefined,
        badge: formData.badge,
        rating: 5,
        reviewsCount: 1,
        frontImage: formData.frontImage,
        backImage: formData.backImage || formData.frontImage,
        description: formData.description,
        fabric: formData.fabric,
        fit: formData.fit,
        sizes: formData.sizes,
        colors: [
          { name: 'Deep Forest', hex: '#093624' },
          { name: 'Oatmeal', hex: '#D6C8B4' },
        ],
        inStock: formData.inStock,
        stockCount: Number(formData.stockCount),
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        department: formData.page === 'Men' ? 'men' : formData.page === 'Women' ? 'women' : 'all',
      });
    }

    setIsModalOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPage =
      selectedPageFilter === 'all' ||
      (p.page || 'Shop').toLowerCase() === selectedPageFilter.toLowerCase();

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && p.inStock) ||
      (stockFilter === 'out_of_stock' && !p.inStock);

    return matchesSearch && matchesPage && matchesCat && matchesStock;
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Filters & Add Button */}
      <div className="bg-white border border-[#EBEBEB] p-4 sm:p-5 rounded-xs shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, SKU..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          />
        </div>

        {/* Dropdowns & CTA */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Page Filter */}
          <select
            value={selectedPageFilter}
            onChange={(e) => setSelectedPageFilter(e.target.value)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          >
            <option value="all">All Pages</option>
            {PAGE_OPTIONS.map((pg) => (
              <option key={pg} value={pg}>
                {pg} Page
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.page || 'Shop'})
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          >
            <option value="all">All Availability</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold uppercase tracking-wider flex items-center gap-2 transition-opacity cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Products Data Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <div className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body">
            Catalog Products ({filteredProducts.length} items)
          </div>
          <span className="text-[11px] text-gray-500 font-satoshi">
            Changes immediately synchronize with customer store
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-satoshi">
            <thead className="bg-[#F9F9F9] text-brand-body uppercase font-satoshi-bold text-[10px] tracking-wider border-b border-[#EBEBEB]">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Placement (Page / Category)</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Price (BDT ৳)</th>
                <th className="py-3 px-4">Stock Units</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Product Details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-gray-100 rounded-xs overflow-hidden shrink-0 border border-gray-100">
                        {p.frontImage ? (
                          <img
                            src={p.frontImage}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-satoshi-bold text-[#141414] truncate max-w-[200px]">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          SKU: {p.sku || p.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Placement (Page / Category) */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 bg-[#093624] text-[#F9F295] font-satoshi-bold text-[10px] rounded-xs uppercase">
                        {p.page || 'Shop'}
                      </span>
                      <span className="font-satoshi-bold text-[#141414] text-xs">
                        {p.category}
                      </span>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="py-3 px-4">
                    <div className="text-gray-700 font-satoshi">{p.brand || 'Reshans Atelier'}</div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <div className="font-satoshi-bold text-[#093624] tabular-nums">
                      {formatPrice(p.price)}
                    </div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div className="text-[10px] text-gray-400 line-through">
                        {formatPrice(p.originalPrice)}
                      </div>
                    )}
                  </td>

                  {/* Stock Units */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-satoshi-bold rounded-xs ${
                        p.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? `${p.stockCount ?? 20} in stock` : 'Out of stock'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 text-gray-500 hover:text-[#093624] cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <h3 className="text-base font-bold font-satoshi-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <AlertCircle size={18} className="hidden" />
                <span>✕</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Slim-Fit Cotton Crew in Waffle"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                />
              </div>

              {/* Brand selection */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Brand / Label
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing in BDT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price === 0 ? '' : formData.price}
                    placeholder="e.g. 3500"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, price: val === '' ? 0 : Number(val) });
                    }}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.originalPrice === 0 ? '' : formData.originalPrice}
                    placeholder="e.g. 4200"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, originalPrice: val === '' ? 0 : Number(val) });
                    }}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Discount Badge
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g. -20%"
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  />
                </div>
              </div>

              {/* Cloudinary Image Upload */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Product Image * (Upload to Cloudinary)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="prod-image-file"
                  />
                  <label
                    htmlFor="prod-image-file"
                    className={`px-4 py-2 bg-[#093624] text-[#F9F295] text-xs font-satoshi-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-2 hover:opacity-90 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>Upload Image to Cloudinary</span>
                      </>
                    )}
                  </label>
                </div>

                {formData.frontImage ? (
                  <div className="flex items-center gap-3 p-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs">
                    <img
                      src={formData.frontImage}
                      alt="Front preview"
                      className="w-14 h-16 object-cover rounded-xs border border-gray-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-500 font-mono truncate">
                        {formData.frontImage}
                      </p>
                      <span className="text-[10px] text-[#093624] font-satoshi-bold">
                        Cloudinary Hosted Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 border border-amber-200 rounded-xs">
                    Please upload an image for this product. Static or local images are disabled.
                  </p>
                )}
              </div>

              {/* Fabric & Fit fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Fabric / Material
                  </label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  >
                    {FABRIC_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Garment Fit
                  </label>
                  <select
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  >
                    {FIT_OPTIONS.map((fit) => (
                      <option key={fit} value={fit}>
                        {fit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 text-xs font-satoshi-bold border rounded-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#093624] text-[#F9F295] border-[#093624]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock and Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stockCount === 0 ? '0' : formData.stockCount || ''}
                    placeholder="e.g. 20"
                    onChange={(e) => {
                      const val = e.target.value;
                      const count = val === '' ? 0 : Number(val);
                      setFormData({
                        ...formData,
                        stockCount: count,
                        inStock: count > 0,
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi-bold text-[#141414]">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="accent-[#093624] w-4 h-4 rounded-xs"
                    />
                    <span>Available in Stock</span>
                  </label>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                />
              </div>

              {/* ============================================================== */}
              {/* NEW SECTION: Product Placement (Two dropdowns: Page & Category) */}
              {/* ============================================================== */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xs space-y-3">
                <div className="border-b border-emerald-200 pb-2">
                  <h4 className="text-xs font-satoshi-bold uppercase tracking-wider text-[#093624]">
                    Product Placement
                  </h4>
                  <p className="text-[11px] text-gray-600 font-satoshi">
                    Assign which storefront page and page category this product displays under.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First dropdown: Select Page */}
                  <div>
                    <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                      Select Page *
                    </label>
                    <select
                      required
                      value={formData.page}
                      onChange={(e) => handlePageChange(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                    >
                      {PAGE_OPTIONS.map((pg) => (
                        <option key={pg} value={pg}>
                          {pg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Second dropdown: Select Category */}
                  <div>
                    <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                      Select Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                    >
                      {pageCategories.length === 0 ? (
                        <option value="">No categories found for {formData.page}</option>
                      ) : (
                        pageCategories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBEBEB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-satoshi-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] text-xs font-satoshi-bold uppercase tracking-wider rounded-xs transition-opacity cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in duration-150">
            <div className="w-12 h-12 bg-[#F9F295]/60 text-[#093624] rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] mb-1">
              Delete Product?
            </h3>
            <p className="text-xs text-gray-500 font-satoshi mb-5">
              This product will be immediately removed from the customer catalog and shop filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-satoshi-bold text-gray-700 hover:bg-gray-100 rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-[#141414] hover:bg-black text-[#F9F295] text-xs font-satoshi-bold rounded-xs cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
