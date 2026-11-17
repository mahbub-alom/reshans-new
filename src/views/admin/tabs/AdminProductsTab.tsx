'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { Product } from '../../../types';
import { useShop } from '../../../context/ShopContext';
import { Button } from '../../../components/common/Button';

const PRESET_IMAGES = [
  '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-2/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-3/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-4/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-5/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-6/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-7/front-img-1.jpg',
  '/assets/img/fashion-1/product/product-8/front-img-1.jpg',
];

export const AdminProductsTab: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    brands,
    formatPrice,
    navigate,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    name: '',
    category: categories[0]?.name || 'Men Collection',
    brand: brands[0]?.name || 'Reshans Atelier',
    price: 3500,
    originalPrice: 4200,
    discount: '-15%',
    badge: 'new' as 'new' | 'hot' | 'sale' | undefined,
    frontImage: PRESET_IMAGES[0],
    backImage: PRESET_IMAGES[1],
    description: 'Artisanal garment handcrafted from premium organic fibers tailored for modern elegance.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 30,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      brand: prod.brand || brands[0]?.name || 'Reshans Atelier',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      discount: prod.discount || '',
      badge: prod.badge,
      frontImage: prod.frontImage,
      backImage: prod.backImage || prod.frontImage,
      description: prod.description,
      sizes: prod.sizes,
      inStock: prod.inStock,
      stockCount: prod.stockCount !== undefined ? prod.stockCount : 25,
      isTrending: !!prod.isTrending,
      isBestSeller: !!prod.isBestSeller,
      isNewArrival: !!prod.isNewArrival,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: formData.discount || undefined,
        badge: formData.badge,
        frontImage: formData.frontImage,
        backImage: formData.backImage,
        description: formData.description,
        sizes: formData.sizes,
        inStock: formData.inStock,
        stockCount: Number(formData.stockCount),
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: formData.discount || undefined,
        badge: formData.badge,
        rating: 5,
        reviewsCount: 1,
        frontImage: formData.frontImage,
        backImage: formData.backImage,
        description: formData.description,
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
        department: 'men',
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

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && p.inStock) ||
      (stockFilter === 'out_of_stock' && !p.inStock);

    return matchesSearch && matchesCat && matchesStock;
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
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
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
                <th className="py-3 px-4">Category & Brand</th>
                <th className="py-3 px-4">Price (BDT ৳)</th>
                <th className="py-3 px-4">Stock Units</th>
                <th className="py-3 px-4">Badges & Flags</th>
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
                        <img
                          src={p.frontImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-satoshi-bold text-[#141414] truncate max-w-[200px]">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          SKU: {p.sku || p.id}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-[#093624]">★ {p.rating}</span>
                          <span className="text-[10px] text-gray-400">({p.reviewsCount})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Brand */}
                  <td className="py-3 px-4">
                    <div className="font-satoshi-med text-[#141414]">{p.category}</div>
                    <div className="text-[10px] text-gray-400">{p.brand || 'Reshans Fashion'}</div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <div className="font-satoshi-bold text-[#093624] tabular-nums">
                      {formatPrice(p.price)}
                    </div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div className="text-[10px] text-gray-400 line-through tabular-nums">
                        {formatPrice(p.originalPrice)}
                      </div>
                    )}
                  </td>

                  {/* Stock Units */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                        p.inStock
                          ? 'bg-[#093624] text-[#F9F295]'
                          : 'bg-[#F1EFEE] text-[#6D6868]'
                      }`}
                    >
                      {p.inStock ? `${p.stockCount ?? 20} in stock` : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Badges & Flags */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.badge && (
                        <span className="px-1.5 py-0.5 bg-[#093624] text-[#F9F295] rounded-xs text-[9px] font-satoshi-bold uppercase">
                          {p.badge}
                        </span>
                      )}
                      {p.isTrending && (
                        <span className="px-1.5 py-0.5 bg-[#F9F295] text-[#093624] rounded-xs text-[9px] font-satoshi-bold">
                          Trending
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="px-1.5 py-0.5 bg-[#093624]/10 text-[#093624] rounded-xs text-[9px] font-satoshi-bold">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="p-1.5 text-gray-400 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                        title="View on store"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-gray-600 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1.5 text-gray-400 hover:text-[#141414] hover:bg-[#F1EFEE] rounded-xs transition-colors cursor-pointer"
                        title="Delete product"
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

      {/* 3. Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <h3 className="text-base font-bold font-satoshi-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10"
              >
                <X size={18} />
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

              {/* Category & Brand row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Brand
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
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

              {/* Image URL selection */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Product Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.frontImage}
                  onChange={(e) => setFormData({ ...formData, frontImage: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624] mb-2"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">
                    Or select asset:
                  </span>
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, frontImage: img })}
                      className={`w-10 h-12 border rounded-xs overflow-hidden shrink-0 transition-all ${
                        formData.frontImage === img
                          ? 'border-[#093624] ring-2 ring-[#093624]'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
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
                    value={formData.stockCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockCount: Number(e.target.value),
                        inStock: Number(e.target.value) > 0,
                      })
                    }
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

              {/* Trending / Bestseller flags */}
              <div className="flex flex-wrap gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-[#141414]">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-[#093624] w-4 h-4 rounded-xs"
                  />
                  <span>Mark as Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-[#141414]">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="accent-[#093624] w-4 h-4 rounded-xs"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-xs font-satoshi focus:outline-none focus:border-[#093624]"
                />
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
                  className="px-6 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] text-xs font-satoshi-bold uppercase tracking-wider rounded-xs transition-opacity cursor-pointer shadow-xs"
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
