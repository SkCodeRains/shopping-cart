import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, startWith, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';

interface ProductState {
  loading: boolean;
  error: string | null;
  data: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  // private readonly initialState: ProductState = {
  //   loading: true,
  //   error: null,
  //   data: [],
  // };

  // Trigger to refresh/reload product data
  private reloadTrigger = signal(0);

  //  Load product data from local JSON file in /public/data/products.json
  readonly products = signal<Product[]>([]);

  //  Computed helpers for easier access
  // loading = computed(() => this.products().loading);
  // error = computed(() => this.products().error);
  // data = computed(() => this.products().data);

  constructor(private http: HttpClient) { }

  //  Manual reload if needed
  reload(): void {
    this.reloadTrigger.update((v) => v + 1);
  }

  //  Fetch a single product by ID
  getProductById(id: number): Product | undefined {
    return this.products().find((p: Product) => p.id === id);
  }

  //  Compute related products (same category, brand, or tags)
  getRelatedProducts(current: Product): Product[] {
    return this.products().filter(
      (p: Product) =>
        p.id !== current.id &&
        (p.category === current.category ||
          p.brand === current.brand ||
          p.tags?.some((tag: any) => current.tags?.includes(tag)))
    );
  }

  //  Optional — simulate stock deduction after checkout
  updateStockAfterCheckout(cartItems: { product: Product; quantity: number }[]): void {
    const updated = this.products().map((p: Product) => {
      const item = cartItems.find((ci) => ci.product.id === p.id);
      if (item) {
        return { ...p, stock: Math.max(0, p.stock - item.quantity) };
      }
      return p;
    });

    // directly updating in-memory state
    this.products.set(updated);
  }
}
