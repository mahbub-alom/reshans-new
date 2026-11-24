import React, { useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Printer, Download, ArrowLeft, ShieldCheck } from 'lucide-react';

export const DashboardInvoiceDetailsPage: React.FC = () => {
  const { navigate, formatPrice, selectedOrder, settings } = useShop();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!selectedOrder) {
    return (
      <DashboardLayout activeTab="invoice-details" title="Invoice Details">
        <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs space-y-4">
          <p className="text-brand-body text-sm font-satoshi">No invoice found or order not selected.</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/invoices')}>
            Back to Invoices
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const order = selectedOrder;
  const invoiceCode = order.trackingNumber || `INV-${order.id}`;
  const subtotal = order.subtotal || order.total;
  const discount = order.discount || 0;
  const shippingCost = order.shippingCost || 0;
  const grandTotal = order.total;
  const isPaid = order.paymentStatus === 'Paid';

  // Real Dedicated Print Function: creates an isolated print window containing exclusively the invoice document
  const handlePrint = () => {
    if (typeof window === 'undefined') return;

    const invoiceElement = document.getElementById('real-invoice-printable');
    if (!invoiceElement) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceCode}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            @page {
              size: A4;
              margin: 15mm 15mm 15mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #141414;
              background: #ffffff;
              padding: 24px;
              line-height: 1.5;
              font-size: 12px;
            }
            .header-bar {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #141414;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .brand-name {
              font-size: 26px;
              font-weight: 900;
              color: #093624;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .brand-badge {
              font-size: 10px;
              background: #F9F295;
              color: #093624;
              font-weight: bold;
              padding: 2px 6px;
              letter-spacing: 1.5px;
              margin-left: 6px;
              text-transform: uppercase;
            }
            .company-info {
              color: #6D6868;
              font-size: 11px;
              margin-top: 6px;
              max-width: 320px;
            }
            .invoice-meta {
              text-align: right;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: 800;
              color: #141414;
              letter-spacing: 1px;
            }
            .invoice-badge {
              display: inline-block;
              margin-top: 6px;
              padding: 3px 10px;
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              background: ${isPaid ? '#093624' : '#fef08a'};
              color: ${isPaid ? '#F9F295' : '#854d0e'};
            }
            .address-grid {
              display: flex;
              justify-content: space-between;
              padding-bottom: 20px;
              margin-bottom: 20px;
              border-bottom: 1px solid #ebebeb;
            }
            .addr-label {
              font-size: 10px;
              font-weight: bold;
              color: #9ca3af;
              text-transform: uppercase;
              margin-bottom: 6px;
            }
            .table-container {
              margin-bottom: 24px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th {
              border-bottom: 2px solid #141414;
              padding: 10px 8px;
              text-align: left;
              text-transform: uppercase;
              font-size: 11px;
              color: #141414;
            }
            td {
              padding: 12px 8px;
              border-bottom: 1px solid #f3f4f6;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .summary-section {
              display: flex;
              justify-content: space-between;
              border-top: 2px solid #141414;
              padding-top: 18px;
            }
            .terms-box {
              max-width: 340px;
              font-size: 11px;
              color: #6D6868;
            }
            .totals-box {
              width: 260px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 12px;
              color: #6D6868;
            }
            .totals-row.grand {
              border-top: 2px solid #141414;
              padding-top: 8px;
              margin-top: 8px;
              font-size: 16px;
              font-weight: bold;
              color: #093624;
            }
            .footer-seal {
              margin-top: 40px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <div style="display:flex; align-items:center;">
                <span class="brand-name">RESHANS</span>
                <span class="brand-badge">Atelier</span>
              </div>
              <p class="company-info">${settings?.address || 'Plot 29, Road 11, Gulshan 2, Dhaka 1212, Bangladesh'}</p>
              <p class="company-info">Hotline: ${settings?.phone || '+880 1700 000 000'} | ${settings?.email || 'concierge@reshans.com'}</p>
            </div>
            <div class="invoice-meta">
              <div class="invoice-title">INVOICE</div>
              <p style="margin-top:4px;"><strong>Invoice No:</strong> ${invoiceCode}</p>
              <p><strong>Order Ref:</strong> #${order.id}</p>
              <p><strong>Date:</strong> ${order.date}</p>
              <div><span class="invoice-badge">Payment: ${order.paymentStatus}</span></div>
            </div>
          </div>

          <div class="address-grid">
            <div>
              <div class="addr-label">Billed & Shipped To:</div>
              <p style="font-size:14px; font-weight:bold;">${order.customerName}</p>
              <p>${order.customerPhone}</p>
              ${order.customerEmail ? `<p>${order.customerEmail}</p>` : ''}
              <p style="margin-top:4px; max-width:320px; color:#4b5563;">
                ${order.customerAddress}
                ${order.area || order.city || order.postalCode ? `<br/><span>${[order.area, order.city, order.postalCode ? `(${order.postalCode})` : ''].filter(Boolean).join(', ')}</span>` : ''}
              </p>
            </div>
            <div style="text-align:right;">
              <div class="addr-label">Order Details:</div>
              <p>Payment Channel: <strong>${order.paymentMethod}</strong></p>
              <p>Fulfillment Status: <strong>${order.orderStatus}</strong></p>
              ${order.trackingNumber ? `<p>Consignment: <strong>${order.trackingNumber}</strong></p>` : ''}
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width:30px;">#</th>
                  <th>Item Description</th>
                  <th class="text-center">Color / Size</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((it, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>
                      <strong>${it.product.name}</strong>
                      <div style="font-size:10px; color:#6b7280;">SKU: ${it.product.sku || it.product.id}</div>
                    </td>
                    <td class="text-center">${it.selectedColor || 'Standard'} / ${it.selectedSize || 'Standard'}</td>
                    <td class="text-right">${formatPrice(it.product.price)}</td>
                    <td class="text-center"><strong>${it.quantity}</strong></td>
                    <td class="text-right"><strong>${formatPrice(it.product.price * it.quantity)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="summary-section">
            <div class="terms-box">
              <p style="font-weight:bold; color:#141414; margin-bottom:4px;">Terms & Verification:</p>
              <p>This is an authentic computer-generated invoice for Reshans Atelier purchases. Valid for exchanges within 7 days across Dhaka & Bangladesh.</p>
              ${order.note ? `<p style="margin-top:6px; font-style:italic;">Note: ${order.note}</p>` : ''}
            </div>
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              ${discount > 0 ? `
              <div class="totals-row" style="color:#093624; font-weight:bold;">
                <span>Discount:</span>
                <span>-${formatPrice(discount)}</span>
              </div>` : ''}
              <div class="totals-row">
                <span>Delivery Fee:</span>
                <span>${shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</span>
              </div>
              <div class="totals-row grand">
                <span>Grand Total:</span>
                <span>${formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div class="footer-seal">
            <span>Official Computer-Generated Tax Invoice • Reshans Atelier Dhaka</span>
            <span>www.reshans.com</span>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Trigger print preview inside the popup window
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch {}
    }, 400);
  };

  return (
    <DashboardLayout activeTab="invoice-details" title={`Invoice ${invoiceCode}`}>
      <div className="space-y-6">
        {/* Top Header Actions (hidden during browser window print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => navigate('/dashboard/invoices')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Invoices</span>
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={<Printer size={15} />}
              onClick={handlePrint}
            >
              Print Invoice
            </Button>
            <Button
              variant="black"
              size="sm"
              icon={<Download size={15} />}
              onClick={handlePrint}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Real Printable Invoice Document */}
        <div
          id="real-invoice-printable"
          ref={invoiceRef}
          className="bg-white border border-[#EBEBEB] p-8 sm:p-12 shadow-sm font-satoshi text-brand-black print:p-0 print:border-none print:shadow-none"
        >
          {/* Invoice Header: Company Branding & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b-2 border-brand-black">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-satoshi-bold uppercase tracking-wider text-[#093624]">
                  RESHANS
                </span>
                <span className="text-xs px-2 py-0.5 bg-[#F9F295] text-[#093624] font-bold uppercase tracking-widest">
                  Atelier
                </span>
              </div>
              <p className="text-xs text-brand-body leading-relaxed max-w-sm">
                {settings?.address || 'Plot 29, Road 11, Gulshan 2, Dhaka 1212, Bangladesh'}
              </p>
              <p className="text-xs text-brand-body">
                Hotline: {settings?.phone || '+880 1700 000 000'} | {settings?.email || 'concierge@reshans.com'}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <h2 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight uppercase">
                INVOICE
              </h2>
              <p className="text-xs text-brand-body">
                Invoice No: <strong className="text-brand-black font-satoshi-bold font-mono">{invoiceCode}</strong>
              </p>
              <p className="text-xs text-brand-body">
                Order Ref: <strong className="text-brand-black font-satoshi-med font-mono">#{order.id}</strong>
              </p>
              <p className="text-xs text-brand-body">
                Date: <strong className="text-brand-black">{order.date}</strong>
              </p>
              <div className="pt-1">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider font-satoshi-bold ${
                    isPaid
                      ? 'bg-[#093624] text-[#F9F295]'
                      : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                  }`}
                >
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To / Shipping Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-[#F0EDED] text-xs">
            <div>
              <span className="block font-bold font-satoshi-bold uppercase tracking-wider text-gray-400 mb-2">
                Billed & Shipped To:
              </span>
              <h3 className="text-base font-bold font-satoshi-bold text-brand-black mb-1">
                {order.customerName}
              </h3>
              <p className="text-brand-body">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-brand-body">{order.customerEmail}</p>}
              <p className="text-brand-body mt-1 leading-relaxed max-w-sm">
                {order.customerAddress}
              </p>
              {(order.area || order.city || order.postalCode) && (
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                  {order.city && (
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 font-medium">
                      District: {order.city}
                    </span>
                  )}
                  {order.area && (
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 font-medium">
                      Thana: {order.area}
                    </span>
                  )}
                  {order.postalCode && (
                    <span className="px-2 py-0.5 bg-[#093624]/10 border border-[#093624]/20 text-[#093624] font-mono font-bold">
                      Postcode: {order.postalCode}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="sm:text-right space-y-1.5">
              <span className="block font-bold font-satoshi-bold uppercase tracking-wider text-gray-400 mb-2">
                Payment & Fulfillment:
              </span>
              <p className="text-brand-body">
                Payment Method: <strong className="text-brand-black font-satoshi-med">{order.paymentMethod}</strong>
              </p>
              <p className="text-brand-body">
                Fulfillment Status: <strong className="text-brand-black font-satoshi-med">{order.orderStatus}</strong>
              </p>
              {order.trackingNumber && (
                <p className="text-brand-body">
                  Consignment No: <strong className="font-mono text-[#093624] font-bold">{order.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-black text-brand-black uppercase font-satoshi-bold text-[11px] tracking-wider">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Item Description</th>
                  <th className="py-3 px-2 text-center">Color / Size</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDED]">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-4 px-2 text-brand-body font-mono">{idx + 1}</td>
                    <td className="py-4 px-2">
                      <p className="font-bold font-satoshi-bold text-brand-black text-sm">
                        {it.product.name}
                      </p>
                      <p className="text-[11px] text-brand-body">
                        SKU: {it.product.sku || it.product.id}
                      </p>
                    </td>
                    <td className="py-4 px-2 text-center text-brand-body">
                      {it.selectedColor || 'Default'} / {it.selectedSize || 'Standard'}
                    </td>
                    <td className="py-4 px-2 text-right font-medium text-brand-black tabular-nums">
                      {formatPrice(it.product.price)}
                    </td>
                    <td className="py-4 px-2 text-center font-bold text-brand-black tabular-nums">
                      {it.quantity}
                    </td>
                    <td className="py-4 px-2 text-right font-bold font-satoshi-bold text-brand-black tabular-nums">
                      {formatPrice(it.product.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotals & Grand Total Summary */}
          <div className="border-t-2 border-brand-black pt-6 flex flex-col sm:flex-row justify-between gap-6">
            <div className="max-w-sm text-xs text-brand-body space-y-2">
              <span className="font-bold font-satoshi-bold text-brand-black block uppercase tracking-wider">
                Terms & Notes:
              </span>
              <p className="leading-relaxed">
                Thank you for choosing Reshans Atelier. All orders delivered across Bangladesh are guaranteed 100% authentic. Returns and size exchanges are accepted within 7 days.
              </p>
              {order.note && (
                <p className="italic text-brand-black">
                  Special Note: {order.note}
                </p>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-brand-body">
                <span>Subtotal:</span>
                <span className="font-medium text-brand-black tabular-nums">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-brand-body">
                  <span>Promotional Discount:</span>
                  <span className="font-bold text-[#093624] tabular-nums">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-body">
                <span>Delivery Charge:</span>
                <span className="font-medium text-brand-black tabular-nums">
                  {shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}
                </span>
              </div>

              <div className="pt-3 border-t-2 border-brand-black flex justify-between items-center text-base font-bold font-satoshi-bold text-brand-black">
                <span>Total Amount:</span>
                <span className="text-xl text-[#093624] font-satoshi-bold tabular-nums">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Footer Seal */}
          <div className="mt-12 pt-6 border-t border-[#F0EDED] flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-body gap-4">
            <div className="flex items-center gap-2 text-brand-black font-satoshi-bold">
              <ShieldCheck size={16} className="text-[#093624]" />
              <span>Official Computer Generated Tax Invoice</span>
            </div>
            <p>Authorized by Reshans Atelier Dhaka • www.reshans.com</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
