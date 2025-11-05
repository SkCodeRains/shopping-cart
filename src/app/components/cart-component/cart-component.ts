import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../models/product.model';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.scss']
})
export class CartComponent {
  cartService = inject(CartService);

  // Signals from service
  cart = this.cartService.cart;
  totalValue = this.cartService.totalValue;
  totalItems = this.cartService.totalItems;

  // Optional input — if you’re rendering this in a dropdown
  isHoverMode = input(false);

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    alert('Proceeding to checkout...');
  }

  closeHover() {
    // Hide hover cart (handled by parent header)
  }
}
