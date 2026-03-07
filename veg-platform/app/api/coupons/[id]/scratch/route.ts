import { NextRequest, NextResponse } from 'next/server';
import { updateCoupon } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: couponId } = await params;
        const coupon = updateCoupon(couponId, { isScratched: true });
        
        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }
        
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to scratch coupon' }, { status: 500 });
    }
}
