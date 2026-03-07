'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { selectUser, selectIsLoggedIn } from '@/store/slices/userSlice';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, RefreshCw, Leaf, Camera, Video, Send, CheckCircle } from 'lucide-react';
import { Review } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    
    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
            }
        } catch (error) {
            console.error('Failed to fetch product', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${id}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                dispatch(addToCart(product));
            }
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn || !user) {
            alert('Please sign in to submit a review');
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await fetch(`/api/products/${id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    userName: user.name,
                    userImage: '/images/testimonial-1.png',
                    rating,
                    comment,
                    images: product ? [product.image] : [], // Mockup image
                    videos: []
                })
            });

            if (res.ok) {
                setReviewSubmitted(true);
                setComment('');
                setRating(5);
                fetchReviews();
                fetchProduct(); // Refresh product rating/reviews count
                setTimeout(() => setReviewSubmitted(false), 5000);
            }
        } catch (error) {
            console.error('Failed to submit review', error);
        } finally {
            setSubmittingReview(false);
        }
    };


    if (loading) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ padding: '40px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                        <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />
                        <div>
                            <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '12px' }} />
                            <div className="skeleton" style={{ height: '36px', width: '70%', marginBottom: '16px' }} />
                            <div className="skeleton" style={{ height: '20px', width: '30%', marginBottom: '24px' }} />
                            <div className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '24px' }} />
                            <div className="skeleton" style={{ height: '48px', width: '60%' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '120px 20px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🥬</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Product Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        The vegetable you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link href="/" className="btn-primary">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                {/* Breadcrumb */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '32px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                }}>
                    <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowLeft size={16} /> Home
                    </Link>
                    <span>/</span>
                    <span>{product.category}</span>
                    <span>/</span>
                    <span style={{ color: 'var(--text)' }}>{product.name}</span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'start',
                }} className="product-grid">
                    {/* Product Image */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        minHeight: '400px',
                    }}>
                        {product.isOrganic && (
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                left: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                background: 'rgba(45,106,79,0.1)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                color: 'var(--primary)',
                            }}>
                                <Leaf size={14} /> Organic Certified
                            </div>
                        )}
                        {discount > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                padding: '8px 16px',
                                background: 'var(--accent)',
                                color: 'white',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                            }}>
                                {discount}% OFF
                            </div>
                        )}
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={280}
                            height={280}
                            style={{
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))',
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="animate-fadeInUp">
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}>
                            {product.category}
                        </span>

                        <h1 style={{
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            marginTop: '8px',
                            marginBottom: '16px',
                            color: 'var(--primary-dark)',
                        }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '20px',
                        }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb'}
                                        color={i < Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb'}
                                    />
                                ))}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{product.rating}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '12px',
                            marginBottom: '24px',
                        }}>
                            <span style={{
                                fontSize: '2.2rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                            }}>
                                ₹{product.price}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                per {product.unit}
                            </span>
                            {discount > 0 && (
                                <span style={{
                                    fontSize: '1.2rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'line-through',
                                }}>
                                    ₹{product.originalPrice}
                                </span>
                            )}
                            {discount > 0 && (
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--success)',
                                    background: '#dcfce7',
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-full)',
                                }}>
                                    Save ₹{product.originalPrice - product.price}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p style={{
                            color: 'var(--text-light)',
                            lineHeight: 1.8,
                            fontSize: '0.95rem',
                            marginBottom: '32px',
                            paddingBottom: '24px',
                            borderBottom: '1px solid var(--border)',
                        }}>
                            {product.description}
                        </p>

                        {/* Stock */}
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: product.stock > 0 ? 'var(--success)' : 'var(--danger)',
                            }}>
                                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                            </span>
                        </div>

                        {/* Quantity selector */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            marginBottom: '28px',
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Quantity:</span>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                            }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{
                                        padding: '10px 14px',
                                        background: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{
                                    padding: '10px 20px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    borderLeft: '2px solid var(--border)',
                                    borderRight: '2px solid var(--border)',
                                    minWidth: '60px',
                                    textAlign: 'center',
                                }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{
                                        padding: '10px 14px',
                                        background: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '36px', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleAddToCart}
                                className="btn-primary"
                                style={{
                                    padding: '16px 36px',
                                    fontSize: '1rem',
                                    flex: 1,
                                    minWidth: '200px',
                                }}
                            >
                                <ShoppingCart size={20} />
                                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                            </button>
                            <Link
                                href="/cart"
                                className="btn-secondary"
                                style={{
                                    padding: '16px 36px',
                                    fontSize: '1rem',
                                }}
                            >
                                View Cart
                            </Link>
                        </div>

                        {/* Features */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                        }} className="features-grid">
                            {[
                                { icon: Truck, text: 'Free Delivery', sub: 'On ₹500+' },
                                { icon: Shield, text: 'Fresh Guarantee', sub: 'Quality Assured' },
                                { icon: RefreshCw, text: 'Easy Returns', sub: '24hr Policy' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    textAlign: 'center',
                                    padding: '16px 8px',
                                    background: 'var(--primary-50)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <item.icon size={22} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{item.text}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px' }} className="reviews-grid">
                        {/* Review List */}
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '32px' }}>
                                Customer Reviews ({reviews.length})
                            </h2>
                            
                            {reviewsLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {[1, 2].map(i => (
                                        <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
                                    ))}
                                </div>
                            ) : reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--primary-50)', borderRadius: 'var(--radius-lg)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this product!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    {reviews.map((review) => (
                                        <div key={review.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                                                        <Image src={review.userImage || '/images/testimonial-1.png'} alt={review.userName} width={40} height={40} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{review.userName}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                                                            color={i < review.rating ? '#f59e0b' : '#e5e7eb'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--text-light)', lineHeight: 1.6, marginBottom: '16px' }}>{review.comment}</p>
                                            
                                            {/* Review Media */}
                                            {(review.images?.length > 0 || review.videos?.length > 0) && (
                                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                    {review.images.map((img, i) => (
                                                        <div key={i} style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                            <Image src={img} alt="review" width={100} height={100} style={{ objectFit: 'cover' }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Review Form */}
                        <div>
                            <div style={{ background: 'white', padding: '36px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary-dark)' }}>
                                    Add a Review
                                </h3>

                                {reviewSubmitted ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }} className="animate-fadeInUp">
                                        <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                                        <p style={{ fontWeight: 600, color: 'var(--text)' }}>Thank you for your review!</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your feedback helps other customers make better choices.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Your Rating</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        <Star size={32} fill={star <= rating ? '#f59e0b' : 'none'} color={star <= rating ? '#f59e0b' : '#e5e7eb'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '24px' }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Your Review</label>
                                            <textarea
                                                className="input"
                                                rows={4}
                                                placeholder="What did you like or dislike? How was the freshness?"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                                style={{ resize: 'none' }}
                                            />
                                        </div>

                                        {/* File Upload placeholders */}
                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                            <div style={{ flex: 1, padding: '16px', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer' }}>
                                                <Camera size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Add Photos</div>
                                            </div>
                                            <div style={{ flex: 1, padding: '16px', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer' }}>
                                                <Video size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Add Video</div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={submittingReview || !isLoggedIn}
                                            style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                                        >
                                            {submittingReview ? 'Submitting...' : isLoggedIn ? 'Submit Review' : 'Sign in to Review'}
                                            {!submittingReview && <Send size={18} />}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            {/* Toast notification */}
            {addedToCart && (
                <div className="toast toast-success">
                    ✓ {product.name} added to cart!
                </div>
            )}

            <Footer />

            <style jsx>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .reviews-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
