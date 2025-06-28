import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {

constructor(
  public authEcommerceService:EcommerceAuthService,
){}

ngOnInit(): void {
  this.showProfileClient();
}

showProfileClient(){

  let data ={
    user_id : this.authEcommerceService.authServices.user._id,
  };

  this.authEcommerceService.showProfileClient(data).subscribe((resp:any) => {
    console.log(resp);
  });
}

}
