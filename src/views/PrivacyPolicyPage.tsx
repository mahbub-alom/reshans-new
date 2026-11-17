'use client';

import React from 'react';
import { useShop } from '../context/ShopContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useShop();

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* 1. Breadcrumb Area matching .aq-breadcrumb-area */}
      <div className="py-16 sm:py-20 bg-[#F9F9F9] border-b border-[#F0EDED]">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#6D6868] font-satoshi-bold mb-3">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              home
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-[#093624]">privacy policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#141414] font-satoshi-bold mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[#6D6868] font-satoshi">
            Shop through our latest selection of Fashion with total security and confidence
          </p>
        </div>
      </div>

      {/* 2. Privacy Policy Content Area matching .aq-privacy-policy-area & .aq-privacy-box */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="bg-white p-6 sm:p-12 lg:p-14 border border-[#EBEBEB] rounded-xs shadow-2xs space-y-10">
            {/* Section: Introduction */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Introduction
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                At Reshans, we value your privacy and are committed to protecting your personal information. This Privacy Policy is designed to help you understand how we collect, use, disclose, and safeguard your data when browsing our online boutique, placing orders, or visiting our physical showrooms. By using our website or services, you consent to the practices described in this policy.
              </p>
            </div>

            {/* Section: Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Information We Collect
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed mb-4 font-satoshi">
                We may collect various types of information from you to ensure seamless order fulfillment, including:
              </p>
              <ul className="space-y-2.5 text-base text-[#57575A] font-satoshi pl-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#141414] font-satoshi-bold">Personal Information:</strong> Name, phone number, shipping address, and email for dispatch confirmations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#141414] font-satoshi-bold">Billing Information:</strong> Payment transaction tokens (bKash, Nagad, Visa, Mastercard) encrypted via certified payment gateways.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#141414] font-satoshi-bold">Usage Data:</strong> Pages visited, wishlist preferences, and browsing interactions to improve sizing recommendations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#141414] font-satoshi-bold">Cookies and Tracking Data:</strong> Session cookies that remember your cart selections and account credentials.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section: How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                How We Use Your Information
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed mb-4 font-satoshi">
                We use your information for the following legitimate purposes:
              </p>
              <ul className="space-y-2.5 text-base text-[#57575A] font-satoshi pl-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>To provide, maintain, and improve our services and fabric offerings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>To process transactions and send real-time courier tracking updates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>To respond swiftly to your sizing inquiries, comments, or exchange requests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>To personalize your user experience with curated seasonal lookbooks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57575A] mt-2.5 shrink-0" />
                  <span>To send you important notices, policy updates, and security announcements.</span>
                </li>
              </ul>
            </div>

            {/* Section: Information Sharing */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Information Sharing
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                We strictly do not sell, trade, or rent your personal information to third-party marketing brokers. We only share details with trusted logistics couriers (e.g., RedX, Steadfast, Pathao) and PCI-DSS compliant payment gateways strictly necessary to fulfill delivery to your doorstep.
              </p>
            </div>

            {/* Section: Data Security */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Data Security
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                We implement industry-standard 256-bit SSL encryption, automated firewall protections, and regular vulnerability audits to ensure your sensitive records remain guarded against unauthorized access.
              </p>
            </div>

            {/* Section: Cookies and Tracking */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                We employ cookies to enhance session continuity and prevent shopping cart losses. You can choose to disable cookies through your browser settings; however, certain interactive features of our checkout flow may be impaired.
              </p>
            </div>

            {/* Section: Your Choices */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Your Choices
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                You retain the right to review, update, or request the deletion of your account profile at any time by contacting our privacy compliance desk.
              </p>
            </div>

            {/* Section: Changes to Policy */}
            <div>
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-4">
                Changes to this Privacy Policy
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                We reserve the right to revise this Privacy Policy periodically. Any amendments will be reflected on this page with an updated timestamp. We recommend checking back regularly to stay informed.
              </p>
            </div>

            {/* Section: Contact Us */}
            <div className="pt-2 border-t border-[#F0EDED]">
              <h2 className="text-2xl font-bold font-satoshi-med text-[#141414] mb-3">
                Contact Us
              </h2>
              <p className="text-base text-[#57575A] leading-relaxed font-satoshi">
                If you have questions, feedback, or concerns regarding your privacy rights, please write to our compliance team at{' '}
                <a href="mailto:Reshans@gmail.com" className="text-[#093624] font-bold hover:underline font-satoshi-bold">
                  Reshans@gmail.com
                </a>{' '}
                or reach our hotline at (+880) 1700 000 000.
              </p>
            </div>

            {/* Timestamp Notice */}
            <div className="pt-4 border-t border-[#F0EDED]">
              <p className="text-xs sm:text-sm italic text-[#6D6868] font-satoshi leading-relaxed">
                Last updated on November 2026. Reshans reserves the right to modify or amend the above contents at any time without prior individual notice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
