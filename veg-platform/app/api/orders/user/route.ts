import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId } from '@/lib/db';

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const orders = getOrdersByUserId(userId);
    const sorted = orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sorted);
}
