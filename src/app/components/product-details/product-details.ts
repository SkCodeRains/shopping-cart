import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ProductListComponent } from '../product-list-component/product-list-component';
import { CommonModule } from '@angular/common';
import { ProductComponent } from "../product/product";

@Component({
  selector: 'app-product-details',
  imports: [InfiniteScrollDirective, CommonModule, ProductComponent, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails extends ProductListComponent implements AfterViewInit {



  product = signal<Product>(this.router.currentNavigation()?.extras.state?.['product']);
  allRelatedProducts = signal<Product[]>([]);

  constructor() {
    super();
    this.getProductsData();
  }

  override ngAfterViewInit(): void {
    if (this.productService.products().length == 0) {
      this.getProductsData();
      setTimeout(() => {
        this.loadRelatedProducts();
      }, 1000);
    } else {
      this.loadRelatedProducts();

    }

  }
  override onScroll(): void {
    console.log(this.data().length < this.allRelatedProducts().length);

    if (this.data().length < this.allRelatedProducts().length) {
      const all = this.allRelatedProducts();
      const next = all.slice(0, (this.size += 5));
      this.data.set(next);
      setTimeout(() => {
        if (this.isScrollView()) {
          this.onScroll();
        }
      }, 1000);
    }
  }

  override isScrollView() {
    return (this.scrollContainer()?.nativeElement.scrollWidth <= this.scrollContainer()?.nativeElement.clientWidth);
  }

  loadRelatedProducts() {
    const data = this.productService.getRelatedProducts(this.product());
    this.allRelatedProducts.set(data);
    this.onScroll();
  }

  override openProduct(product: Product): void {
    this.router.navigate(['product', product.id], { state: { product } });
    this.product.set(product);
    this.loadRelatedProducts();
  }


}
