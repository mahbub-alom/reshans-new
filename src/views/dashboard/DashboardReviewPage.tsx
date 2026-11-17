import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import {
  Star,
  MessageSquare,
  Edit3,
  Trash2,
  CheckCircle2,
  Lock,
  PackageCheck,
  Truck,
  X,
  Sparkles,
} from 'lucide-react';

interface DeliveredProduct {
  id: string;
  orderId: string;
  productName: string;
  image: string;
  deliveredDate: string;
  status: 'delivered' | 'in_transit';
  isReviewed: boolean;
  soldBy: string;
}

export const DashboardReviewPage: React.FC = () => {
  const { navigate, showToast } = useShop();

  // Products from customer orders
  const [orderItems, setOrderItems] = useState<DeliveredProduct[]>([
    {
      id: 'prod-del-1',
      orderId: 'RS-98214',
      productName: 'Slim-Fit Crew in Cozy Waffle',
      image: '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
      deliveredDate: 'Jan 14, 2026',
      status: 'delivered',
      isReviewed: false,
      soldBy: 'Reshans Atelier Dhaka',
    },
    {
      id: 'prod-del-2',
      orderId: 'RS-98102',
      productName: 'Sweater in Everyday Cotton',
      image: '/assets/img/fashion-1/product/product-2/front-img-1.jpg',
      deliveredDate: 'Jan 18, 2026',
      status: 'delivered',
      isReviewed: false,
      soldBy: 'Reshans Casual',
    },
    {
      id: 'prod-transit-1',
      orderId: 'RS-99450',
      productName: 'Classic Linen Button-down',
      image: '/assets/img/fashion-2/arrival-product/nav-img-3-1.jpg',
      deliveredDate: 'Estimated Jan 24, 2026',
      status: 'in_transit',
      isReviewed: false,
      soldBy: 'Reshans Menswear',
    },
  ]);

  // Submitted reviews list
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      productName: 'Aviator Sunglasses',
      orderId: 'RS-95120',
      status: 'Approved',
      statusType: 'success',
      rating: 5,
      soldBy: 'Global Office',
      date: 'Jan 11, 2026',
      comment: 'Great craftsmanship and UV protection. Fast Dhaka delivery right to my doorstep!',
      image: '/assets/img/others/dashboard-p-1.jpg',
    },
    {
      id: 'rev-2',
      productName: 'Classic Urban Oversized Shirt',
      orderId: 'RS-94882',
      status: 'Approved',
      statusType: 'success',
      rating: 5,
      soldBy: 'Reshans Apparel',
      date: 'Jan 05, 2026',
      comment: 'Luxurious cotton fabric, fits nicely for Dhaka summer. Would definitely purchase again!',
      image: '/assets/img/others/dashboard-p-2.jpg',
    },
  ]);

  // Active review modal state
  const [reviewModalProduct, setReviewModalProduct] = useState<DeliveredProduct | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const handleOpenReviewModal = (item: DeliveredProduct) => {
    setReviewModalProduct(item);
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalProduct) return;
    if (!comment.trim()) {
      showToast('Please enter your review feedback.');
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      productName: reviewModalProduct.productName,
      orderId: reviewModalProduct.orderId,
      status: 'Approved',
      statusType: 'success',
      rating: rating,
      soldBy: reviewModalProduct.soldBy,
      date: 'Just now',
      comment: comment.trim(),
      image: reviewModalProduct.image,
    };

    setReviews([newReview, ...reviews]);
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === reviewModalProduct.id ? { ...item, isReviewed: true } : item
      )
    );

    showToast(
      `Thank you! Verified review for "${reviewModalProduct.productName}" submitted successfully.`
    );
    setReviewModalProduct(null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed from your profile.');
  };

  return (
    <DashboardLayout activeTab="reviews" title="Reviews">
      <div className="space-y-8 font-satoshi">
        <div>
          <h3 className="text-2xl font-bold font-satoshi-bold text-[#141414] tracking-tight">
            Product Reviews
          </h3>
          <p className="text-xs text-[#7A7A7A] mt-1">
            Review items you have physically received in hand from your completed orders.
          </p>
        </div>

        {/* 1. Eligible Delivered Products (In Hand) Section */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden rounded-xs">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#093624]/10 text-[#093624] rounded-full flex items-center justify-center shrink-0">
                <PackageCheck size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                  Delivered Items (In Hand) Eligible for Review
                </h4>
                <p className="text-xs text-[#7A7A7A]">
                  Only products delivered to your hands can be reviewed
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#093624] bg-[#093624]/10 px-2.5 py-1 rounded-xs uppercase tracking-wider">
              Verified Delivery Only
            </span>
          </div>

          <div className="divide-y divide-gray-100 p-6 space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 first:pt-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-18 bg-[#F9F9F9] border border-gray-200 rounded-xs overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                      {item.productName}
                    </h5>
                    <p className="text-[11px] text-[#7A7A7A]">
                      Order: <strong className="text-[#141414]">#{item.orderId}</strong> · Sold by: {item.soldBy}
                    </p>
                    <div className="flex items-center gap-2">
                      {item.status === 'delivered' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#093624] bg-[#F9F295]/60 px-2 py-0.5 rounded-xs border border-[#093624]/20">
                          <CheckCircle2 size={12} />
                          Delivered In Hand ({item.deliveredDate})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#141414] bg-[#F1EFEE] px-2 py-0.5 rounded-xs border border-[#E8E5E3]">
                          <Truck size={12} />
                          In Transit ({item.deliveredDate})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review Trigger Button */}
                <div>
                  {item.status === 'delivered' ? (
                    item.isReviewed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#093624] bg-[#F9F295]/60 px-3 py-1.5 rounded-xs border border-[#093624]/20">
                        <CheckCircle2 size={13} />
                        Reviewed
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenReviewModal(item)}
                      >
                        <Edit3 size={13} className="mr-1.5 inline" />
                        Write Review
                      </Button>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xs border border-gray-200">
                      <Lock size={13} />
                      <span>Review Unlocks on Delivery</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Your Published Reviews */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden rounded-xs">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <Star size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                  Your Published Reviews ({reviews.length})
                </h4>
                <p className="text-xs text-[#7A7A7A]">
                  Verified feedback visible to buyers on product pages
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#F0EDED]">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 flex flex-col md:flex-row items-start gap-5">
                <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#F9F9F9] border border-[#EBEBEB] shrink-0 overflow-hidden rounded-xs">
                  <img
                    src={rev.image}
                    alt={rev.productName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
                      <span>{rev.productName}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#093624] text-[#F9F295]">
                        {rev.status} (Verified Buyer)
                      </span>
                    </h5>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-[#093624]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rev.rating ? 'fill-[#093624]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#7A7A7A] text-[11px]">
                    Order: <strong className="text-[#141414]">#{rev.orderId}</strong> · Sold by:{' '}
                    <span className="text-[#141414] font-satoshi-med">{rev.soldBy}</span> · Date:{' '}
                    <span className="text-[#141414] font-satoshi-med">{rev.date}</span>
                  </p>

                  <p className="text-[#141414] text-xs leading-relaxed bg-[#FAF9F8] p-3 border border-gray-100 rounded-xs">
                    <strong className="text-[#55585B] font-satoshi-med">Review:</strong>{' '}
                    {rev.comment}
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold font-satoshi-bold text-[#6D6868] hover:text-[#141414] transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="p-12 text-center text-xs text-[#7A7A7A]">
                You haven’t submitted any product reviews yet. Deliveries in hand are eligible above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Modal for Delivered Products */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-xs shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#093624]" />
                <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                  Write Product Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalProduct(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xs border border-gray-100">
              <img
                src={reviewModalProduct.image}
                alt={reviewModalProduct.productName}
                className="w-14 h-16 object-cover object-top rounded-xs border border-gray-200"
              />
              <div className="text-xs space-y-0.5">
                <h4 className="font-bold font-satoshi-bold text-[#141414]">
                  {reviewModalProduct.productName}
                </h4>
                <p className="text-[11px] text-gray-500">Order #{reviewModalProduct.orderId}</p>
                <span className="inline-block text-[10px] font-bold text-[#093624] bg-[#F9F295]/70 px-1.5 py-0.2 rounded-xs">
                  Delivered ({reviewModalProduct.deliveredDate})
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold font-satoshi-bold text-[#141414] mb-1.5">
                  Your Overall Rating:
                </label>
                <div className="flex items-center gap-1.5 text-[#093624]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="cursor-pointer hover:scale-110 transition-transform p-1"
                    >
                      <Star
                        size={22}
                        className={s <= rating ? 'fill-[#093624]' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold font-satoshi-bold text-[#141414] ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-xs font-bold font-satoshi-bold text-[#141414] mb-1.5">
                  Detailed Feedback:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How does the fabric feel in your hand? How is the fit, stitching, and finish? Would you recommend this to other buyers?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xs text-xs font-satoshi-med focus:outline-hidden focus:border-[#093624]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setReviewModalProduct(null)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Submit Verified Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
