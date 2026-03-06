'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, CreditCard, CheckCircle, Lock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, getSubtotal, getDeliveryFee, getTotal, clearCart, getItemCount } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [form, setForm] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        city: '',
        pincode: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create payment order
            const paymentRes = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: getTotal(),
                    receipt: `order_${Date.now()}`,
                }),
            });
            const paymentOrder = await paymentRes.json();

            // 2. Simulate Razorpay payment (in production, use Razorpay checkout modal)
            const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

            // 3. Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_order_id: paymentOrder.id,
                    razorpay_payment_id: paymentId,
                    razorpay_signature: 'demo_signature',
                }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
                // 4. Create order
                const orderRes = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items.map(item => ({
                            product: item.product,
                            quantity: item.quantity,
                        })),
                        total: getTotal(),
                        subtotal: getSubtotal(),
                        deliveryFee: getDeliveryFee(),
                        ...form,
                        paymentId,
                        paymentStatus: 'completed',
                    }),
                });
                const order = await orderRes.json();

                setOrderId(order.id);
                setOrderPlaced(true);
                clearCart();
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                }} className="animate-fadeInUp">
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                        animation: 'bounceIn 0.5s ease-out',
                    }}>
                        <CheckCircle size={48} color="white" />
                    </div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--primary-dark)',
                        marginBottom: '10px',
                    }}>
                        Order Placed Successfully! 🎉
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        fontSize: '1.05rem',
                    }}>
                        Your fresh vegetables are on their way!
                    </p>
                    <p style={{
                        marginBottom: '32px',
                        fontSize: '0.9rem',
                    }}>
                        Order ID: <strong style={{ color: 'var(--primary)' }}>{orderId}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/orders" className="btn-primary">View Orders</Link>
                        <Link href="/" className="btn-secondary">Continue Shopping</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <Link href="/cart" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '20px',
                }}>
                    <ArrowLeft size={16} /> Back to Cart
                </Link>

                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--primary-dark)',
                    marginBottom: '32px',
                }}>
                    Checkout
                </h1>

                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 380px',
                        gap: '36px',
                        alignItems: 'start',
                    }} className="checkout-grid">
                        {/* Form fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            {/* Personal Info */}
                            <div style={{
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                                padding: '28px',
                            }}>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-dark)',
                                }}>
                                    👤 Personal Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>
                                            Full Name *
                                        </label>
                                        <input
                                            className="input"
                                            name="customerName"
                                            value={form.customerName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>
                                            Email *
                                        </label>
                                        <input
                                            className="input"
                                            type="email"
                                            name="customerEmail"
                                            value={form.customerEmail}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }} className="form-full">
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>
                                            Phone Number *
                                        </label>
                                        <input
                                            className="input"
                                            name="customerPhone"
                                            value={form.customerPhone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div style={{
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                                padding: '28px',
                            }}>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-dark)',
                                }}>
                                    <MapPin size={20} /> Delivery Address
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>
                                            Address *
                                        </label>
                                        <input
                                            className="input"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="House No, Street, Locality"
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>
                                                City *
                                            </label>
                                            <input
                                                className="input"
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>
                                                Pincode *
                                            </label>
                                            <input
                                                className="input"
                                                name="pincode"
                                                value={form.pincode}
                                                onChange={handleChange}
                                                placeholder="682001"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div style={{
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                                padding: '28px',
                            }}>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-dark)',
                                }}>
                                    <CreditCard size={20} /> Payment Method
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    background: 'var(--primary-50)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--primary-light)',
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3395FF, #0070f3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                    }}>
                                        R
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Razorpay</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            UPI, Cards, Net Banking & more
                                        </div>
                                    </div>
                                    <Lock size={16} color="var(--success)" style={{ marginLeft: 'auto' }} />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                            padding: '28px',
                            position: 'sticky',
                            top: '100px',
                        }}>
                            <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '20px',
                                color: 'var(--primary-dark)',
                            }}>
                                Order Summary
                            </h3>

                            {/* Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                {items.map(item => (
                                    <div key={item.product.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.88rem',
                                    }}>
                                        <span style={{ color: 'var(--text-light)' }}>
                                            {item.product.name} × {item.quantity}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>₹{item.product.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                borderTop: '1px solid var(--border)',
                                paddingTop: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginBottom: '16px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>₹{getSubtotal()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-light)' }}>Delivery</span>
                                    <span style={{
                                        fontWeight: 600,
                                        color: getDeliveryFee() === 0 ? 'var(--success)' : 'inherit',
                                    }}>
                                        {getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                borderTop: '2px solid var(--border)',
                                paddingTop: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                            }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary)' }}>
                                    ₹{getTotal()}
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '1rem',
                                    justifyContent: 'center',
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Lock size={16} /> Pay ₹{getTotal()}
                                    </>
                                )}
                            </button>

                            <p style={{
                                textAlign: 'center',
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                                marginTop: '12px',
                            }}>
                                🔒 Your payment information is encrypted and secure
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />

            <style jsx>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-full {
            grid-column: span 1 !important;
          }
        }
      `}</style>
        </div>
    );
}
