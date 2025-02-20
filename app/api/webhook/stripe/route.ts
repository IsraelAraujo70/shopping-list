import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed': {
      // Aqui você pode adicionar a lógica para quando um pagamento é completado
      // Por exemplo:
      // await prisma.order.update({
      //   where: { id: session.metadata?.orderId },
      //   data: { status: 'paid' }
      // });
      break;
    }
    case 'payment_intent.succeeded': {
      // Lógica para quando um pagamento é bem-sucedido
      break;
    }
    case 'payment_intent.payment_failed': {
      // Lógica para quando um pagamento falha
      break;
    }
  }

  return new NextResponse(null, { status: 200 });
} 