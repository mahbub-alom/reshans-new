import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { Search, X, Star } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, openQuickView, formatPrice, products } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const popularSearches = ['Top', 'Sweater', 'Crew', 'Overshirt', 'Tote Bag', 'Dresses'];

  const sourceProducts = products && products.length ? products : PRODUCTS;

  const searchResults = searchTerm.trim()
    ? sourceProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sourceProducts.slice(0, 4);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-white/98 backdrop-blur-md transition-all duration-300 font-satoshi ${
        isSearchOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
        {/* Animated Close Button on Hover */}
        <div className="flex justify-end mb-8">
          <button
            onClick={closeSearch}
            aria-label="Close search"
            className="group w-10 h-10 rounded-full bg-gray-100 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] transition-all duration-300 cursor-pointer shadow-xs"
          >
            <X size={20} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="max-w-3xl mx-auto w-full mb-12">
          <div className="relative border-b-2 border-[#093624] pb-3 flex items-center">
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="What are you looking for in Reshans?"
              className="w-full text-xl sm:text-3xl font-semibold text-[#141414] placeholder-gray-400 focus:outline-none pr-12 bg-transparent font-satoshi"
            />
            <button
              aria-label="Submit search"
              className="absolute right-0 text-[#093624] hover:text-[#052216]"
            >
              <Search size={28} />
            </button>
          </div>
        </div>

        {/* Content Columns: Popular Searches (Left) + Search Results / Recently Viewed (Right) */}
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Popular Search Categories */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#141414] mb-4 font-satoshi-bold">
              Popular Searches
            </h4>
            <div className="flex flex-wrap md:flex-col gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="text-left text-xs font-semibold text-[#6D6868] hover:text-[#093624] py-1 transition-colors cursor-pointer font-satoshi-med"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Products List in BDT */}
          <div className="md:col-span-9">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#141414] mb-4 font-satoshi-bold">
              {searchTerm.trim() ? `Search Results (${searchResults.length})` : 'Recently Viewed in Bangladesh'}
            </h4>

            {searchResults.length === 0 ? (
              <p className="text-sm text-[#7A7A7A] py-8 font-satoshi">
                No products found matching "{searchTerm}". Try another style or browse categories.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      closeSearch();
                      openQuickView(product);
                    }}
                    className="group cursor-pointer flex flex-col bg-gray-50/60 p-2 rounded-xs border border-gray-100 hover:border-[#093624] transition-colors"
                  >
                    <div className="aspect-[3/4] bg-white rounded-xs overflow-hidden mb-2">
                      <img
                        src={product.frontImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-[#7A7A7A] uppercase font-satoshi-med">{product.category}</span>
                    <h5 className="text-xs font-semibold text-[#141414] group-hover:text-[#093624] line-clamp-1 font-satoshi-bold">
                      {product.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-[#093624] font-satoshi-bold">{formatPrice(product.price)}</span>
                      <div className="flex items-center text-[#093624]">
                        <Star size={10} className="fill-[#093624]" />
                        <span className="text-[10px] text-gray-500 ml-0.5 font-satoshi">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
