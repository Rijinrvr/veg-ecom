import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrder } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '@/types';

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
            items: body.items,
            total: body.total,
            subtotal: body.subtotal,
            deliveryFee: body.deliveryFee || 0,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone,
            address: body.address,
            city: body.city,
            pincode: body.pincode,
            paymentId: body.paymentId || '',
            paymentStatus: body.paymentStatus || 'pending',
            orderStatus: 'placed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        createOrder(order);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
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
