'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import HeroSection from '@/components/store/HeroSection';
import ProductCard from '@/components/store/ProductCard';
import { Product, Category } from '@/types';
import { Search, SlidersHorizontal, ChevronRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    const featuredParam = urlParams.get('featured');

    if (searchParam) setSearchQuery(searchParam);
    if (categoryParam) setSelectedCategory(categoryParam);

    fetchCategories();
    fetchProducts(searchParam || '', categoryParam || 'all', '', featuredParam || '');
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async (search = '', category = 'all', sort = '', featured = '') => {
    setLoading(true);
    try {
      let url = '/api/products?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (category && category !== 'all') url += `category=${encodeURIComponent(category)}&`;
      if (sort) url += `sort=${sort}&`;
      if (featured) url += `featured=true&`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(searchQuery, category, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    fetchProducts(searchQuery, selectedCategory, sort);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery, selectedCategory, sortBy);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <HeroSection />

      {/* Categories section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              <Sparkles size={16} />
              Browse by Category
            </span>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--primary-dark)',
            }}>
              What Are You Looking For?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }} className="stagger-children">
            {/* All category */}
            <button
              onClick={() => handleCategoryChange('all')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '24px 16px',
                borderRadius: 'var(--radius-lg)',
                border: selectedCategory === 'all' ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: selectedCategory === 'all' ? 'var(--primary-50)' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === 'all' ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'all') {
                  e.currentTarget.style.borderColor = 'var(--primary-light)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'all') {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }
              }}
            >
              <span style={{ fontSize: '2rem' }}>🛒</span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: selectedCategory === 'all' ? 'var(--primary)' : 'var(--text)',
              }}>
                All Veggies
              </span>
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '24px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: selectedCategory === cat.name ? '2px solid var(--primary)' : '2px solid var(--border)',
                  background: selectedCategory === cat.name ? 'var(--primary-50)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === cat.name ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.name) {
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.name) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: selectedCategory === cat.name ? 'var(--primary)' : 'var(--text)',
                }}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products section */}
      <section style={{ padding: '0 0 80px' }} id="products">
        <div className="container">
          {/* Section header with filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: 'var(--primary-dark)',
                marginBottom: '4px',
              }}>
                {selectedCategory === 'all' ? 'All Fresh Vegetables' : selectedCategory}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {products.length} products available
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <SlidersHorizontal size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="select"
                style={{
                  width: 'auto',
                  minWidth: '180px',
                  padding: '10px 36px 10px 14px',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <div className="skeleton" style={{ height: '180px' }} />
                  <div style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '10px' }} />
                    <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '10px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text)', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
                No vegetables found
              </h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}>
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features section */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        color: 'white',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
              Why Choose VegFresh?
            </h2>
            <p style={{ opacity: 0.8, fontSize: '1rem' }}>
              We are committed to delivering the freshest vegetables to your table
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '28px',
          }}>
            {[
              {
                emoji: '🌾',
                title: 'Direct from Farm',
                desc: 'We source directly from local organic farms, ensuring the freshest produce reaches you within 24 hours of harvest.',
              },
              {
                emoji: '✅',
                title: 'Quality Assured',
                desc: 'Every vegetable goes through a rigorous 3-step quality check before being packed for delivery.',
              },
              {
                emoji: '🚚',
                title: 'Express Delivery',
                desc: 'Same-day delivery available for orders placed before 10 AM. Free delivery on orders above ₹500.',
              },
              {
                emoji: '💰',
                title: 'Best Prices',
                desc: 'By eliminating middlemen, we offer you farm-fresh vegetables at the most competitive prices.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: '32px 24px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '2.5rem', marginBottom: '16px', display: 'block' }}>
                  {feature.emoji}
                </span>
                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  marginBottom: '10px',
                }}>
                  {feature.title}
                </h3>
                <p style={{ opacity: 0.75, fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
