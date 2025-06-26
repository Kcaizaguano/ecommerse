import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../ecommerce-guest/_services/cart.service';


declare function sectionCart(): any;
declare function alertDanger([]): any;
declare function alertSuccess([]): any;

@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css']
})
export class ListCartsComponent implements OnInit {


  listCarts: any = [];
  totalCarts: any = 0;
  code_cupon: any = null;
  constructor(
    public router: Router,
    public cartServices: CartService
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      sectionCart()
    }, 25);
    this.cartServices.currentDataCart$.subscribe((resp: any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum: any, item: any) => sum + item.total, 0);
    })
  }

  dec(cart: any) {
    if (cart.cantidad - 1 == 0) {
      alertDanger("NO PUEDES DISMINUIR UN PRODUCTO A CERO");
      return;
    }
    cart.cantidad = cart.cantidad - 1;
    cart.subtotal = cart.price_unitario * cart.cantidad;
    cart.total = cart.price_unitario * cart.cantidad;
    let data = {
      _id: cart._id,
      cantidad: cart.cantidad,
      subtotal: cart.subtotal,
      total: cart.total,
      product: cart.product._id,
      variedad: cart.variedad ? cart.variedad._id : null,
    }
    this.cartServices.updateCart(data).subscribe((resp: any) => {
      console.log(resp);
    })
  }
  inc(cart: any) {
    cart.cantidad = cart.cantidad + 1;
    cart.subtotal = cart.price_unitario * cart.cantidad;
    cart.total = cart.price_unitario * cart.cantidad;
    let data = {
      _id: cart._id,
      cantidad: cart.cantidad,
      subtotal: cart.subtotal,
      total: cart.total,
      product: cart.product._id,
      variedad: cart.variedad ? cart.variedad._id : null,
    }
    this.cartServices.updateCart(data).subscribe((resp: any) => {
      console.log(resp);
    })
  }
  removeCart(cart: any) {
    this.cartServices.deleteCart(cart._id).subscribe((resp: any) => {
      console.log(resp);
      this.cartServices.removeItemCart(cart);
    })
  }


  aplicarCupon() {
    let data = {
      code: this.code_cupon,
      user_id: this.cartServices._authServices.user._id,
    }
    this.cartServices.aplicarCupon(data).subscribe((res: any) => {
      console.log(res);
      if (res.message == 403) {
        alertDanger(res.message_text);
      } else {
        alertSuccess(res.message_text);
        this.listCart();
        this.cartServices.resetCart();
      }
    })
  }

  listCart() {
    if (this.cartServices._authServices.user._id) {
      this.cartServices.listCarts(this.cartServices._authServices.user._id).subscribe((resp: any) => {
        console.log(resp);
        resp.carts.forEach((cart: any) => {
          this.cartServices.changeCart(cart);
        });
      })
    }
  }

}
