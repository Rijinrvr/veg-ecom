import fs from 'fs';
import path from 'path';
import { Product, Category, Order, User } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string): T[] {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
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
    return orders.filter(o => o.userId === userId);
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

