import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", loadComponent: () => import('./components/product-list-component/product-list-component').then(c => c.ProductListComponent) },
    { path: "product/:id", loadComponent: () => import('./components/product-details/product-details').then(c => c.ProductDetails) },
    { path: "cart", loadComponent: () => import('./components/cart-component/cart-component').then(c => c.CartComponent) }
]; 