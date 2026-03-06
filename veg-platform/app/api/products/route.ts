import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types';

// GET all products
export async function GET(request: NextRequest) {
    try {
        const products = getProducts();
        const { searchParams } = new URL(request.url);

        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        const sort = searchParams.get('sort');

        let filtered = [...products];

        if (category) {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            );
        }

        if (featured === 'true') {
            filtered = filtered.filter(p => p.isFeatured);
        }

        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return NextResponse.json(filtered);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST create a new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const product: Product = {
            id: uuidv4(),
            name: body.name,
            slug: body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: body.description,
            price: Number(body.price),
            originalPrice: Number(body.originalPrice || body.price),
            unit: body.unit || 'kg',
            image: body.image || '/images/default-veg.svg',
            category: body.category,
            stock: Number(body.stock || 0),
            isOrganic: body.isOrganic || false,
            isFeatured: body.isFeatured || false,
            rating: body.rating || 4.0,
            reviews: body.reviews || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        createProduct(product);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
