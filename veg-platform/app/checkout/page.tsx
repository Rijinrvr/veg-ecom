'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItems, selectSubtotal, selectDeliveryFee, selectTotal, selectItemCount, clearCart } from '@/store/slices/cartSlice';
import { selectIsLoggedIn, selectUser, setRedirectAfterLogin } from '@/store/slices/userSlice';
import { ArrowLeft, CreditCard, CheckCircle, Lock, MapPin, Truck, LogIn, Gift, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

const checkoutSchema = yup.object({
    customerName: yup.string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    customerEmail: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    customerPhone: yup.string()
        .required('Phone number is required')
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    address: yup.string()
        .required('Delivery address is required')
        .min(10, 'Please enter a complete address (min 10 characters)'),
    city: yup.string()
        .required('City is required')
        .min(2, 'City name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/, 'City can only contain letters'),
    pincode: yup.string()
        .required('Pincode is required')
        .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
});

export default function CheckoutPage() {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);
    const subtotal = useAppSelector(selectSubtotal);
    const deliveryFee = useAppSelector(selectDeliveryFee);
    const total = useAppSelector(selectTotal);
    const itemCount = useAppSelector(selectItemCount);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const user = useAppSelector(selectUser);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [rewardEarned, setRewardEarned] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        city: '',
        pincode: '',
    });

    // Coupon logic
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const fetchCoupons = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/users/${user.id}/coupons`);
            if (res.ok) {
                const data = await res.json();
                // Only show scratched and unused coupons
                setAvailableCoupons(data.filter((c: any) => c.isScratched && !c.isUsed));
            }
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn && user) {
            setForm(prev => ({
                ...prev,
                customerName: prev.customerName || user.name || '',
                customerEmail: prev.customerEmail || user.email || '',
                customerPhone: prev.customerPhone || user.phone || '',
            }));
            fetchCoupons();
        }
    }, [isLoggedIn, user]);

    useEffect(() => {
        if (items.length === 0 && !orderPlaced) {
            router.push('/cart');
        }
    }, [items.length, orderPlaced, router]);

    const handleApplyCoupon = (coupon: any) => {
        if (selectedCouponId === coupon.id) {
            setSelectedCouponId(null);
            setDiscountAmount(0);
        } else {
            setSelectedCouponId(coupon.id);
            setDiscountAmount(coupon.value);
        }
    };

    const finalTotal = Math.max(0, total - discountAmount);

    const validateField = async (field: string, value: string) => {
        try {
            await checkoutSchema.validateAt(field, { ...form, [field]: value });
            setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
                setFieldErrors(prev => ({ ...prev, [field]: err.message }));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Restrict phone: digits only, max 10
        if (name === 'customerPhone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            setForm(prev => ({ ...prev, customerPhone: digits }));
            validateField('customerPhone', digits);
            return;
        }
        // Restrict pincode: digits only, max 6
        if (name === 'pincode') {
            const digits = value.replace(/\D/g, '').slice(0, 6);
            setForm(prev => ({ ...prev, pincode: digits }));
            validateField('pincode', digits);
            return;
        }
        setForm(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleLoginRedirect = () => {
        dispatch(setRedirectAfterLogin('/checkout'));
        router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            handleLoginRedirect();
            return;
        }
        setFieldErrors({});

        try {
            await checkoutSchema.validate(form, { abortEarly: false });
        } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                err.inner.forEach(e => { if (e.path) errors[e.path] = e.message; });
                setFieldErrors(errors);
                return;
            }
        }

        setLoading(true);
        try {
            const paymentRes = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalTotal, receipt: `order_${Date.now()}` }),
            });
            const paymentOrder = await paymentRes.json();
            const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

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
                const orderRes = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items.map(item => ({ product: item.product, quantity: item.quantity })),
                        total: finalTotal,
                        subtotal,
                        discount: discountAmount,
                        deliveryFee,
                        ...form,
                        userId: user?.id || undefined,
                        selectedCouponId,
                        couponCode: availableCoupons.find(c => c.id === selectedCouponId)?.code,
                        paymentId, paymentStatus: 'completed',
                    }),
                });
                const order = await orderRes.json();
                setOrderId(order.id);
                setRewardEarned(order.rewardEarned);
                setOrderPlaced(true);
                dispatch(clearCart());
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputErrorStyle = (field: string) => fieldErrors[field]
        ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' }
        : {};

    const FieldError = ({ field }: { field: string }) =>
        fieldErrors[field] ? <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: 500 }}>⚠ {fieldErrors[field]}</p> : null;

    if (orderPlaced) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '60px 20px', textAlign: 'center',
                }} className="animate-fadeInUp">
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px', animation: 'bounceIn 0.5s ease-out',
                    }}>
                        <CheckCircle size={48} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '10px' }}>
                        Order Placed Successfully! 🎉
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '1.05rem' }}>
                        Your fresh vegetables are on their way!
                    </p>
                    <p style={{ marginBottom: '32px', fontSize: '0.9rem' }}>
                        Order ID: <strong style={{ color: 'var(--primary)' }}>{orderId}</strong>
                    </p>

                    {rewardEarned && (
                        <div style={{
                            background: 'var(--primary-50)', border: '2px dashed var(--primary)',
                            padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '32px',
                            maxWidth: '500px', width: '100%', animation: 'celebrate 1s ease-out infinite alternate',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                                <Gift size={32} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>You Earned a Reward! 🎁</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '16px' }}>
                                Congratulations! your order qualified for a mystery scratch card. Go to your rewards section to reveal your discount.
                            </p>
                            <Link href="/rewards" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'var(--primary)', color: 'white', padding: '10px 24px',
                                borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600,
                                fontSize: '0.9rem', boxShadow: 'var(--shadow-md)',
                            }}>
                                <Sparkles size={16} /> Go to My Rewards
                            </Link>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href={`/track/${orderId}`} className="btn-accent" style={{ gap: '8px' }}>
                            <Truck size={18} /> Track My Order
                        </Link>
                        <Link href="/orders" className="btn-primary">View All Orders</Link>
                        <Link href="/" className="btn-secondary">Continue Shopping</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (items.length === 0 && !orderPlaced) {
        return null;
    }

    // Login required screen
    if (!isLoggedIn) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '60px 20px', textAlign: 'center',
                }} className="animate-fadeInUp">
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px',
                    }}>
                        <LogIn size={48} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '10px' }}>
                        Sign In Required
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '1rem', maxWidth: '400px' }}>
                        Please sign in to your account to complete your purchase. Your cart items will be saved.
                    </p>
                    <p style={{ color: 'var(--primary)', marginBottom: '32px', fontSize: '0.9rem', fontWeight: 600 }}>
                        🛒 {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart • ₹{total}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={handleLoginRedirect} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            <LogIn size={18} /> Sign In to Checkout
                        </button>
                        <Link href="/register" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}
                            onClick={() => dispatch(setRedirectAfterLogin('/checkout'))}>
                            Create Account
                        </Link>
                    </div>
                    <Link href="/cart" style={{
                        color: 'var(--text-muted)', textDecoration: 'none',
                        marginTop: '20px', fontSize: '0.85rem',
                    }}>← Back to Cart</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <Link href="/cart" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem',
                    fontWeight: 500, marginBottom: '20px',
                }}>
                    <ArrowLeft size={16} /> Back to Cart
                </Link>

                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '32px' }}>
                    Checkout
                </h1>

                <form onSubmit={handleSubmit} noValidate>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 380px',
                        gap: '36px', alignItems: 'start',
                    }} className="checkout-grid">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            {/* Personal Info */}
                            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '28px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
                                    👤 Personal Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Full Name *</label>
                                        <input className="input" name="customerName" value={form.customerName} onChange={handleChange} placeholder="John Doe" style={{ ...inputErrorStyle('customerName') }} />
                                        <FieldError field="customerName" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Email *</label>
                                        <input className="input" type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} placeholder="john@example.com" style={{ ...inputErrorStyle('customerEmail') }} />
                                        <FieldError field="customerEmail" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }} className="form-full">
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Phone Number *</label>
                                        <input className="input" name="customerPhone" value={form.customerPhone} onChange={handleChange}
                                            placeholder="9876543210" inputMode="numeric" maxLength={10}
                                            style={{ ...inputErrorStyle('customerPhone') }} />
                                        <FieldError field="customerPhone" />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '28px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
                                    <MapPin size={20} /> Delivery Address
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Address *</label>
                                        <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="House No, Street, Locality" style={{ ...inputErrorStyle('address') }} />
                                        <FieldError field="address" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>City *</label>
                                            <input className="input" name="city" value={form.city} onChange={handleChange} placeholder="City" style={{ ...inputErrorStyle('city') }} />
                                            <FieldError field="city" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Pincode *</label>
                                            <input className="input" name="pincode" value={form.pincode} onChange={handleChange}
                                                placeholder="682001" inputMode="numeric" maxLength={6}
                                                style={{ ...inputErrorStyle('pincode') }} />
                                            <FieldError field="pincode" />
                                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>6-digit area pincode</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '28px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
                                    <CreditCard size={20} /> Payment Method
                                </h3>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                    background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-light)',
                                }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3395FF, #0070f3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: 700, fontSize: '0.8rem',
                                    }}>R</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Razorpay</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UPI, Cards, Net Banking & more</div>
                                    </div>
                                    <Lock size={16} color="var(--success)" style={{ marginLeft: 'auto' }} />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{
                            background: 'white', borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)', padding: '28px',
                            position: 'sticky', top: '100px',
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", marginBottom: '20px', color: 'var(--primary-dark)' }}>
                                Order Summary
                            </h3>
                            {/* Reward Selection */}
                            {isLoggedIn && availableCoupons.length > 0 && (
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                                        <Gift size={16} /> Apply Reward Points
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {availableCoupons.map(coupon => (
                                            <button
                                                key={coupon.id}
                                                type="button"
                                                onClick={() => handleApplyCoupon(coupon)}
                                                style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid',
                                                    borderColor: selectedCouponId === coupon.id ? 'var(--primary)' : 'var(--border)',
                                                    background: selectedCouponId === coupon.id ? 'var(--primary-50)' : 'white',
                                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{coupon.code}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Save ₹{coupon.value}</div>
                                                </div>
                                                {selectedCouponId === coupon.id ? (
                                                    <CheckCircle size={16} color="var(--primary)" />
                                                ) : (
                                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border)' }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                {items.map(item => (
                                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                                        <span style={{ color: 'var(--text-light)' }}>{item.product.name} × {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>₹{item.product.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--success)' }}>
                                        <span>Reward Discount</span>
                                        <span style={{ fontWeight: 600 }}>-₹{discountAmount}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-light)' }}>Delivery</span>
                                    <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                            </div>
                            <div style={{ borderTop: '2px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary)' }}>₹{finalTotal}</span>
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading} style={{
                                width: '100%', padding: '16px', fontSize: '1rem',
                                justifyContent: 'center', opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}>
                                {loading ? 'Processing...' : <><Lock size={16} /> Pay ₹{finalTotal}</>}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                                🔒 Your payment information is encrypted and secure
                            </p>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
            <style jsx>{`
                @media (max-width: 768px) {
                    .checkout-grid { grid-template-columns: 1fr !important; }
                    .form-grid { grid-template-columns: 1fr !important; }
                    .form-full { grid-column: span 1 !important; }
                }
                @keyframes celebrate {
                    from { transform: scale(1); }
                    to { transform: scale(1.02); }
                }
            `}</style>
        </div>
    );
}
