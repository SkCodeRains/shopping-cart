// Define structure for products and metadata

export interface ProductMeta {
    color?: string;
    size?: string;
    material?: string;
    model?: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;          // e.g., "Laptops", "Shoes"
    brand?: string;            // e.g., "Apple", "Nike"
    tags?: string[];           // e.g., ["gaming", "laptop"]
    rating?: number;           // optional, for UI rating stars
    meta?: ProductMeta;        // optional metadata for similarity
    stock: number; // ✅ Available inventory
}

export interface CartItem {
    product: Product;
    quantity: number;
}
