import fs from 'fs';
import path from 'path';
import { Product, Category, Order, User, Review, Coupon } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string): T[] {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function writeJSON<T>(filename: string, data: T[]): void {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Products
export function getProducts(): Product[] {
    return readJSON<Product>('products.json');
}

export function getProductById(id: string): Product | undefined {
    const products = getProducts();
    return products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
    const products = getProducts();
    return products.find(p => p.slug === slug);
}

export function createProduct(product: Product): Product {
    const products = getProducts();
    products.push(product);
    writeJSON('products.json', products);
    return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    writeJSON('products.json', products);
    return products[index];
}

export function deleteProduct(id: string): boolean {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    writeJSON('products.json', filtered);
    return true;
}

// Categories
export function getCategories(): Category[] {
    return readJSON<Category>('categories.json');
}

export function createCategory(category: Category): Category {
    const categories = getCategories();
    categories.push(category);
    writeJSON('categories.json', categories);
    return category;
}

export function deleteCategory(id: string): boolean {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    writeJSON('categories.json', filtered);
    return true;
}

// Orders
export function getOrders(): Order[] {
    return readJSON<Order>('orders.json');
}

export function getOrderById(id: string): Order | undefined {
    const orders = getOrders();
    return orders.find(o => o.id === id);
}

export function createOrder(order: Order): Order {
    const orders = getOrders();
    orders.push(order);
    writeJSON('orders.json', orders);
    return order;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
    writeJSON('orders.json', orders);
    return orders[index];
}

export function getOrdersByUserId(userId: string): Order[] {
    const orders = getOrders();
    const user = getUserById(userId);
    return orders.filter(o => 
        o.userId === userId || 
        (user && o.customerEmail?.toLowerCase() === user.email?.toLowerCase())
    );
}

// Users
export function getUsers(): User[] {
    return readJSON<User>('users.json');
}

export function getUserById(id: string): User | undefined {
    const users = getUsers();
    return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
    const users = getUsers();
    return users.find(u => u.email === email);
}

export function createUser(user: User): User {
    const users = getUsers();
    users.push(user);
    writeJSON('users.json', users);
    return user;
}

// Reviews
export function getReviews(): Review[] {
    return readJSON<Review>('reviews.json');
}

export function getReviewsByProductId(productId: string): Review[] {
    const reviews = getReviews();
    return reviews.filter(r => r.productId === productId);
}

export function createReview(review: Review): Review {
    const reviews = getReviews();
    reviews.push(review);
    writeJSON('reviews.json', reviews);
    return review;
}

// Coupons
export function getCoupons(): Coupon[] {
    return readJSON<Coupon>('coupons.json');
}

export function getCouponsByUserId(userId: string): Coupon[] {
    const coupons = getCoupons();
    return coupons.filter(c => c.userId === userId);
}

export function createCoupon(coupon: Coupon): Coupon {
    const coupons = getCoupons();
    coupons.push(coupon);
    writeJSON('coupons.json', coupons);
    return coupon;
}

export function updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const coupons = getCoupons();
    const index = coupons.findIndex(c => c.id === id);
    if (index === -1) return null;
    coupons[index] = { ...coupons[index], ...updates };
    writeJSON('coupons.json', coupons);
    return coupons[index];
}
