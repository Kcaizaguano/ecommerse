import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  listCarts: any = [];
  totalCarts: any = 0;
  constructor(
    public router: Router,
    public cartServices: CartService
  ) { }

  ngOnInit(): void {
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


  isHome() {
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }

}
