import React, { useState, useMemo } from 'react';
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
  ShoppingBag,
} from 'lucide-react';

interface DeliveredItemDisplay {
  id: string; // unique item key
  productId: string;
  orderId: string;
  orderTrackingCode?: string;
  productName: string;
  image: string;
  deliveredDate: string;
  status: 'delivered' | 'in_transit';
  isReviewed: boolean;
  soldBy: string;
}

export const DashboardReviewPage: React.FC = () => {
  const { navigate, showToast, orders, reviews, refreshReviews, deleteReview, currentUser } = useShop();

  // 1. Compute customer orders
  const customerOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    if (!currentUser) return orders; // In demo/guest view, show current session orders
    return orders.filter(
      (o) =>
        o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        (o as any).user?.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
        (o as any).userId === currentUser.id
    );
  }, [orders, currentUser]);

  // 2. Extract delivered & in-transit products from real orders
  const eligibleItems = useMemo<DeliveredItemDisplay[]>(() => {
    const list: DeliveredItemDisplay[] = [];

    // Prioritize user's own orders, or fallback to all orders if user has none yet (for smooth testing)
    const targetOrders = customerOrders.length > 0 ? customerOrders : orders;

    targetOrders.forEach((order) => {
      const isDelivered = order.orderStatus?.toLowerCase() === 'delivered';
      const orderDateStr =
        order.date ||
        ((order as any).createdAt
          ? new Date((order as any).createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Recent');

      order.items?.forEach((item, idx) => {
        const prodId = item.product?.id || (item as any).productId || `item-${idx}`;
        const prodName = item.product?.name || (item as any).productName || 'Reshans Fashion Item';
        const prodImage =
          item.product?.frontImage ||
          (item as any).productImage ||
          '/assets/img/fashion-1/product/product-1/front-img-1.jpg';

        // Check if customer already submitted a review for this product
        const alreadyReviewed = reviews.some(
          (r) =>
            r.productId === prodId &&
            (r.customerEmail === currentUser?.email ||
              r.customerName?.toLowerCase() === currentUser?.name?.toLowerCase() ||
              r.orderId === order.id ||
              r.orderId === order.orderNumber)
        );

        list.push({
          id: `${order.id}-${prodId}-${idx}`,
          productId: prodId,
          orderId: order.orderNumber || order.id,
          orderTrackingCode: (order as any).trackingCode,
          productName: prodName,
          image: prodImage,
          deliveredDate: isDelivered ? orderDateStr : 'Estimated soon',
          status: isDelivered ? 'delivered' : 'in_transit',
          isReviewed: alreadyReviewed,
          soldBy: 'Reshans Atelier Dhaka',
        });
      });
    });

    return list;
  }, [customerOrders, orders, reviews, currentUser]);

  // 3. Customer's published reviews (filtered to those submitted by customer, or all if in guest demo mode)
  const myReviews = useMemo(() => {
    if (!currentUser) return reviews;
    return reviews.filter(
      (r) =>
        r.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        r.customerName?.toLowerCase() === currentUser.name?.toLowerCase()
    );
  }, [reviews, currentUser]);

  // Active review modal state
  const [reviewModalItem, setReviewModalItem] = useState<DeliveredItemDisplay | null>(null);
  const [rating, setRating] = useState<number | null>(null); // starts empty/unselected
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenReviewModal = (item: DeliveredItemDisplay) => {
    setReviewModalItem(item);
    setRating(null); // khali thakbe
    setComment('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;
    if (rating === null || rating <= 0) {
      showToast('Please select a star rating (e.g. 5, 4.5, 4, 3.5, etc.) before submitting.');
      return;
    }
    if (!comment.trim()) {
      showToast('Please enter your review feedback.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        productId: reviewModalItem.productId,
        orderId: reviewModalItem.orderId,
        productName: reviewModalItem.productName,
        productImage: reviewModalItem.image,
        customerName: currentUser?.name || 'Verified Buyer',
        customerEmail: currentUser?.email || 'buyer@reshans.com',
        customerAvatar: currentUser?.avatar || '/assets/img/others/dashboard-avater.jpg',
        rating,
        comment: comment.trim(),
        isVerified: true,
        status: 'pending', // Pending admin approval
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          `Thank you! Review for "${reviewModalItem.productName}" submitted! Admin will verify and publish shortly.`
        );
        await refreshReviews();
        setReviewModalItem(null);
      } else {
        showToast(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMyReview = (id: string) => {
    deleteReview(id);
  };

  return (
    <DashboardLayout activeTab="reviews" title="Reviews">
      <div className="space-y-8 font-satoshi">
        <div>
          <h3 className="text-2xl font-bold font-satoshi-bold text-[#141414] tracking-tight">
            Product Reviews
          </h3>
          <p className="text-xs text-[#7A7A7A] mt-1">
            Review items you have physically received in hand from your delivered orders.
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
            {eligibleItems.length > 0 ? (
              eligibleItems.map((item) => (
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
              ))
            ) : (
              <div className="py-8 text-center space-y-2">
                <ShoppingBag size={28} className="mx-auto text-gray-300" />
                <p className="text-xs text-[#7A7A7A]">
                  No delivered items found in your account yet. When an order arrives, review eligibility unlocks here.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate('/shop')}>
                  Browse Collection
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Your Submitted & Published Reviews */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden rounded-xs">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <Star size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                  Your Submitted Reviews ({myReviews.length})
                </h4>
                <p className="text-xs text-[#7A7A7A]">
                  Real-time status of your reviews (Pending moderation, Approved, or Published)
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#F0EDED]">
            {myReviews.map((rev) => (
              <div key={rev.id} className="p-6 flex flex-col md:flex-row items-start gap-5">
                <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#F9F9F9] border border-[#EBEBEB] shrink-0 overflow-hidden rounded-xs">
                  <img
                    src={rev.productImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg'}
                    alt={rev.productName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
                      <span>{rev.productName}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                          rev.status === 'approved'
                            ? 'bg-[#093624] text-[#F9F295]'
                            : rev.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : rev.status === 'hidden'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.status === 'approved'
                          ? 'Approved & Displayed'
                          : rev.status === 'rejected'
                          ? 'Rejected'
                          : rev.status === 'hidden'
                          ? 'Display Paused (Hidden)'
                          : 'Pending Moderation'}
                      </span>
                    </h5>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-[#093624]">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const fill = Math.max(0, Math.min(1, rev.rating - (s - 1)));
                        return (
                          <div key={s} className="relative inline-block w-3.5 h-3.5">
                            <Star size={14} className="text-gray-300" />
                            {fill > 0 && (
                              <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${fill * 100}%` }}
                              >
                                <Star size={14} className="fill-[#093624] text-[#093624]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <span className="text-[11px] font-bold text-[#093624] ml-1">
                        {rev.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#7A7A7A] text-[11px]">
                    {rev.orderId && <>Order: <strong className="text-[#141414]">#{rev.orderId}</strong> · </>}
                    Date: <span className="text-[#141414] font-satoshi-med">{rev.date}</span>
                  </p>

                  <p className="text-[#141414] text-xs leading-relaxed bg-[#FAF9F8] p-3 border border-gray-100 rounded-xs">
                    <strong className="text-[#55585B] font-satoshi-med">Your Review:</strong>{' '}
                    {rev.comment}
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    <button
                      onClick={() => handleDeleteMyReview(rev.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold font-satoshi-bold text-[#6D6868] hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {myReviews.length === 0 && (
              <div className="p-12 text-center text-xs text-[#7A7A7A]">
                You haven’t submitted any product reviews yet. Deliveries in hand are eligible above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Modal for Delivered Products */}
      {reviewModalItem && (
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
                onClick={() => setReviewModalItem(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xs border border-gray-100">
              <img
                src={reviewModalItem.image}
                alt={reviewModalItem.productName}
                className="w-14 h-16 object-cover object-top rounded-xs border border-gray-200"
              />
              <div className="text-xs space-y-0.5">
                <h4 className="font-bold font-satoshi-bold text-[#141414]">
                  {reviewModalItem.productName}
                </h4>
                <p className="text-[11px] text-gray-500">Order #{reviewModalItem.orderId}</p>
                <span className="inline-block text-[10px] font-bold text-[#093624] bg-[#F9F295]/70 px-1.5 py-0.2 rounded-xs">
                  Delivered ({reviewModalItem.deliveredDate})
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker with 0.5 increments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold font-satoshi-bold text-[#141414]">
                    Select Your Rating:
                  </label>
                  <span className="text-xs font-bold font-satoshi-bold text-[#093624]">
                    {rating !== null ? `${rating.toFixed(1)} / 5.0 Stars` : 'None selected (Required)'}
                  </span>
                </div>

                {/* 5 Interactive Stars supporting Full and Half clicks */}
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const currentRating = rating ?? 0;
                    const fillAmount = Math.max(0, Math.min(1, currentRating - (starNum - 1)));

                    return (
                      <div
                        key={starNum}
                        className="relative w-8 h-8 flex items-center justify-center cursor-pointer select-none group"
                      >
                        {/* Empty star background */}
                        <Star size={28} className="text-gray-200" />

                        {/* Filled portion */}
                        {fillAmount > 0 && (
                          <div
                            className="absolute top-0 left-0 overflow-hidden pointer-events-none"
                            style={{ width: `${fillAmount * 100}%` }}
                          >
                            <Star size={28} className="fill-[#093624] text-[#093624]" />
                          </div>
                        )}

                        {/* Left half clickable area (.5) */}
                        <button
                          type="button"
                          onClick={() => setRating(starNum - 0.5)}
                          aria-label={`Rate ${starNum - 0.5} stars`}
                          className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                        />

                        {/* Right half clickable area (full) */}
                        <button
                          type="button"
                          onClick={() => setRating(starNum)}
                          aria-label={`Rate ${starNum} stars`}
                          className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Quick Presets for 0.5 Intervals */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[11px] text-gray-500 mr-1">Quick Select:</span>
                  {[5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.0].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRating(val)}
                      className={`px-2 py-0.5 rounded-xs text-[11px] font-satoshi-bold border transition-colors cursor-pointer ${
                        rating === val
                          ? 'bg-[#093624] text-[#F9F295] border-[#093624]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {val.toFixed(1)} ★
                    </button>
                  ))}
                  {rating !== null && (
                    <button
                      type="button"
                      onClick={() => setRating(null)}
                      className="text-[11px] text-gray-400 hover:text-red-500 ml-1 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
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
                  disabled={isSubmitting}
                  onClick={() => setReviewModalItem(null)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Verified Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
