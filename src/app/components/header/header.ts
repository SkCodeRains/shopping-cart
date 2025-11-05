import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { Router } from '@angular/router';
import { CartComponent } from "../cart-component/cart-component";

@Component({
  selector: 'app-header',
  imports: [CartComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  cartService = inject(CartService);
  router = inject(Router);


  itemCount = computed(() => this.cartService.cart().length);

  open() {
    this.router.navigate(['cart'])
  }
}
