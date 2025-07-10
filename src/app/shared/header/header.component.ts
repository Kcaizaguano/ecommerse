import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  listCarts: any = [];
  totalCarts: any = 0;
  user: any = null;
  search_product: any = null;
  products_search: any = [];
  source: any;
  @ViewChild("filter") filter?: ElementRef;
  constructor(
    public router: Router,
    public cartServices: CartService
  ) { }

  ngOnInit(): void {
    this.user = this.cartServices._authServices.user;
    this.cartServices.currentDataCart$.subscribe((resp: any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum: any, item: any) => sum + item.total, 0);
    })
    if (this.cartServices._authServices.user._id) {
      this.cartServices.listCarts(this.cartServices._authServices.user._id).subscribe((resp: any) => {
        console.log(resp);
        resp.carts.forEach((cart: any) => {
          this.cartServices.changeCart(cart);
        });
      })
    }
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(500)).subscribe((c: any) => {
      let data = {
        search_product: this.search_product,
      }
      if (this.search_product.length > 1) {
        this.cartServices.searchProduct(data).subscribe((resp: any) => {
          console.log(resp);
          this.search_product = resp.products;
        })
      }
    })
  }


  isHome() {
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }

  logOut() {
    this.cartServices._authServices.logout();
  }

  removeCart(cart: any) {
    this.cartServices.deleteCart(cart._id).subscribe((resp: any) => {
      console.log(resp);
      this.cartServices.removeItemCart(cart);
    })
  }

  getRouterDiscount(product: any) {
    if (product.campaing_discount) {
      return { _id: product.campaing_discount._id };
    }
    return {};
  }

  getDiscountProduct(product: any) {
    if (product.campaing_discount) {
      if (product.campaing_discount.type_discount == 1) { //porcentaje
        return product.price_usd * product.campaing_discount.discount * 0.01;
      } else { //moneda
        return product.campaing_discount.discount;
      }
    }
    return 0;
  }



  searchProduct() {

  }


}
