import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  // ✅ Initialize from localStorage
  private _cart = signal<CartItem[]>(this.loadFromStorage());
  readonly cart = this._cart;

  constructor() {
    // ✅ Auto-persist to localStorage whenever cart changes
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this._cart()));
    });
  }

  // ✅ Computed totals
  readonly totalValue = computed(() =>
    this._cart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  readonly totalItems = computed(() =>
    this._cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  // ✅ Add to cart (with stock limit check)
  addToCart(product: Product): void {
    if (product.stock <= 0) {
      console.warn(`Product "${product.title}" is out of stock.`);
      return;
    }

    this._cart.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);

      if (existing) {
        // Prevent exceeding available stock
        if (existing.quantity >= product.stock) {
          console.warn(`Reached stock limit for "${product.title}"`);
          return items;
        }
        return items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  // ✅ Remove item entirely from cart
  removeFromCart(productId: number): void {
    this._cart.set(this._cart().filter((i) => i.product.id !== productId));
  }

  // ✅ Adjust quantity (clamped to stock)
  updateQuantity(productId: number, quantity: number): void {
    this._cart.update((items) =>
      items.map((i) => {
        if (i.product.id === productId) {
          const newQty = Math.max(0, Math.min(quantity, i.product.stock));
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0)
    );
  }

  // ✅ Clear entire cart
  clearCart(): void {
    this._cart.set([]);
  }

  // ✅ Load persisted cart
  private loadFromStorage(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  }

  getQuantity(productId: number): number {
    return this.cart().find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  increaseQuantity(id: number) {
    const items = this.cart().map((i) =>
      i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    this.cart.set(items);
  }


  decreaseQuantity(id: number) {
    const items = this.cart()
      .map((i) =>
        i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
      .filter((i) => i.quantity > 0);
    this.cart.set(items);
  }

  isInCart(productId: number): boolean {
    return this.cart().some((i) => i.product.id === productId);
  }
}
