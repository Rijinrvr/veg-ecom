import { NextRequest, NextResponse } from 'next/server';
import { getCouponsByUserId } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const coupons = getCouponsByUserId(userId);
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}
