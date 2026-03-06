import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isValid) {
            return NextResponse.json({
                success: true,
                paymentId: razorpay_payment_id,
                message: 'Payment verified successfully',
            });
        }

        return NextResponse.json(
            { success: false, error: 'Payment verification failed' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Verification error' },
            { status: 500 }
        );
    }
}
