'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/types';
import { Package, Search, Filter } from 'lucide-react';

const statusOptions = [
    { value: 'placed', label: 'Placed', bg: '#dbeafe', color: '#1e40af' },
    { value: 'confirmed', label: 'Confirmed', bg: '#e0e7ff', color: '#3730a3' },
    { value: 'preparing', label: 'Preparing', bg: '#fef3c7', color: '#92400e' },
    { value: 'out_for_delivery', label: 'Out for Delivery', bg: '#fed7aa', color: '#9a3412' },
    { value: 'delivered', label: 'Delivered', bg: '#dcfce7', color: '#166534' },
    { value: 'cancelled', label: 'Cancelled', bg: '#fee2e2', color: '#991b1b' },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: string) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, orderStatus: newStatus }),
            });
            if (res.ok) {
                showToast('Order status updated!', 'success');
                fetchOrders();
            }
        } catch {
            showToast('Failed to update order', 'error');
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerPhone.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                    Orders
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Manage and track customer orders ({orders.length} total)
                </p>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                flexWrap: 'wrap',
            }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                    }} />
                    <input
                        className="input"
                        placeholder="Search by order ID, name, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '42px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <select
                        className="select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: 'auto', minWidth: '180px' }}
                    >
                        <option value="all">All Statuses</option>
                        {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
            }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading orders...
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <Package size={48} color="var(--primary-light)" style={{ marginBottom: '12px' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No orders found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => {
                                    const currentStatus = statusOptions.find(s => s.value === order.orderStatus);
                                    return (
                                        <tr key={order.id}>
                                            <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{order.id}</td>
                                            <td>
                                                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{order.customerName}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    {order.items.map((item, i) => (
                                                        <div key={i} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.product.name} × {item.quantity}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                                                ₹{order.total}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 600,
                                                    background: order.paymentStatus === 'completed' ? '#dcfce7' : '#fef3c7',
                                                    color: order.paymentStatus === 'completed' ? '#166534' : '#92400e',
                                                }}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 600,
                                                    background: currentStatus?.bg || '#dbeafe',
                                                    color: currentStatus?.color || '#1e40af',
                                                    textTransform: 'capitalize',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {order.orderStatus.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td>
                                                <select
                                                    className="select"
                                                    value={order.orderStatus}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    style={{
                                                        width: 'auto',
                                                        minWidth: '150px',
                                                        padding: '6px 30px 6px 10px',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    {statusOptions.map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
