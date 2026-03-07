import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrder, createCoupon, updateCoupon } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Order, Coupon } from '@/types';

export async function GET() {
    try {
        const orders = getOrders();
        // Return orders sorted by newest first
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const order: Order = {
            id: `ORD-${Date.now().toString(36).toUpperCase()}`,
            userId: body.userId,
            items: body.items,
            total: body.total,
            subtotal: body.subtotal,
            discount: body.discount || 0,
            deliveryFee: body.deliveryFee || 0,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone,
            address: body.address,
            city: body.city,
            pincode: body.pincode,
            paymentId: body.paymentId || '',
            paymentStatus: body.paymentStatus || 'completed',
            orderStatus: 'placed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        createOrder(order);

        // Mark coupon as used if applied
        if (body.selectedCouponId) {
            updateCoupon(body.selectedCouponId, { isUsed: true });
        }

        let rewardEarned = false;
        // Generate a reward coupon if userId exists AND subtotal >= 100
        if (body.userId && body.subtotal >= 100) {
            rewardEarned = true;
            const couponValue = Math.floor(Math.random() * 46) + 5; // Random value between 5 and 50
            const coupon: Coupon = {
                id: `CPN-${uuidv4().substring(0, 8).toUpperCase()}`,
                userId: body.userId,
                code: `VEG${uuidv4().substring(0, 4).toUpperCase()}`,
                value: couponValue,
                isScratched: false,
                isUsed: false,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                createdAt: new Date().toISOString(),
            };
            createCoupon(coupon);
        }

        return NextResponse.json({ ...order, rewardEarned }, { status: 201 });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const order = updateOrder(id, updates);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
