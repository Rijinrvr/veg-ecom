import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@/types';

export async function GET() {
    try {
        const categories = getCategories();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const category: Category = {
            id: uuidv4(),
            name: body.name,
            slug: body.name.toLowerCase().replace(/\s+/g, '-'),
            icon: body.icon || '🥬',
            color: body.color || '#2d6a4f',
            productCount: 0,
        };
        createCategory(category);
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
