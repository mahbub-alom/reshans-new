import { Order } from '@/types';

export const downloadOrderInvoice = (order: Order, formatPrice: (n: number) => string) => {
  if (typeof window === 'undefined') return;

  const trackingCode = order.trackingNumber || order.id;
  const orderId = order.id;
  const dateStr = order.date || new Date().toISOString().substring(0, 10);
  const subtotal =
    order.subtotal !== undefined
      ? order.subtotal
      : order.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const discount = order.discount || 0;
  const shipping = order.shippingCost !== undefined ? order.shippingCost : 60;
  const total = order.total;

  const itemsHtml = order.items
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #ebebeb;">
        <td style="padding: 12px 8px; font-size: 13px; color: #141414;">
          <strong>${it.product.name}</strong>
          ${it.selectedSize ? `<span style="color: #666; font-size: 11px;"> | Size: ${it.selectedSize}</span>` : ''}
          ${it.selectedColor ? `<span style="color: #666; font-size: 11px;"> | Color: ${it.selectedColor}</span>` : ''}
        </td>
        <td style="padding: 12px 8px; font-size: 13px; text-align: center; color: #141414;">${it.quantity}</td>
        <td style="padding: 12px 8px; font-size: 13px; text-align: right; color: #141414;">৳ ${it.product.price.toLocaleString()}</td>
        <td style="padding: 12px 8px; font-size: 13px; text-align: right; font-weight: bold; color: #093624;">৳ ${(it.product.price * it.quantity).toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${orderId} - Reshans Fashion</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #141414; background: #ffffff; }
        .invoice-box { max-width: 800px; margin: auto; border: 1px solid #ebebeb; padding: 36px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #093624; padding-bottom: 20px; margin-bottom: 28px; }
        .brand { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #093624; }
        .brand span { color: #8F802B; }
        .badge { display: inline-block; background: #093624; color: #F9F295; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 2px; text-transform: uppercase; margin-top: 6px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
        .meta-col h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
        .meta-col p { margin: 0 0 4px 0; font-size: 13px; line-height: 1.5; }
        .tracking-box { background: #f9f9f9; border-left: 3px solid #093624; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f4f4f4; text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #333; }
        .totals { margin-left: auto; width: 280px; }
        .totals tr td { padding: 6px 0; font-size: 13px; }
        .totals tr.grand-total td { font-size: 16px; font-weight: bold; color: #093624; border-top: 2px solid #093624; padding-top: 10px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ebebeb; font-size: 11px; color: #888; }
        @media print {
          body { padding: 0; }
          .invoice-box { border: none; box-shadow: none; padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="brand">RESHANS<span>.</span></div>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">Exclusive Apparel & Lifestyle Atelier</div>
            <div class="badge">Official Tax Invoice</div>
          </div>
          <div style="text-align: right; font-size: 13px;">
            <div style="font-size: 18px; font-weight: bold; color: #093624;">INVOICE #${orderId}</div>
            <div style="color: #666; margin-top: 4px;">Date: ${dateStr}</div>
            <div style="color: #666;">Payment: ${order.paymentMethod} (${order.paymentStatus})</div>
          </div>
        </div>

        <div class="tracking-box">
          <strong>Order Tracking ID:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #093624; margin-left: 6px;">${trackingCode}</span>
          <div style="color: #666; font-size: 11px; margin-top: 3px;">Use this unique Tracking ID anytime at Reshans Order Tracking portal.</div>
        </div>

        <div class="meta-grid">
          <div class="meta-col">
            <h4>Billed & Delivered To:</h4>
            <p><strong>${order.customerName}</strong></p>
            <p>Phone: ${order.customerPhone}</p>
            <p>Email: ${order.customerEmail}</p>
            <p>${order.customerAddress}</p>
          </div>
          <div class="meta-col" style="text-align: right;">
            <h4>Issued By:</h4>
            <p><strong>Reshans Fashion Atelier</strong></p>
            <p>Gulshan-2, Dhaka 1212</p>
            <p>Phone: +880 1977 378 642</p>
            <p>Web: www.reshans.com</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Garment / Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <table class="totals">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">৳ ${subtotal.toLocaleString()}</td>
            </tr>
            ${discount > 0 ? `<tr><td>Discount (${order.couponCode || 'Coupon'}):</td><td style="text-align: right; color: #16a34a;">-৳ ${discount.toLocaleString()}</td></tr>` : ''}
            <tr>
              <td>Shipping / Delivery:</td>
              <td style="text-align: right;">${shipping === 0 ? 'FREE' : `৳ ${shipping.toLocaleString()}`}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Paid:</td>
              <td style="text-align: right;">৳ ${total.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for shopping with Reshans! For exchanges or inquiries, contact care@reshans.com or call +880 1977 378 642.</p>
          <p style="font-size: 10px; color: #aaa;">This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 350);
  }
};
