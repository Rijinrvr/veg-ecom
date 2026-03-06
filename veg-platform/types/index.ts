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

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    subtotal: number;
    deliveryFee: number;
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
