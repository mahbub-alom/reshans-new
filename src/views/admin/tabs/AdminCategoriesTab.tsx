'use client';

import React, { useState, useRef } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  X,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { CategoryDetail, BrandItem } from '../../../types';
import { useShop } from '../../../context/ShopContext';

const PAGE_OPTIONS = ['Shop', 'Men', 'Women', 'Collections'] as const;

export const AdminCategoriesTab: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    brands,
    addBrand,
    deleteBrand,
    navigateToCategory,
    showToast,
  } = useShop();

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDetail | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [catForm, setCatForm] = useState<{
    page: 'Shop' | 'Men' | 'Women' | 'Collections';
    name: string;
    slug: string;
    image: string;
    description: string;
    status: 'Active' | 'Inactive';
  }>({
    page: 'Shop',
    name: '',
    slug: '',
    image: '',
    description: '',
    status: 'Active',
  });

  // Filter state for Categories list
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('all');

  // Brand Modal State
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: '',
    origin: 'Dhaka, Bangladesh',
  });

  const handleOpenAddCat = () => {
    setEditingCategory(null);
    setCatForm({
      page: 'Shop',
      name: '',
      slug: '',
      image: '',
      description: '',
      status: 'Active',
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: CategoryDetail) => {
    setEditingCategory(cat);
    setCatForm({
      page: (cat.page as any) || 'Shop',
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      description: cat.description || '',
      status: cat.status === 'Inactive' ? 'Inactive' : 'Active',
    });
    setIsCatModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCatForm((prev) => ({ ...prev, image: data.url }));
        showToast('Image uploaded to Cloudinary successfully!');
      } else {
        showToast(data.error || 'Image upload failed');
      }
    } catch (err: any) {
      showToast(err.message || 'Image upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      showToast('Category name is required');
      return;
    }

    const slug = catForm.slug.trim() || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        page: catForm.page,
        name: catForm.name,
        slug,
        image: catForm.image || undefined,
        description: catForm.description,
        status: catForm.status,
      });
    } else {
      addCategory({
        page: catForm.page,
        name: catForm.name,
        slug,
        image: catForm.image || undefined,
        description: catForm.description,
        status: catForm.status,
      });
    }

    setIsCatModalOpen(false);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;

    addBrand({
      name: brandForm.name,
      origin: brandForm.origin,
    });

    setBrandForm({ name: '', origin: 'Dhaka, Bangladesh' });
    setIsBrandModalOpen(false);
  };

  const filteredCategories = categories.filter((cat) => {
    if (selectedPageFilter === 'all') return true;
    return (cat.page || 'Shop').toLowerCase() === selectedPageFilter.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* 1. Category Management Section */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBEB]">
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
              <Layers size={18} className="text-[#093624]" />
              <span>Product Categories ({categories.length})</span>
            </h3>
            <p className="text-xs text-brand-body font-satoshi">
              Organize categories assigned to Shop, Men, Women, and Collections pages
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Filter categories by page */}
            <select
              value={selectedPageFilter}
              onChange={(e) => setSelectedPageFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
            >
              <option value="all">All Pages</option>
              {PAGE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p} Page
                </option>
              ))}
            </select>

            <button
              onClick={handleOpenAddCat}
              className="px-4 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold uppercase tracking-wider flex items-center gap-2 transition-opacity cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="border border-[#EBEBEB] rounded-xs p-4 flex gap-4 bg-[#F9F9F9] hover:bg-white hover:border-[#093624] transition-all group"
            >
              <div className="w-16 h-20 bg-gray-200 rounded-xs overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ImageIcon size={20} className="text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold font-satoshi-bold text-[#141414] truncate">
                      {cat.name}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] font-satoshi-bold px-1.5 py-0.5 rounded-xs uppercase bg-gray-200 text-gray-800">
                        {cat.page || 'Shop'}
                      </span>
                      <span
                        className={`text-[9px] font-satoshi-bold px-1.5 py-0.5 rounded-xs uppercase ${
                          cat.status === 'Active'
                            ? 'bg-[#093624] text-[#F9F295]'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    /{cat.slug}
                  </span>
                  {cat.description && (
                    <p className="text-[11px] text-gray-500 font-satoshi mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                  <button
                    onClick={() => navigateToCategory(cat.name)}
                    className="text-[11px] font-satoshi-bold text-[#093624] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View in Shop</span>
                    <ExternalLink size={10} />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditCat(cat)}
                      className="p-1 text-gray-500 hover:text-[#093624] rounded-xs cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit size={13} />
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-xs cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Brand Management Section */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBEB]">
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
              <Tag size={18} className="text-[#093624]" />
              <span>Fashion Brands & Labels ({brands.length})</span>
            </h3>
            <p className="text-xs text-brand-body font-satoshi">
              Manage apparel designer labels, ateliers, and manufacturer lines
            </p>
          </div>

          <button
            onClick={() => setIsBrandModalOpen(true)}
            className="px-4 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold uppercase tracking-wider flex items-center gap-2 transition-opacity cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Add Brand</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {brands.map((b) => (
            <div
              key={b.id}
              className="border border-[#EBEBEB] rounded-xs p-3.5 bg-[#F9F9F9] hover:bg-white hover:border-[#093624] transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold font-satoshi-bold text-[#141414] truncate mb-0.5">
                  {b.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-satoshi">{b.origin}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200/60">
                <span className="text-[10px] text-[#093624] font-satoshi-bold">
                  {b.itemCount} items
                </span>
                {brands.length > 1 && (
                  <button
                    onClick={() => deleteBrand(b.id)}
                    className="text-gray-400 hover:text-[#093624] transition-colors cursor-pointer"
                    title="Remove Brand"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <h3 className="text-sm font-bold font-satoshi-bold">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-white/70 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="p-5 space-y-4 text-xs font-satoshi">
              {/* Page Selection */}
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Select Page *
                </label>
                <select
                  required
                  value={catForm.page}
                  onChange={(e) => setCatForm({ ...catForm, page: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                >
                  {PAGE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Name */}
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. T-Shirts"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Category Status *
                </label>
                <select
                  value={catForm.status}
                  onChange={(e) => setCatForm({ ...catForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Category Image (Optional) with Cloudinary Upload */}
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Category Image (Optional - Cloudinary Upload)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                    id="cat-image-file"
                  />
                  <label
                    htmlFor="cat-image-file"
                    className={`px-3 py-2 bg-[#093624] text-[#F9F295] font-satoshi-bold rounded-xs cursor-pointer flex items-center gap-1.5 hover:opacity-90 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={13} />
                        <span>Upload Image to Cloudinary</span>
                      </>
                    )}
                  </label>

                  {catForm.image && (
                    <button
                      type="button"
                      onClick={() => setCatForm({ ...catForm, image: '' })}
                      className="text-red-500 hover:text-red-700 text-[11px] underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {catForm.image && (
                  <div className="flex items-center gap-3 p-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs">
                    <img
                      src={catForm.image}
                      alt="Category Preview"
                      className="w-12 h-14 object-cover rounded-xs border border-gray-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-500 truncate">{catForm.image}</p>
                      <span className="text-[9px] text-[#093624] font-satoshi-bold">Cloudinary Hosted</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Optional brief description"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 font-satoshi-bold rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-1.5 bg-[#093624] text-[#F9F295] font-satoshi-bold rounded-xs cursor-pointer disabled:opacity-50"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <h3 className="text-sm font-bold font-satoshi-bold">Add Fashion Label / Brand</h3>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="p-1 text-white/70 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="p-5 space-y-4 text-xs font-satoshi">
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="e.g. Reshans Atelier"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Origin / Location
                </label>
                <input
                  type="text"
                  value={brandForm.origin}
                  onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 font-satoshi-bold rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#093624] text-[#F9F295] font-satoshi-bold rounded-xs cursor-pointer"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
