'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsLoggedIn } from '@/store/slices/userSlice';
import { Order } from '@/types';
import { Package, Clock, ChevronDown, ChevronUp, MapPin, Truck, ShoppingBag, Gift } from 'lucide-react';

const statusConfig: Record<string, { bg: string; color: string; icon: string; label: string }> = {
  placed: { bg: '#dbeafe', color: '#1e40af', icon: '📦', label: 'Order Placed' },
  confirmed: { bg: '#e0e7ff', color: '#3730a3', icon: '✅', label: 'Confirmed' },
  preparing: { bg: '#fef3c7', color: '#92400e', icon: '🥬', label: 'Preparing' },
  out_for_delivery: { bg: '#fed7aa', color: '#9a3412', icon: '🚛', label: 'Out for Delivery' },
  delivered: { bg: '#dcfce7', color: '#166534', icon: '🏠', label: 'Delivered' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', icon: '❌', label: 'Cancelled' },
};

export default function OrdersPage() {
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders/user?userId=${userId}`);
      const data = await res.json();
      const sorted = data.sort(
        (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchOrders(user.id);
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get progress percentage for a mini progress bar
  const getProgress = (status: string) => {
    const steps = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const index = steps.indexOf(status);
    if (status === 'cancelled') return 0;
    return ((index + 1) / steps.length) * 100;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem', fontWeight: 700,
              color: 'var(--primary-dark)', marginBottom: '8px',
            }}>
              My Orders
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {isLoggedIn
                ? `Track your deliveries, ${user?.name?.split(' ')[0]} 🚛`
                : 'View and track all your vegetable deliveries'}
            </p>
          </div>
          <Link href="/" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Orders count */}
        {!loading && orders.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '20px', fontSize: '0.88rem', color: 'var(--text-muted)',
          }}>
            <Package size={16} />
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </div>
        )}

        {!isLoggedIn ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }} className="animate-fadeInUp">
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
              Sign in to view your orders
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Please sign in to see your order history and track deliveries.
            </p>
            <Link href="/login" className="btn-primary">Sign In</Link>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }} className="animate-fadeInUp">
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
              No orders yet
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your order history will appear here once you place your first order.
            </p>
            <Link href="/" className="btn-primary">Start Shopping 🛒</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order, index) => {
              const status = statusConfig[order.orderStatus] || statusConfig.placed;
              const isExpanded = expandedOrder === order.id;
              const progress = getProgress(order.orderStatus);
              const isActive = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';

              return (
                <div
                  key={order.id}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${isActive ? 'var(--primary-200)' : 'var(--border)'}`,
                    overflow: 'hidden',
                    opacity: 0,
                    animation: `fadeInUp 0.4s ease-out ${index * 0.06}s forwards`,
                    boxShadow: isActive ? '0 2px 12px rgba(45,106,79,0.06)' : 'none',
                  }}
                >
                  {/* Order card header */}
                  <div style={{ padding: '20px 24px' }}>
                    {/* Top row: ID, Date, Status, Amount */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: '16px', flexWrap: 'wrap', gap: '10px',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text)' }}>
                          Order #{order.id}
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '0.8rem', color: 'var(--text-muted)',
                        }}>
                          <Clock size={13} />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Status badge */}
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          background: status.bg,
                          color: status.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}>
                          {status.icon} {status.label}
                        </span>
                        {/* Amount */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{
                            fontWeight: 700, color: 'var(--primary)',
                            fontSize: '1.2rem', fontFamily: "'Inter', sans-serif",
                          }}>
                            ₹{order.total}
                          </span>
                          {order.discount > 0 && (
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600,
                              background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px',
                            }}>
                              <Gift size={11} /> -₹{order.discount} {order.couponCode && `(${order.couponCode})`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product items with images */}
                    <div style={{
                      display: 'flex', gap: '12px',
                      marginBottom: '16px', overflowX: 'auto',
                      paddingBottom: '4px',
                    }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', background: 'var(--primary-50)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          minWidth: 'fit-content', flexShrink: 0,
                        }}>
                          <div style={{
                            width: '44px', height: '44px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', flexShrink: 0,
                            border: '1px solid var(--border)',
                          }}>
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={34}
                              height={34}
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <div>
                            <div style={{
                              fontSize: '0.85rem', fontWeight: 600,
                              color: 'var(--text)', lineHeight: 1.3,
                            }}>
                              {item.product.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem', color: 'var(--text-muted)',
                            }}>
                              Qty: {item.quantity} • ₹{item.product.price * item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini progress bar */}
                    {order.orderStatus !== 'cancelled' && (
                      <div style={{
                        height: '4px', background: 'var(--border)',
                        borderRadius: '2px', overflow: 'hidden', marginBottom: '16px',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: '2px',
                          background: order.orderStatus === 'delivered'
                            ? 'linear-gradient(90deg, var(--success), #34d399)'
                            : 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                          width: `${progress}%`,
                          transition: 'width 0.8s ease',
                        }} />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {/* Track Order button */}
                      <Link
                        href={`/track/${order.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          borderRadius: 'var(--radius-full)',
                          background: isActive
                            ? 'linear-gradient(135deg, var(--accent), var(--accent-light))'
                            : 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          boxShadow: isActive
                            ? '0 4px 12px rgba(247,127,0,0.25)'
                            : '0 4px 12px rgba(45,106,79,0.25)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Truck size={16} style={{
                          animation: isActive ? 'float 2s ease-in-out infinite' : 'none',
                        }} />
                        {isActive ? 'Track Live Order' : 'View Tracking'}
                      </Link>

                      {/* Details toggle */}
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 20px',
                          borderRadius: 'var(--radius-full)',
                          background: 'white',
                          color: 'var(--text-light)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary-light)';
                          e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.color = 'var(--text-light)';
                        }}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{
                      padding: '20px 24px',
                      borderTop: '1px solid var(--border)',
                      background: 'var(--primary-50)',
                      animation: 'fadeIn 0.3s ease-out',
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px',
                      }} className="order-details-grid">
                        <div>
                          <h4 style={{
                            fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px',
                            color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px',
                          }}>
                            <MapPin size={14} /> Delivery Address
                          </h4>
                          <div style={{
                            background: 'white', borderRadius: 'var(--radius-md)',
                            padding: '14px', fontSize: '0.85rem', color: 'var(--text-light)',
                            lineHeight: 1.7, border: '1px solid var(--border)',
                          }}>
                            <strong style={{ color: 'var(--text)' }}>{order.customerName}</strong><br />
                            {order.address}<br />
                            {order.city} - {order.pincode}<br />
                            📞 {order.customerPhone}
                          </div>
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px',
                            color: 'var(--text)',
                          }}>
                            💳 Payment Info
                          </h4>
                          <div style={{
                            background: 'white', borderRadius: 'var(--radius-md)',
                            padding: '14px', fontSize: '0.85rem', color: 'var(--text-light)',
                            lineHeight: 1.7, border: '1px solid var(--border)',
                          }}>
                            Payment ID: <code style={{
                              background: 'var(--primary-50)', padding: '2px 6px',
                              borderRadius: '4px', fontSize: '0.78rem',
                            }}>{order.paymentId}</code><br />
                            Status: <span style={{
                              color: order.paymentStatus === 'completed' ? 'var(--success)' : 'var(--warning)',
                              fontWeight: 600,
                            }}>
                              {order.paymentStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                            </span><br />
                            Subtotal: ₹{order.subtotal}<br />
                            Delivery: {order.deliveryFee === 0
                              ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                              : `₹${order.deliveryFee}`}
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text)' }}>
                        🛒 Items Ordered
                      </h4>
                      <div style={{
                        background: 'white', borderRadius: 'var(--radius-md)',
                        padding: '4px 14px', border: '1px solid var(--border)',
                      }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', padding: '10px 0',
                            borderBottom: i < order.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                            fontSize: '0.88rem',
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: 'var(--primary-50)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                              }}>🥬</span>
                              {item.product.name}
                              <span style={{
                                color: 'var(--text-muted)', fontSize: '0.8rem',
                              }}>× {item.quantity}</span>
                            </span>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                              ₹{item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
