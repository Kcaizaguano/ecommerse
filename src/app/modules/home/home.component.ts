import { Component, OnInit } from '@angular/core';
import { HomeService } from './_services/home.service';


declare var $: any;
declare function HOMEINITTEMPLATE([]): any;
declare function ModalProductDetail():any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  sliders: any = [];
  categories: any = [];
  bestProducts: any = [];
  oursProducts: any = [];
  productSelected: any = null;
  FlashSale:any =null;
  FlashProductList : any  = [];


  constructor(
    public homeService: HomeService,
  ) {

  }


  ngOnInit() {
    let TIME_NOW= new  Date().getTime();
    this.homeService.listHome(TIME_NOW).subscribe((resp: any) => {
      console.log(resp);
      this.sliders = resp.sliders;
      this.categories = resp.categories;
      this.bestProducts = resp.best_products;
      this.oursProducts = resp.ours_products;
      this.FlashSale = resp.flashSale;
      this.FlashProductList = resp.campaign_products;
      setTimeout(() => {
        if (this.FlashSale) {
          var eventCounter = $(".sale-countdown");
          let PARSE_DATE = new Date(this.FlashSale.end_date);
          let DATE = PARSE_DATE.getFullYear()+"/"+(PARSE_DATE.getMonth()+1)+"/"+(PARSE_DATE.getDay()+1);
          if (eventCounter.length) {
              eventCounter.countdown(DATE, function (e:any) {
                eventCounter.html(
                      e.strftime(
                          "<div class='countdown-section'><div><div class='countdown-number'>%-D</div> <div class='countdown-unit'>Day</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%H</div> <div class='countdown-unit'>Hrs</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%M</div> <div class='countdown-unit'>Min</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%S</div> <div class='countdown-unit'>Sec</div> </div></div>"
                      )
                  );
              });
          }
          
        }

        HOMEINITTEMPLATE($);
      }, 50);
    });


  }

  openModal(bestProd: any, FlashSale : any = null) {
    this.productSelected = null;
    setTimeout(() => {
      this.productSelected = bestProd;
      this.productSelected.FlashSale = FlashSale;
      setTimeout(() => {
        ModalProductDetail();

      }, 50);
    }, 100);
  }


  getCalNewPrice(product:any){
    if (this.FlashSale.type_discount == 1) {
      return product.price_usd - product.price_usd*this.FlashSale.discount*0.01;
    }else{
      return product.price_usd - this.FlashSale.discount;
    }

  }


}
