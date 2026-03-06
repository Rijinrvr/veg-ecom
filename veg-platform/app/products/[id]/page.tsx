'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, RefreshCw, Leaf } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
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

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
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
        }
      `}</style>
        </div>
    );
}
