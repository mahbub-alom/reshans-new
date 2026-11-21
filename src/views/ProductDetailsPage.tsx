import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Maximize2,
  HelpCircle,
  ChevronDown,
  Ruler,
  ShoppingBag,
  ArrowRight,
  Play,
  Video as VideoIcon,
} from 'lucide-react';

interface ProductDetailsPageProps {
  productId?: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
  const {
    products,
    addToCart,
    startBuyNow,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    navigate,
    showToast,
  } = useShop();

  // Find product by ID or Slug or fallback to first product
  const cleanId = productId ? decodeURIComponent(productId).trim() : '';
  const product =
    products.find((p) => {
      if (!cleanId) return false;
      if (p.id.toLowerCase() === cleanId.toLowerCase()) return true;
      if (p.slug && p.slug.toLowerCase() === cleanId.toLowerCase()) return true;
      // Exact match with trailing -prod-X or -prodX
      if (cleanId.endsWith(`-${p.id.toLowerCase()}`)) return true;
      if (cleanId.split('-').pop() === p.id.toLowerCase()) return true;
      // Also match if slug begins or ends with product ID
      if (cleanId.includes(p.id.toLowerCase())) return true;
      return false;
    }) || products[0] || PRODUCTS[0];

  // Gallery Media Items (Images + Video if provided)
  const colorVariantImages = (product.colors || [])
    .map((c) => c.image)
    .filter((img): img is string => Boolean(img));

  const uniqueImageUrls = [
    product.frontImage,
    product.backImage || product.frontImage,
    ...colorVariantImages,
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  interface MediaItem {
    type: 'image' | 'video';
    url: string;
    thumb: string;
  }

  const galleryMedia: MediaItem[] = [
    ...uniqueImageUrls.map((url) => ({ type: 'image' as const, url, thumb: url })),
    ...(product.video
      ? [
          {
            type: 'video' as const,
            url: product.video,
            thumb: product.frontImage,
          },
        ]
      : []),
  ];

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'Default'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'description' | 'additional' | 'reviews' | 'question' | 'faq'
  >('description');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [viewersCount, setViewersCount] = useState(28);

  useEffect(() => {
    const nextSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];
    setActiveMediaIndex(0);
    setSelectedSize(nextSizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Default');
    setQuantity(1);
    setAddedToCartFeedback(false);
  }, [product.id]);

  // Modals state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  // Reviews list (customer reviews submitted via dashboard)
  const [reviewsList] = useState([
    {
      id: 1,
      author: 'Orio Madrid',
      date: '06 January, 2026',
      rating: 5,
      comment:
        'This piece exceeded all my expectations for everyday Dhaka weather. Soft, tailored feel and looks identical to the photoshoot images.',
    },
    {
      id: 2,
      author: 'Tanvir Rahman',
      date: '12 January, 2026',
      rating: 5,
      comment:
        'Outstanding quality from Reshans. Fits true to size and color holds vibrantly after several washes. Highly recommended!',
    },
  ]);

  // Question form state
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionText, setQuestionText] = useState('');

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Simulated live viewers fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next >= 18 && next <= 45 ? next : 28;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const inWishlist = isInWishlist(product.id);

  // Related products (4 items)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handlePrevImage = () => {
    setActiveMediaIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveMediaIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize, { openDrawer: false });
    setAddedToCartFeedback(true);
    setTimeout(() => {
      setAddedToCartFeedback(false);
    }, 6000);
  };

  const handleBuyNow = () => {
    startBuyNow(product, quantity, selectedColor, selectedSize);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionName || !questionText) {
      showToast('Please enter your name and question.');
      return;
    }
    setQuestionName('');
    setQuestionEmail('');
    setQuestionText('');
    showToast('Your question has been sent to our Dhaka stylist team.');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
      setIsShareModalOpen(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* 1. Breadcrumb Area - matching .aq-breadcrumb-area data-bg-color="#F9F9F9" */}
      <div className="bg-[#F9F9F9] py-5 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#55585B] font-satoshi-med">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate('/shop')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              Shop
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-[#141414] font-satoshi-bold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Product Details Area matching .aq-product-details-area */}
      <div className="pt-12 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Gallery: Vertical Thumbnails + Main Display */}
            <div className="lg:col-span-6">
              <div className="flex flex-col-reverse sm:flex-row gap-4">
                {/* Thumbnails (vertical column) */}
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 no-scrollbar">
                  {galleryMedia.map((media, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-20 h-24 sm:w-22 sm:h-28 rounded-xs overflow-hidden bg-[#F7F7F7] border transition-all shrink-0 cursor-pointer group/thumb ${
                        activeMediaIndex === idx
                          ? 'border-[#093624] ring-2 ring-[#093624]/20'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={media.thumb}
                        alt={`${product.name} thumb ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = product.frontImage;
                        }}
                      />
                      {media.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                          <div className="w-7 h-7 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center shadow">
                            <Play size={12} className="fill-[#F9F295] translate-x-0.5" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Main Large Display (Image or Video) */}
                <div className="flex-1 relative aspect-[3/4] bg-[#F7F7F7] rounded-xs overflow-hidden border border-gray-100 group">
                  {galleryMedia[activeMediaIndex]?.type === 'video' ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        key={galleryMedia[activeMediaIndex].url}
                        src={galleryMedia[activeMediaIndex].url}
                        controls
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <img
                      src={galleryMedia[activeMediaIndex]?.url || product.frontImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.frontImage;
                      }}
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                    {product.discount && (
                      <span className="bg-[#093624] text-[#F9F295] text-[11px] font-bold font-satoshi-bold px-2.5 py-1 rounded-xs uppercase tracking-wider">
                        {product.discount}
                      </span>
                    )}
                    {galleryMedia[activeMediaIndex]?.type === 'video' && (
                      <span className="bg-[#141414] text-white text-[10px] font-bold font-satoshi-bold px-2 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                        <VideoIcon size={12} /> Video
                      </span>
                    )}
                  </div>

                  {/* Zoom Preview Trigger */}
                  {galleryMedia[activeMediaIndex]?.type === 'image' && (
                    <button
                      onClick={() => setIsImageLightboxOpen(true)}
                      className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Zoom Image"
                    >
                      <Maximize2 size={16} />
                    </button>
                  )}

                  {/* Prev / Next Arrows */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    aria-label="Next media"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-6 space-y-5">
              {/* Badge & Category */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-xs bg-[#093624] text-[#F9F295] text-[11px] font-bold font-satoshi-bold uppercase tracking-wider">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#7A7A7A] font-satoshi-med">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold font-satoshi-bold text-[#141414] leading-tight">
                {product.name}
              </h1>

              {/* Inventory details & rating */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                {/* 5 Stars */}
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#093624]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.floor(product.rating)
                            ? 'fill-[#093624]'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#141414] font-satoshi-bold">
                    {product.rating.toFixed(2)}
                  </span>
                  <span className="text-[#7A7A7A]">({reviewsList.length} reviews)</span>
                </div>

                <span className="text-gray-300">|</span>

                {/* Recent Activity Counter */}
                <div className="flex items-center gap-1.5 text-[#141414] font-satoshi-med bg-[#F9F9F9] px-2.5 py-1 rounded-xs border border-gray-200">
                  <Flame size={14} className="text-[#093624]" />
                  <span>41 sold in last 16 hours</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-[#093624] tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through font-satoshi tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Short Description with "Read More.." toggle matching Aqlova reference */}
              <div className="text-sm text-[#55585B] leading-relaxed font-satoshi">
                <p className={`${isDescExpanded ? '' : 'line-clamp-2'}`}>
                  {product.description} Thoughtfully crafted from sustainable long-staple
                  organic fibres with low-impact washing techniques. Engineered for
                  effortless comfort, breathability, and lasting silhouette throughout Dhaka's
                  vibrant seasons.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-1 text-xs font-bold text-[#093624] hover:underline cursor-pointer"
                >
                  {isDescExpanded ? 'Read Less..' : 'Read More..'}
                </button>
              </div>

              {/* People viewing right now */}
              <div className="flex items-center gap-2 py-2 px-3 rounded-xs bg-[#F9F9F9] border border-gray-100 text-xs text-[#141414] font-satoshi-med w-fit">
                <Eye size={15} className="text-[#093624]" />
                <p>
                  <strong className="text-[#093624] font-bold">{viewersCount}</strong> people
                  are viewing this right now
                </p>
              </div>

              {/* Size Selector with Size Guide trigger */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-satoshi-bold text-[#141414]">
                    Size: <span className="text-[#093624] font-extrabold">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-[#093624] hover:underline font-satoshi-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 h-10 px-3 rounded-xs border text-xs font-bold font-satoshi-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#093624] bg-[#093624] text-[#F9F295]'
                          : 'border-gray-200 bg-white text-[#141414] hover:border-[#093624]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector — Swatch circles with checkmark & tooltip */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold font-satoshi-bold text-[#141414]">
                      Color: <span className="text-[#093624] font-extrabold">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    {product.colors.map((c) => (
                      <div key={c.name} className="relative group/swatch flex items-center justify-center">
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/swatch:flex flex-col items-center pointer-events-none z-20 whitespace-nowrap">
                          <span className="bg-[#141414] text-white text-[11px] font-medium py-0.5 px-2 rounded shadow-md font-satoshi">
                            {c.name}
                          </span>
                          <span className="w-1.5 h-1.5 bg-[#141414] rotate-45 -mt-0.5"></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedColor(c.name);
                            if (c.image) {
                              const imgIdx = galleryMedia.findIndex(
                                (m) => m.type === 'image' && m.url === c.image
                              );
                              if (imgIdx !== -1) {
                                setActiveMediaIndex(imgIdx);
                              }
                            }
                          }}
                          aria-label={c.name}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer flex items-center justify-center relative ${
                            selectedColor === c.name
                              ? 'ring-2 ring-[#093624] ring-offset-2 scale-110 border-white shadow-xs'
                              : 'border-black/15 opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.name && (
                            <Check
                              size={14}
                              className={c.hex === '#FFFFFF' || c.hex === '#F9F295' || c.hex === '#F8F9FA' ? 'text-[#093624]' : 'text-white'}
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Stepper + Add To Cart + Wishlist + Compare */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-200 h-12 px-3 bg-white w-32 justify-between rounded-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-gray-500 hover:text-[#093624] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold font-satoshi-bold text-sm text-[#141414]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 text-gray-500 hover:text-[#093624] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] text-xs font-bold font-satoshi-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={15} />
                    <span>Add To Cart</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className={`h-12 w-12 rounded-xs border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      inWishlist
                        ? 'border-[#093624] bg-[#093624] text-[#F9F295]'
                        : 'border-gray-200 bg-white text-[#141414] hover:border-[#093624] hover:text-[#093624]'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart size={18} className={inWishlist ? 'fill-[#F9F295]' : ''} />
                  </button>
                </div>

                {/* Buy Now Button - Direct Isolated Checkout */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full h-12 bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white text-xs font-bold font-satoshi-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={15} />
                </button>

                {/* Inline confirmation after Add to Cart (while remaining on current page) */}
                {addedToCartFeedback && (
                  <div className="p-3 bg-[#F9F295]/40 border border-[#093624]/25 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#093624] font-satoshi-bold flex items-center gap-1.5">
                      <Check size={14} />
                      Added {quantity}x ({selectedSize}, {selectedColor}) to your cart.
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="font-bold text-[#093624] underline underline-offset-4 hover:text-[#141414] cursor-pointer font-satoshi-bold"
                    >
                      View Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery & Return + Share Buttons */}
              <div className="flex items-center gap-6 pt-2 text-xs font-satoshi-med text-[#141414]">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(true)}
                  className="flex items-center gap-1.5 hover:text-[#093624] cursor-pointer"
                >
                  <Truck size={15} />
                  <span>Delivery & Return</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 hover:text-[#093624] cursor-pointer"
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
              </div>

              {/* Estimate Delivery Info List */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-[#55585B] font-satoshi">
                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-[#093624] shrink-0" />
                  <span>
                    <strong className="text-[#141414] font-satoshi-bold">
                      Estimate delivery times:
                    </strong>{' '}
                    2-3 days in Dhaka, 3-5 days Nationwide.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-[#093624] shrink-0" />
                  <span>
                    <strong className="text-[#141414] font-satoshi-bold">
                      Free shipping & returns:
                    </strong>{' '}
                    On all orders over ৳2,500.
                  </span>
                </div>
              </div>

              {/* Guaranteed Checkout Strip */}
              <div className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-xs border border-gray-100">
                <p className="text-xs text-[#141414] font-satoshi-bold leading-tight">
                  Guaranteed safe <br /> and secure checkout
                </p>
                <img
                  src="/assets/img/payment/payment.png"
                  alt="Payment options"
                  className="h-6 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Content Area (5 Tabs matching Aqlova reference) */}
      <div className="py-14 bg-[#F9F9F9] border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-gray-200 mb-8 pb-3 overflow-x-auto no-scrollbar">
            {[
              { key: 'description', label: 'Description' },
              { key: 'additional', label: 'Additional information' },
              { key: 'reviews', label: `Reviews (${reviewsList.length})` },
              { key: 'question', label: 'Ask & Question' },
              { key: 'faq', label: 'Faq' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`text-xs sm:text-sm font-bold font-satoshi-bold uppercase tracking-wider pb-3 transition-colors cursor-pointer relative whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-[#093624]'
                    : 'text-[#7A7A7A] hover:text-[#141414]'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#093624]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'description' && (
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 border border-gray-200/80 rounded-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-3">
                  {product.name} Luxury Fashion Outfits
                </h3>
                <p className="text-sm text-[#55585B] leading-relaxed">
                  Impeccably tailored for modern comfort, the {product.name} embodies the spirit
                  of Reshans' commitment to conscious textile perfection. Each garment is
                  constructed using precision French seams and premium pre-shrunk cotton blends to
                  ensure enduring drape and rich texture through multiple wash cycles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold font-satoshi-bold text-[#141414] mb-2 uppercase tracking-wider text-xs">
                    Features
                  </h4>
                  <ul className="space-y-1.5 text-[#55585B] list-disc list-inside">
                    <li>Cutaway modern collar with reinforced stitch</li>
                    <li>Subtle chest patch pocket with concealed hem</li>
                    <li>Reshans signature embroidered crest</li>
                    <li>Adjustable double-button sleeve tabs</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold font-satoshi-bold text-[#141414] mb-2 uppercase tracking-wider text-xs">
                    Composition
                  </h4>
                  <ul className="space-y-1.5 text-[#55585B] list-disc list-inside">
                    <li>Care: Hand wash or gentle machine wash cold</li>
                    <li>Content: 95% Organic Cotton, 5% Modal Cashmere</li>
                    <li>Crafted with pride in Dhaka, Bangladesh</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 text-xs text-[#55585B]">
                <h4 className="font-bold font-satoshi-bold text-[#141414] mb-2 uppercase tracking-wider">
                  Washing Instructions
                </h4>
                <p>
                  Machine wash cold with similar shades, no harsh chlorine bleaching, do not
                  tumble dry, iron at medium heat on reverse side.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Additional information */}
          {activeTab === 'additional' && (
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 border border-gray-200/80 rounded-xs">
              <h4 className="text-lg font-bold font-satoshi-bold text-[#141414] mb-4">
                Additional information
              </h4>
              <div className="border border-gray-200 divide-y divide-gray-200 text-xs sm:text-sm">
                {[
                  { label: 'Brand', value: 'Reshans Atelier Dhaka' },
                  { label: 'Color', value: product.colors.map((c) => c.name).join(', ') },
                  { label: 'Sizes Available', value: product.sizes.join(', ') },
                  { label: 'Fabric Weight', value: '280 GSM Luxury Knit' },
                  { label: 'Product Dimensions', value: 'Tailored Asian Regular Fit' },
                  { label: 'Country of Origin', value: 'Bangladesh' },
                ].map((row, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-44 p-3 bg-gray-50 font-bold font-satoshi-bold text-[#141414] shrink-0 border-r border-gray-200">
                      {row.label}
                    </span>
                    <span className="p-3 text-[#55585B] flex-1">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 border border-gray-200/80 rounded-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left: Score & Breakdown */}
                <div className="md:col-span-5 space-y-4">
                  <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                    Customer Reviews
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-extrabold font-satoshi-bold text-[#093624]">
                      {product.rating.toFixed(1)}
                    </span>
                    <div>
                      <div className="flex text-[#093624]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-[#093624]" />
                        ))}
                      </div>
                      <span className="text-xs text-[#7A7A7A]">
                        Based on {reviewsList.length} verified ratings
                      </span>
                    </div>
                  </div>

                  {/* Rating Bars */}
                  <div className="space-y-1.5 pt-2 text-xs">
                    {[
                      { star: '5 Star', pct: '85%' },
                      { star: '4 Star', pct: '12%' },
                      { star: '3 Star', pct: '3%' },
                      { star: '2 Star', pct: '0%' },
                      { star: '1 Star', pct: '0%' },
                    ].map((bar) => (
                      <div key={bar.star} className="flex items-center gap-2">
                        <span className="w-12 text-[#55585B]">{bar.star}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#093624]"
                            style={{ width: bar.pct }}
                          />
                        </div>
                        <span className="w-8 text-right text-gray-400">{bar.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

               
              </div>

              {/* Review Items List */}
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-gray-50/70 rounded-xs space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-satoshi-bold text-[#141414]">
                        {rev.author}
                      </span>
                      <span className="text-[11px] text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex text-[#093624]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < rev.rating ? 'fill-[#093624]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-[#55585B] leading-relaxed pt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Ask & Question */}
          {activeTab === 'question' && (
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 border border-gray-200/80 rounded-xs space-y-4">
              <div>
                <h3 className="text-lg font-bold font-satoshi-bold text-[#141414] mb-1">
                  Have a question about {product.name}?
                </h3>
                <p className="text-xs text-[#7A7A7A]">
                  Our customer support team and master tailors typically respond within 2 hours.
                </p>
              </div>

              <form onSubmit={handleQuestionSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={questionName}
                  onChange={(e) => setQuestionName(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xs text-xs font-satoshi-med focus:outline-hidden focus:border-[#093624]"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={questionEmail}
                  onChange={(e) => setQuestionEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xs text-xs font-satoshi-med focus:outline-hidden focus:border-[#093624]"
                />
                <textarea
                  rows={4}
                  placeholder="What would you like to know about sizing, material, or delivery?"
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xs text-xs font-satoshi-med focus:outline-hidden focus:border-[#093624]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-xs font-bold font-satoshi-bold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                >
                  Send Question
                </button>
              </form>
            </div>
          )}

          {/* Tab 5: FAQ Accordion */}
          {activeTab === 'faq' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-gray-200/80 rounded-xs space-y-3">
              {[
                {
                  q: 'How fast is delivery in Dhaka vs outside Dhaka?',
                  a: 'We offer express Dhaka delivery in 24 to 48 hours. Orders across other divisions (Chittagong, Sylhet, Rajshahi, etc.) arrive within 3 to 5 business days via trusted courier partners.',
                },
                {
                  q: 'What is the return and exchange policy?',
                  a: 'We provide an unconditional 30-day doorstep exchange or return policy. If the sizing does not fit or you would prefer a different color, we collect the package directly from your address.',
                },
                {
                  q: 'Are the fabrics pre-shrunk before stitching?',
                  a: 'Yes, 100% of our cotton and linen garments undergo bio-wash and industrial pre-shrinkage processes so the fit remains true after washing at home.',
                },
                {
                  q: 'Can I pay via bKash, Nagad, or Cash on Delivery?',
                  a: 'Yes, we accept Cash on Delivery throughout Bangladesh as well as bKash, Nagad, Rocket, Visa, Mastercard, and American Express.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold font-satoshi-bold text-xs sm:text-sm text-[#141414] flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-[#093624]' : 'text-gray-400'
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-[#55585B] leading-relaxed border-t border-gray-100 pt-2 bg-gray-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Related Products Section matching .aqf-seller-area */}
      <div className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-[#141414]">
              Related Products
            </h3>
            <p className="text-xs text-[#7A7A7A] font-satoshi mt-1">
              Curated outfits and complementary essentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-xs shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                Reshans Sizing & Measurements
              </h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="py-4 overflow-x-auto text-xs">
              <table className="w-full text-left border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-gray-50 font-bold font-satoshi-bold text-[#141414]">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest (in)</th>
                    <th className="p-2.5">Waist (in)</th>
                    <th className="p-2.5">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#55585B]">
                  <tr>
                    <td className="p-2.5 font-bold text-[#141414]">XS</td>
                    <td className="p-2.5">36"</td>
                    <td className="p-2.5">30"</td>
                    <td className="p-2.5">26"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#141414]">S</td>
                    <td className="p-2.5">38"</td>
                    <td className="p-2.5">32"</td>
                    <td className="p-2.5">27"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#141414]">M</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">34"</td>
                    <td className="p-2.5">28"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#141414]">L</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">36"</td>
                    <td className="p-2.5">29"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#141414]">XL</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">38"</td>
                    <td className="p-2.5">30"</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-gray-500">
                * All garments are true to Asian standard sizes. If in between sizes, we recommend sizing up.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase rounded-xs cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* DELIVERY & RETURN MODAL */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                Delivery & Returns Policy
              </h3>
              <button
                type="button"
                onClick={() => setIsDeliveryModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#55585B] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Truck size={18} className="text-[#093624] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141414] block">Fast Shipping</strong>
                  <span>Inside Dhaka: 24–48 hours (৳60 delivery charge, free over ৳2,500). Outside Dhaka: 3–5 days (৳120).</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw size={18} className="text-[#093624] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141414] block">Hassle-Free 30-Day Return</strong>
                  <span>Return or exchange any unworn item with tags attached within 30 days of receipt.</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDeliveryModalOpen(false)}
              className="w-full py-2 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase rounded-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-sm w-full rounded-xs shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                Share this Product
              </h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#55585B]">
              Share this exclusive look with your friends or copy the direct link:
            </p>
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase rounded-xs cursor-pointer hover:bg-[#052216] transition-colors"
            >
              Copy Product Link
            </button>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {isImageLightboxOpen && (
        <div
          onClick={() => setIsImageLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
        >
          <button
            onClick={() => setIsImageLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
          <img
            src={galleryMedia[activeMediaIndex]?.url || product.frontImage}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xs shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
