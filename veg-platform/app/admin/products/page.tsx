'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { Plus, Edit2, Trash2, X, Save, Search } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        unit: 'kg',
        category: '',
        stock: '',
        isOrganic: false,
        isFeatured: false,
        image: '/images/default-veg.svg',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prods, cats] = await Promise.all([
                fetch('/api/products').then(r => r.json()),
                fetch('/api/categories').then(r => r.json()),
            ]);
            setProducts(prods);
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: string) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setForm({
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            unit: 'kg',
            category: categories[0]?.name || '',
            stock: '',
            isOrganic: false,
            isFeatured: false,
            image: '/images/default-veg.svg',
        });
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            originalPrice: String(product.originalPrice),
            unit: product.unit,
            category: product.category,
            stock: String(product.stock),
            isOrganic: product.isOrganic,
            isFeatured: product.isFeatured,
            image: product.image,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                // Update
                const res = await fetch(`/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                        originalPrice: Number(form.originalPrice),
                        stock: Number(form.stock),
                    }),
                });
                if (res.ok) {
                    showToast('Product updated successfully!', 'success');
                    fetchData();
                    setShowModal(false);
                }
            } else {
                // Create
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                        originalPrice: Number(form.originalPrice),
                        stock: Number(form.stock),
                    }),
                });
                if (res.ok) {
                    showToast('Product added successfully!', 'success');
                    fetchData();
                    setShowModal(false);
                }
            }
        } catch (error) {
            showToast('Something went wrong!', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Product deleted!', 'success');
                fetchData();
            }
        } catch {
            showToast('Failed to delete!', 'error');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const availableImages = [
        '/images/spinach.svg', '/images/carrot.svg', '/images/tomato.svg',
        '/images/capsicum.svg', '/images/broccoli.svg', '/images/bottlegourd.svg',
        '/images/coriander.svg', '/images/potato.svg', '/images/mint.svg',
        '/images/cauliflower.svg', '/images/onion.svg', '/images/bittergourd.svg',
        '/images/default-veg.svg',
    ];

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                        Products
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Manage your vegetable inventory ({products.length} products)
                    </p>
                </div>
                <button onClick={openAddModal} className="btn-primary">
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
                <Search size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                }} />
                <input
                    className="input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                />
            </div>

            {/* Products Table */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
            }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading products...
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Organic</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Image src={product.image} alt={product.name} width={32} height={32} style={{ objectFit: 'contain' }} />
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{product.name}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                background: 'var(--primary-50)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.78rem',
                                                color: 'var(--primary)',
                                                fontWeight: 500,
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{product.price}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>/{product.unit}</span>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 600,
                                                color: product.stock > 20 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--danger)',
                                            }}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>{product.isOrganic ? '🌿 Yes' : 'No'}</td>
                                        <td>{product.isFeatured ? '⭐ Yes' : 'No'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px solid var(--border)',
                                                        background: 'white',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--primary)',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'var(--primary-50)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'white';
                                                    }}
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px solid #fecaca',
                                                        background: 'white',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--danger)',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#fee2e2';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'white';
                                                    }}
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    animation: 'fadeIn 0.2s ease-out',
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-xl)',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        animation: 'fadeInUp 0.3s ease-out',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px',
                        }}>
                            <h2 style={{
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                fontFamily: "'Inter', sans-serif",
                                color: 'var(--primary-dark)',
                            }}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '8px',
                                    background: 'var(--primary-50)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <X size={18} color="var(--text)" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {/* Name */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                        Product Name *
                                    </label>
                                    <input
                                        className="input"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Fresh Spinach"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                        Description *
                                    </label>
                                    <textarea
                                        className="input"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Describe the product..."
                                        required
                                        rows={3}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                {/* Price row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                            Price (₹) *
                                        </label>
                                        <input
                                            className="input"
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                                            placeholder="35"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                            Original Price (₹)
                                        </label>
                                        <input
                                            className="input"
                                            type="number"
                                            value={form.originalPrice}
                                            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                                            placeholder="50"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                            Unit *
                                        </label>
                                        <select
                                            className="select"
                                            value={form.unit}
                                            onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                        >
                                            <option value="kg">kg</option>
                                            <option value="bunch">bunch</option>
                                            <option value="piece">piece</option>
                                            <option value="pack">pack</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Category and Stock */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                            Category *
                                        </label>
                                        <select
                                            className="select"
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                            Stock *
                                        </label>
                                        <input
                                            className="input"
                                            type="number"
                                            value={form.stock}
                                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                            placeholder="100"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Image selector */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                                        Product Image
                                    </label>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                                        gap: '8px',
                                    }}>
                                        {availableImages.map(img => (
                                            <button
                                                key={img}
                                                type="button"
                                                onClick={() => setForm({ ...form, image: img })}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: form.image === img ? '3px solid var(--primary)' : '2px solid var(--border)',
                                                    background: '#f0fdf4',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '6px',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <Image src={img} alt="" width={36} height={36} style={{ objectFit: 'contain' }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.isOrganic}
                                            onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                        />
                                        🌿 Organic
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.isFeatured}
                                            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                        />
                                        ⭐ Featured
                                    </label>
                                </div>

                                {/* Submit */}
                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>
                                    <Save size={18} />
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
