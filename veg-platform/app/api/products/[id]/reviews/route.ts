import { NextRequest, NextResponse } from 'next/server';
import { getReviewsByProductId, createReview, getProductById, updateProduct } from '@/lib/db';
import { Review } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: productId } = await params;
    const reviews = getReviewsByProductId(productId);
    return NextResponse.json(reviews);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: productId } = await params;
    const body = await request.json();
    const { userId, userName, userImage, rating, comment, images, videos } = body;

    if (!userId || !userName || !rating || !comment) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReview: Review = {
        id: `rev-${uuidv4().substring(0, 8)}`,
        productId,
        userId,
        userName,
        userImage: userImage || '/images/testimonial-1.png',
        rating,
        comment,
        images: images || [],
        videos: videos || [],
        createdAt: new Date().toISOString()
    };

    createReview(newReview);

    // Update product rating and review count
    const product = getProductById(productId);
    if (product) {
        const reviews = getReviewsByProductId(productId);
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Number((totalRating / reviews.length).toFixed(1));
        
        updateProduct(productId, {
            rating: avgRating,
            reviews: reviews.length
        });
    }

    return NextResponse.json(newReview, { status: 201 });
}
