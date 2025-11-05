import { afterNextRender, AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { HttpClient } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart-service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductComponent } from "../product/product";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list-component',
  imports: [InfiniteScrollDirective, CommonModule, ProductComponent],
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.scss',
})
export class ProductListComponent implements AfterViewInit {

  protected http = inject(HttpClient);
  protected productService = inject(ProductService);
  protected cartService = inject(CartService);
  protected router = inject(Router);

  scrollContainer = viewChild<ElementRef>('scrollContainer');

  PATH = environment.API_PATH;

  data = signal<Product[]>([]);
  size = 0;

  ngAfterViewInit(): void {
    this.getProductsData();
  }


  onScroll() {
    if (this.data().length < this.productService.products().length) {
      const all = this.productService.products();
      const next = all.slice(0, (this.size += 5));
      this.data.set(next);

      setTimeout(() => {
        if (this.isScrollView()) {
          this.onScroll();
        }
      }, 1000);

    }
  }

  isScrollView() {
    return (this.scrollContainer()?.nativeElement.scrollHeight <= this.scrollContainer()?.nativeElement.clientHeight);
  }

  getProductsData() {
    if (this.productService.products().length == 0) {
      this.http.get<Product[]>(this.PATH + 'products.json').subscribe({
        next: (data) => {
          this.productService.products.set(data);
          this.onScroll();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.onScroll();
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  openProduct(product: Product) {
    this.router.navigate(['product', product.id], { state: { product } });
  }
}
