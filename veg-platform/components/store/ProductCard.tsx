'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addToCart } = useCart();
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div
            className="card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                opacity: 0,
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`,
            }}
        >
            {/* Image container */}
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                    position: 'relative',
                    padding: '24px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '180px',
                    overflow: 'hidden',
                }}>
                    {/* Badges */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        zIndex: 2,
                    }}>
                        {product.isOrganic && (
                            <span className="badge badge-organic" style={{ fontSize: '0.7rem' }}>
                                🌿 Organic
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="badge badge-sale" style={{ fontSize: '0.7rem' }}>
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Product image */}
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={130}
                        height={130}
                        style={{
                            objectFit: 'contain',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        }}
                    />

                    {/* Decorative circle */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        right: '-20px',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(45,106,79,0.06)',
                    }} />
                </div>
            </Link>

            {/* Content */}
            <div style={{
                padding: '16px 20px 20px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
            }}>
                {/* Category */}
                <span style={{
                    fontSize: '0.72rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                }}>
                    {product.category}
                </span>

                {/* Name */}
                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        marginBottom: '6px',
                        color: 'var(--text)',
                        lineHeight: '1.3',
                    }}>
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '12px',
                }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                        {product.rating}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ({product.reviews})
                    </span>
                </div>

                {/* Price and Add to cart */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                }}>
                    <div>
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                        }}>
                            ₹{product.price}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginLeft: '4px',
                        }}>
                            /{product.unit}
                        </span>
                        {discount > 0 && (
                            <span style={{
                                fontSize: '0.82rem',
                                color: 'var(--text-muted)',
                                textDecoration: 'line-through',
                                marginLeft: '8px',
                            }}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(45,106,79,0.25)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(45,106,79,0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,106,79,0.25)';
                        }}
                        title="Add to cart"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
