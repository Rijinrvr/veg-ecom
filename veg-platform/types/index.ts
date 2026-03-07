export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    unit: string;
    image: string;
    category: string;
    stock: number;
    isOrganic: boolean;
    isFeatured: boolean;
    rating: number;
    reviews: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    productCount: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    createdAt: string;
}

export interface Order {
    id: string;
    userId?: string;
    items: CartItem[];
    total: number;
    subtotal: number;
    discount: number;
    couponCode?: string;
    deliveryFee: number;
    rewardEarned?: boolean;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    pincode: string;
    paymentId: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderStatus: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface AdminUser {
    username: string;
    password: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    images: string[];
    videos: string[];
    createdAt: string;
}

export interface Coupon {
    id: string;
    userId: string;
    code: string;
    value: number; // Discount amount in ₹
    isScratched: boolean;
    isUsed: boolean;
    expiryDate: string;
    createdAt: string;
}

