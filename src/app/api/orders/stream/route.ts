import { NextResponse } from 'next/server';
import { orderEvents } from '@/lib/orderEvents';

// GET: Server-Sent Events (SSE) stream for Real-Time Order Notifications
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial keep-alive / connection message
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to Real-time Orders Stream' })}\n\n`)
      );

      // Subscribe to real-time order creation events
      const unsubscribe = orderEvents.subscribe((payload) => {
        try {
          const sseData = `event: new_order\ndata: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
        } catch (err) {
          console.warn('Failed to push SSE message:', err);
        }
      });

      // Send ping every 25 seconds to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: {"time":${Date.now()}}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 25000);

      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        unsubscribe();
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
