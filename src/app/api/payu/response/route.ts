import { NextResponse } from 'next/server';

// PayU Transaction States
const TRANSACTION_STATES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  EXPIRED: 'EXPIRED',
  ERROR: 'ERROR'
};

// Map numeric states to text states
const STATE_MAP: { [key: string]: string } = {
  '4': TRANSACTION_STATES.APPROVED,
  '6': TRANSACTION_STATES.DECLINED,
  '7': TRANSACTION_STATES.PENDING,
  '104': TRANSACTION_STATES.ERROR,
  '5': TRANSACTION_STATES.EXPIRED
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Log all parameters for debugging
    const params = Object.fromEntries(searchParams.entries());
    console.log('PayU Response Parameters:', params);

    const transactionState = searchParams.get('transactionState');
    const referenceCode = searchParams.get('referenceCode');
    const message = searchParams.get('message');
    const signature = searchParams.get('signature');
    const polTransactionState = searchParams.get('polTransactionState');
    const lapTransactionState = searchParams.get('lapTransactionState');
    const polResponseCode = searchParams.get('polResponseCode');
    const lapResponseCode = searchParams.get('lapResponseCode');

    // Log specific important parameters
    console.log('Transaction Details:', {
      transactionState,
      stateDescription: STATE_MAP[transactionState || ''] || 'UNKNOWN',
      polTransactionState,
      lapTransactionState,
      referenceCode,
      message,
      polResponseCode,
      lapResponseCode,
      signature,
    });

    // Check transaction states
    const isApproved = transactionState === '4' || polTransactionState === '4';
    const isError = transactionState === '104' || polTransactionState === '104';
    
    // Build the redirect URL with status parameters
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const orderUrl = `${baseUrl}/checkout/order/${referenceCode}`;
    const redirectUrl = new URL(orderUrl);

    if (isApproved) {
      console.log(`✅ Payment approved for order ${referenceCode}`);
      redirectUrl.searchParams.set('status', 'success');
    } else if (isError) {
      console.log(`❌ Payment error for order ${referenceCode}`);
      console.log(`Error details: ${message}`);
      console.log(`Response codes: POL=${polResponseCode}, LAP=${lapResponseCode}`);
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', message || 'Payment error');
    } else {
      console.log(`❌ Payment not approved for order ${referenceCode}`);
      console.log(`State: ${transactionState} (${STATE_MAP[transactionState || ''] || 'UNKNOWN'})`);
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', message || 'Payment not approved');
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing PayU response:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // If we can't get the referenceCode, redirect to the checkout page
    const redirectUrl = new URL(`${baseUrl}/checkout`);
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('message', 'Internal server error');
    return NextResponse.redirect(redirectUrl);
  }
} 