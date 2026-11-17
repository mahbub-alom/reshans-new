'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';
import { ChevronRight, ArrowRight, Check } from 'lucide-react';

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
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M2.90439 16.4477C2.11103 16.4477 1.45312 15.7898 1.45312 14.9964V1.45126C1.45312 0.657907 2.11103 0 2.90439 0C3.69774 0 4.35565 0.657907 4.35565 1.45126V14.9964C4.35565 15.7898 3.69774 16.4477 2.90439 16.4477Z" fill="currentColor" />
                  <path opacity="0.4" d="M26.1231 16.4477C25.3298 16.4477 24.6719 15.7898 24.6719 14.9964V1.45126C24.6719 0.657907 25.3298 0 26.1231 0C26.9165 0 27.5744 0.657907 27.5744 1.45126V14.9964C27.5744 15.7898 26.9165 16.4477 26.1231 16.4477Z" fill="currentColor" />
                  <path opacity="0.4" d="M14.5138 6.77257C13.7204 6.77257 13.0625 6.11466 13.0625 5.3213V1.45126C13.0625 0.657907 13.7204 0 14.5138 0C15.3071 0 15.965 0.657907 15.965 1.45126V5.3213C15.965 6.11466 15.3071 6.77257 14.5138 6.77257Z" fill="currentColor" />
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <path d="M26.4339 16.1254C25.7889 16.1254 25.2789 15.6004 25.2789 14.9704C25.2789 14.4154 24.7239 13.2604 23.7939 12.2554C22.8789 11.2804 21.8739 10.7104 21.0339 10.7104C20.3889 10.7104 19.8789 10.1854 19.8789 9.55539C19.8789 8.92539 20.4039 8.40039 21.0339 8.40039C22.5339 8.40039 24.1089 9.21039 25.4889 10.6654C26.7789 12.0304 27.6039 13.7254 27.6039 14.9554C27.6039 15.6004 27.0789 16.1254 26.4339 16.1254Z" fill="currentColor"/>
                  <path d="M17.6889 21.315L12.7839 26.22C12.2439 25.74 11.7189 25.245 11.2089 24.735C9.66391 23.175 8.26891 21.54 7.02391 19.83C5.79391 18.12 4.80391 16.41 4.08391 14.715C3.36391 13.005 3.00391 11.37 3.00391 9.81C3.00391 8.79 3.18391 7.815 3.54391 6.915C3.90391 6 4.47391 5.16 5.26891 4.41C6.22891 3.465 7.27891 3 8.38891 3C8.80891 3 9.22891 3.09 9.60391 3.27C9.99391 3.45 10.3389 3.72 10.6089 4.11L14.0889 9.015C14.3589 9.39 14.5539 9.735 14.6889 10.065C14.8239 10.38 14.8989 10.695 14.8989 10.98C14.8989 11.34 14.7939 11.7 14.5839 12.045C14.3889 12.39 14.1039 12.75 13.7439 13.11L12.6039 14.295C12.4389 14.46 12.3639 14.655 12.3639 14.895C12.3639 15.015 12.3789 15.12 12.4089 15.24C12.4539 15.36 12.4989 15.45 12.5289 15.54C12.7989 16.035 13.2639 16.68 13.9239 17.46C14.5989 18.24 15.3189 19.035 16.0989 19.83C16.6389 20.355 17.1639 20.865 17.6889 21.315Z" fill="currentColor"/>
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30" fill="none">
                  <path d="M25.6097 9.80488C24.0731 3.0439 18.1756 0 12.9951 0C12.9951 0 12.9951 0 12.9805 0C7.8146 0 1.90241 3.02927 0.365822 9.79024C-1.34637 17.3415 3.27802 23.7366 7.46338 27.761C9.0146 29.2537 11.0048 30 12.9951 30C14.9853 30 16.9756 29.2537 18.5122 27.761C22.6975 23.7366 27.3219 17.3561 25.6097 9.80488Z" fill="currentColor"/>
                  <path d="M12.9965 17.1365C15.5424 17.1365 17.6062 15.0726 17.6062 12.5267C17.6062 9.98085 15.5424 7.91699 12.9965 7.91699C10.4506 7.91699 8.38672 9.98085 8.38672 12.5267C8.38672 15.0726 10.4506 17.1365 12.9965 17.1365Z" fill="white"/>
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 30 30" fill="none">
                  <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="currentColor"/>
                  <path d="M20.5737 20.8976C20.3787 20.8976 20.1837 20.8526 20.0037 20.7326L15.3537 17.9576C14.1987 17.2676 13.3438 15.7526 13.3438 14.4176V8.26758C13.3438 7.65258 13.8537 7.14258 14.4687 7.14258C15.0837 7.14258 15.5937 7.65258 15.5937 8.26758V14.4176C15.5937 14.9576 16.0437 15.7526 16.5087 16.0226L21.1587 18.7976C21.6987 19.1126 21.8637 19.8026 21.5487 20.3426C21.3237 20.7026 20.9487 20.8976 20.5737 20.8976Z" fill="white"/>
                </svg>
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
            <div className="lg:col-span-6 h-[420px] lg:h-[580px] rounded-xs overflow-hidden shadow-md border border-[#E0DCD9]">
              <iframe
                title="Reshans Flagship Dhaka Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14606.069907157642!2d90.4072223!3d23.7915556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70deb73%3A0x30c36498f90fe23!2sGulshan-2%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#093624] block mb-2 font-satoshi-bold">
                Faq’s section
              </span>
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
