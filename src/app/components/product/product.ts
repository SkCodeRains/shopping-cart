import { Component, inject, input, InputSignal, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
  openProduct = output<Product>();
  cartService = inject(CartService);



  add(p: Product, e: MouseEvent) {
    e.preventDefault();
    this.addToCart.emit(p);
  }

  open(p: Product) {
    this.openProduct.emit(p);
  }

}
