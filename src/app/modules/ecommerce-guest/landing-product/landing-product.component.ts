import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_services/cart.service';

declare var $:any;
declare function LandingProductDetail():any;
declare function ModalProductDetail():any;
declare function alertDanger([]) : any;
declare function alertWarning([]) : any;
declare function alertSuccess([]) : any;

@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {


slug:any = null;
product_selected: any = null;
product_selected_modal: any = null;
related_product : any = [];
variedad_selected : any = null;
discount_id:any = null;
SALE_FLASH:any= null;
REVIEWS :any = null;
AVG_REVIEWS :any = null;
COUNT_REVIEW :any = null;
constructor(
  public ecommerce_guest : EcommerceGuestService,
  public router:Router,
  public routeActived:ActivatedRoute,
  public cartService : CartService,
){}

ngOnInit(): void {
  this.routeActived.params.subscribe(  (resp:any) => {
    this.slug = resp["slug"];    
  })
    this.routeActived.queryParams.subscribe(  (resp:any) => {
    this.discount_id = resp["_id"];    
  })
  console.log(this.slug);
  this.ecommerce_guest.showLandingProduct(this.slug, this.discount_id).subscribe((resp:any) => {
    console.log(resp);
    this.product_selected = resp.product;
    this.related_product = resp.related_products;
    this.SALE_FLASH = resp.SALE_FLASH;
    this.REVIEWS = resp.REVIEWS;
    this.AVG_REVIEWS = resp.AVG_REVIEWS;
    this.COUNT_REVIEW = resp.COUNT_REVIEW;
    setTimeout(() => {
      LandingProductDetail();

    }, 50);

  })
}

openModal(bestProd: any, FlashSale : any = null) {
  this.product_selected_modal = null;
  setTimeout(() => {
    this.product_selected_modal = bestProd;
    this.product_selected_modal.FlashSale = FlashSale;
    setTimeout(() => {
      ModalProductDetail();

    }, 50);
  }, 100);
}

getDiscount(){
  let discount = 0;
  if (this.SALE_FLASH) {
    if (this.SALE_FLASH.type_discount == 1) {
      return this.SALE_FLASH.discount * this.product_selected.price_usd*0.01;
    }else{
      return this.SALE_FLASH.discount;
    }
  }
  return discount;
}


getCalNewPrice(product:any){
  // if (this.FlashSale.type_discount == 1) {
  //   return product.price_usd - product.price_usd*this.FlashSale.discount*0.01;
  // }else{
  //   return product.price_usd - this.FlashSale.discount;
  // }

  return 0;

}


addCart(product:any){
  if (!this.cartService._authServices.user) {
    alertDanger("NECESITAS AUTENTICARTE PARA AGREGAR UN PRODUCTO AL CARRITO  DE COMPRAS");
    return;
  }
  if ($("#qty-cart").val() == 0) {
    alertDanger("NECESITAS AGREGAR UN PRODUCTO MAYOR A CERO");
    return;
  }

  if (this.product_selected.type_inventario == 2) {
    if (!this.variedad_selected) {
      alertDanger("NECESITAS SELECIONAR UNA VARIEDAD DEL PRODUCTO");
      return;
    }

    if (this.variedad_selected) {
      if (this.variedad_selected.stock <  $("#qty-cart").val() ) {
        alertDanger("NECESITAS SELECIONAR UNA CANTIDAD MENOR - STOCK NO DISPONIBLE");
        return;
      }
    }
  }
  let data = {
    user: this.cartService._authServices.user._id,
    product : this.product_selected._id,
    type_discount : this.SALE_FLASH ? this.SALE_FLASH.type_discount:null,
    discount: this.SALE_FLASH ? this.SALE_FLASH.discount:0,
    cantidad: $("#qty-cart").val(),
    variedad: this.variedad_selected ? this.variedad_selected._id:null,
    code_cupon: null,
    code_discount : this.SALE_FLASH ? this.SALE_FLASH._id:null ,
    price_unitario : this.product_selected.price_usd ,
    subtotal: this.product_selected.price_usd - this.getDiscount() ,// $("#qty-cart").val(),
    total:(this.product_selected.price_usd - this.getDiscount()) * $("#qty-cart").val(),
  };
  this.cartService.registerCard(data).subscribe((resp:any)=> {
    if (resp.message == 403) {
      alertDanger(resp.message_text);
      return;
    }else{
      this.cartService.changeCart(resp.cart);
      alertSuccess("EL PRODUCTO SE HA AGREGADO EXITOSAMENTE AL CARRITO");
    }
  }, error => {
    console.log(error);
    if (error.error.message == "EL TOKEN NO ES VALIDO") {
      this.cartService._authServices.logout();
    }
  })

}

selectVariedad(variedad:any){
  this.variedad_selected = variedad;
}



}
