import { afterNextRender, AfterViewInit, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { HttpClient } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart-service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductComponent } from "../product/product";
import { environment } from '../../../environments/environment';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list-component',
  imports: [InfiniteScrollDirective, CommonModule, ProductComponent, NgbPagination],
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.scss',
})
export class ProductListComponent implements AfterViewInit {

  protected http = inject(HttpClient);
  protected productService = inject(ProductService);
  protected cartService = inject(CartService);
  protected router = inject(Router);

  scrollContainer = viewChild<ElementRef>('scrollContainer');

  totalElement = computed(() => this.productService.products().length);

  PATH = environment.API_PATH;

  data = signal<Product[]>([]);
  size = 0;

  navigationConfig = signal({
    page: 1,
    size: 5,

  });

  ngAfterViewInit(): void {
    this.getProductsData();
  }


  onScroll() {
    return;
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
          this.navigate(1);
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

  navigate(page: number) {
    const all = this.productService.products();
    const next = all.slice(this.navigationConfig().size * page - 5, (
      this.navigationConfig().size * page
    ));

    this.navigationConfig().page = page;


    this.data.set(next);
  }

}
