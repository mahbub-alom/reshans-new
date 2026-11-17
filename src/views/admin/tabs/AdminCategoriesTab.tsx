'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { CategoryDetail, BrandItem } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminCategoriesTab: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    brands,
    addBrand,
    deleteBrand,
    navigate,
    navigateToCategory,
  } = useShop();

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDetail | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    image: '/assets/img/fashion-1/category/category-1.jpg',
    description: '',
    status: 'Active' as 'Active' | 'Hidden',
  });

  // Brand Modal State
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: '',
    origin: 'Dhaka, Bangladesh',
  });

  const handleOpenAddCat = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      slug: '',
      image: '/assets/img/fashion-1/category/category-1.jpg',
      description: 'Contemporary fashion garments crafted from natural yarns.',
      status: 'Active',
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: CategoryDetail) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      status: cat.status,
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;

    const slug = catForm.slug.trim() || catForm.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catForm.name,
        slug,
        image: catForm.image,
        description: catForm.description,
        status: catForm.status,
      });
    } else {
      addCategory({
        name: catForm.name,
        slug,
        image: catForm.image,
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
              Organize your catalog departments, clothing classifications, and shop filters
            </p>
          </div>

          <button
            onClick={handleOpenAddCat}
            className="px-4 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold uppercase tracking-wider flex items-center gap-2 transition-opacity cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border border-[#EBEBEB] rounded-xs p-4 flex gap-4 bg-[#F9F9F9] hover:bg-white hover:border-[#093624] transition-all group"
            >
              <div className="w-16 h-20 bg-gray-200 rounded-xs overflow-hidden shrink-0 border border-gray-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold font-satoshi-bold text-[#141414] truncate">
                      {cat.name}
                    </h4>
                    <span
                      className={`text-[9px] font-satoshi-bold px-1.5 py-0.2 rounded-xs uppercase ${
                        cat.status === 'Active'
                          ? 'bg-[#093624] text-[#F9F295]'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    /{cat.slug}
                  </span>
                  <p className="text-[11px] text-gray-500 font-satoshi mt-1 line-clamp-2">
                    {cat.description}
                  </p>
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
                      className="p-1 text-gray-500 hover:text-[#093624] rounded-xs"
                      title="Edit Category"
                    >
                      <Edit size={13} />
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 text-gray-400 hover:text-[#093624] rounded-xs"
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
                className="p-1 text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="p-5 space-y-4 text-xs font-satoshi">
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Formal Shirts"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  placeholder="formal-shirts"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Category Image URL
                </label>
                <input
                  type="text"
                  value={catForm.image}
                  onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
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
                  className="px-5 py-1.5 bg-[#093624] text-[#F9F295] font-satoshi-bold rounded-xs cursor-pointer"
                >
                  Save Category
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
                className="p-1 text-white/70 hover:text-white"
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
                  placeholder="e.g. Reshans Bespoke"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Origin / Manufacturing Hub
                </label>
                <input
                  type="text"
                  value={brandForm.origin}
                  onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                  placeholder="Dhaka, Bangladesh"
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
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
