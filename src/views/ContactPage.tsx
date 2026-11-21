'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';
import { ChevronRight, ArrowRight, Check, MessageSquareHeart, PhoneCall, MapPin, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigate } = useShop();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    agree: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '', agree: false });
    }, 4500);
  };

  const FAQS = [
    {
      q: 'What is the return process?',
      a: 'We offer complimentary returns within 30 days of delivery. Items must be unworn, with original tags intact and packaging preserved. Contact our concierge or initiate a return directly from your Reshans account.',
    },
    {
      q: 'Can I cancel my order after placing it?',
      a: 'Orders can be modified or canceled within 2 hours of placement before our Dhaka fulfillment center dispatches parcels. Reach out to (+880) 1700 000 000 for expedited support.',
    },
    {
      q: 'How can I check the status of my order?',
      a: 'Once your package is picked up by our shipping partners, you will receive real-time SMS and email tracking links covering all 64 districts of Bangladesh.',
    },
    {
      q: 'Which items are not eligible for return?',
      a: 'For hygiene and personalized craftsmanship reasons, intimates, customized bespoke garments, and clearance items designated as final sale cannot be exchanged or returned.',
    },
    {
      q: 'How long does it take to receive a refund after a return?',
      a: 'Upon inspection at our Dhaka central hub, refunds are credited back to your original payment channel (bKash, Nagad, Visa, Mastercard) within 3 to 5 business days.',
    },
    {
      q: 'What should I do if I receive a damaged or incorrect product?',
      a: 'Please photograph the packaging and garment, then email Reshans@gmail.com or message our customer care hotline. We will arrange an immediate doorstep swap without extra courier fees.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* 1. Breadcrumb Top Area matching .aq-breadcrumb-ptb */}
      <div className="pt-16 sm:pt-24 pb-12 sm:pb-16 bg-[#FAFAFA] border-b border-[#F0EDED]">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6 text-center">
          {/* Breadcrumb Links */}
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#6D6868] font-satoshi-bold mb-4">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              home
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-[#093624]">contact us</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#141414] font-satoshi-bold mb-3 tracking-tight">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-[#6D6868] max-w-xl mx-auto font-satoshi">
            Our teams are here to help. Reach out with inquiries, styling questions, or order assistance.
          </p>
        </div>
      </div>

      {/* 2. Contact Info 4-Card Area matching .aq-contact-info-area */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Card 1: Feedbacks */}
            <div className="bg-[#F9F9F9] rounded-xs p-8 sm:p-10 text-center border border-[#F0EDED] hover:border-[#093624]/30 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
                <MessageSquareHeart size={28} />
              </div>
              <h3 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-2">Feedbacks</h3>
              <p className="text-[#6D6868] text-sm mb-5 font-satoshi">Speak to our Friendly team.</p>
              <a
                href="mailto:Reshans@gmail.com"
                className="text-base font-bold text-[#093624] hover:underline font-satoshi-bold"
              >
                Reshans@gmail.com
              </a>
            </div>

            {/* Card 2: Call Us */}
            <div className="bg-[#F9F9F9] rounded-xs p-8 sm:p-10 text-center border border-[#F0EDED] hover:border-[#093624]/30 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
               <PhoneCall size={28} />
              </div>
              <h3 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-2">Call Us</h3>
              <p className="text-[#6D6868] text-sm mb-5 font-satoshi">Mon-Fri from 8am to 5pm</p>
              <a
                href="tel:+8801700000000"
                className="text-base font-bold text-[#093624] hover:underline font-satoshi-bold"
              >
                (+880) 1700 000 000
              </a>
            </div>

            {/* Card 3: Visit Us */}
            <div className="bg-[#F9F9F9] rounded-xs p-8 sm:p-10 text-center border border-[#F0EDED] hover:border-[#093624]/30 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-2">Visit Us</h3>
              <p className="text-[#6D6868] text-sm mb-5 font-satoshi">Visit our flagship showroom.</p>
              <span className="text-base font-bold text-[#093624] font-satoshi-bold block">
                Gulshan 2, Dhaka 1212
              </span>
            </div>

            {/* Card 4: Open Time */}
            <div className="bg-[#F9F9F9] rounded-xs p-8 sm:p-10 text-center border border-[#F0EDED] hover:border-[#093624]/30 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-2">Open Time:</h3>
              <p className="text-[#6D6868] text-sm mb-5 font-satoshi">Customer Care Hours</p>
              <span className="text-base font-bold text-[#093624] font-satoshi-bold block">
                Everyday 9am to 10pm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Map & Contact Form matching .aq-contact-ptb */}
      <div className="bg-[#F2F2F2] py-20 lg:py-28 relative">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Google Map embed */}
            <div className="lg:col-span-6 h-[420px] lg:h-[660px] rounded-xs overflow-hidden shadow-md border border-[#E0DCD9]">
     <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d190.46062524942928!2d90.41110858973208!3d23.778060531534372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sbd!4v1795288481449!5m2!1sen!2sbd" width="100%" height="100%" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>

            {/* Right: Contact Form matching .aq-contact-us-wrap */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-12 rounded-xs shadow-md border border-[#E0DCD9]">
              <h2 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-[#141414] mb-2">
                Send a Message
              </h2>
              <p className="text-[#6D6868] text-sm mb-8 font-satoshi">
                Have questions regarding sizing, custom collections, or delivery? Write to us below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-2 font-satoshi-bold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mahbub Alom"
                      className="w-full h-13 px-4 bg-white border border-[#D5D2D0] rounded-none text-sm text-[#141414] focus:outline-none focus:border-[#093624] font-satoshi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-2 font-satoshi-bold">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full h-13 px-4 bg-white border border-[#D5D2D0] rounded-none text-sm text-[#141414] focus:outline-none focus:border-[#093624] font-satoshi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-2 font-satoshi-bold">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Order query, fabric inquiry, partnership"
                    className="w-full h-13 px-4 bg-white border border-[#D5D2D0] rounded-none text-sm text-[#141414] focus:outline-none focus:border-[#093624] font-satoshi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-2 font-satoshi-bold">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our styling team help you today?"
                    className="w-full p-4 bg-white border border-[#D5D2D0] rounded-none text-sm text-[#141414] focus:outline-none focus:border-[#093624] font-satoshi resize-none"
                  />
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="contact-agree"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    required
                    className="mt-1 h-4 w-4 accent-[#093624] rounded-none cursor-pointer"
                  />
                  <label htmlFor="contact-agree" className="text-xs text-[#6D6868] font-satoshi cursor-pointer">
                    I agree that my submitted data is being collected and stored according to the Reshans privacy policy.
                  </label>
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight size={16} />}
                  >
                    Send Message
                  </Button>
                </div>

                {isSubmitted && (
                  <div className="p-4 bg-[#093624]/10 border border-[#093624] text-[#093624] text-sm font-satoshi-bold rounded-xs flex items-center gap-2">
                    <Check size={18} />
                    <span>Thank you! Your message has been dispatched to the Reshans concierge team.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAQ Accordion Area matching .aq-contact-faq-area */}
      <div className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left Box */}
            <div className="lg:col-span-5">
           
              <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-bold text-[#141414] font-satoshi-bold leading-tight mb-6">
                Frequently <br className="hidden sm:inline" /> Asked Questions
              </h2>
              <p className="text-[#6D6868] text-sm sm:text-base leading-relaxed mb-8 font-satoshi">
                Need immediate answers about sizing, deliveries across Bangladesh, exchanges, or store pickup? Browse through our customer FAQs or speak directly to a Reshans specialist.
              </p>
              <a
                href="tel:+8801700000000"
                className="inline-flex items-center gap-3 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] px-8 py-3.5 text-xs font-bold uppercase tracking-wider font-satoshi-bold transition-colors cursor-pointer"
              >
                <span>Call Hotline</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Right: Accordion */}
            <div className="lg:col-span-7 space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-[#E0DCD9] rounded-xs overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-white hover:bg-[#F9F9F9] transition-colors cursor-pointer"
                    >
                      <span className="text-base sm:text-lg font-bold text-[#141414] font-satoshi-bold pr-4">
                        {faq.q}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-gray-300 text-sm font-bold transition-transform duration-300 ${
                          isOpen ? 'rotate-90 bg-[#093624] text-[#F9F295] border-[#093624]' : 'text-gray-500'
                        }`}
                      >
                        <ChevronRight size={14} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-[#6D6868] text-sm sm:text-[15px] leading-relaxed border-t border-[#F2F2F2] font-satoshi">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
