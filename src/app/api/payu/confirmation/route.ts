import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      reference_sale,
      state_pol,
    } = body;

    console.log('CONFIRMATION:', body);

    // Here you could verify the signature again
    if (state_pol === '4') {
      // state 4 = Approved
      // Save to database or change order status
      console.log(`✅ Payment approved for order ${reference_sale}`);
    } else {
      console.log(`❌ Payment not approved for order ${reference_sale} (state: ${state_pol})`);
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('Error processing PayU confirmation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 