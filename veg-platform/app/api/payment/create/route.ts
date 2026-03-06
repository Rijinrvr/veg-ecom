import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        const { amount, receipt } = await request.json();

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        const order = await createRazorpayOrder(amount, receipt || `rcpt_${Date.now()}`);
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
    }
}
