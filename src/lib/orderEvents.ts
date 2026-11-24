// In-memory or global event hub for Real-Time Server-Sent Events (SSE)
// Allows instant 0-second order notifications to all connected Admin clients

export interface OrderNotificationPayload {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  total: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus?: string;
  date: string;
  timestamp: number;
}

type ClientListener = (data: OrderNotificationPayload) => void;

class OrderEventsManager {
  private listeners: Set<ClientListener> = new Set();

  public subscribe(listener: ClientListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notifyOrder(order: OrderNotificationPayload) {
    for (const listener of this.listeners) {
      try {
        listener(order);
      } catch (err) {
        console.warn('Error broadcasting order event:', err);
      }
    }
  }

  public getSubscriberCount() {
    return this.listeners.size;
  }
}

// Global singleton across serverless / route reloads
const globalForOrders = globalThis as unknown as {
  orderEventsManager?: OrderEventsManager;
};

export const orderEvents = globalForOrders.orderEventsManager ?? new OrderEventsManager();

if (process.env.NODE_ENV !== 'production') {
  globalForOrders.orderEventsManager = orderEvents;
}
