// Razorpay integration utility
// Note: For production, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables
// For demo/testing, we'll use a simulated payment flow

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'demo_secret';

export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
}

export async function createRazorpayOrder(amount: number, receipt: string): Promise<RazorpayOrder> {
    // In production, use actual Razorpay SDK:
    // const Razorpay = require('razorpay');
    // const instance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    // return await instance.orders.create({ amount: amount * 100, currency: 'INR', receipt });

    // For demo purposes, create a simulated order
    return {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt,
    };
}

export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    // In production, verify using Razorpay's crypto verification:
    // const crypto = require('crypto');
    // const generatedSignature = crypto
    //   .createHmac('sha256', RAZORPAY_KEY_SECRET)
    //   .update(`${orderId}|${paymentId}`)
    //   .digest('hex');
    // return generatedSignature === signature;

    // For demo, accept all payments
    return !!(orderId && paymentId);
}
