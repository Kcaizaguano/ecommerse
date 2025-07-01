import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class EcommerceAuthService {

  constructor(
    public authServices: AuthService,
    public http: HttpClient
  ) { }

  // DIRECCION DE CLIENTE
  listAddresClient(user_id: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + "address_client/list?user_id=" + user_id;
    return this.http.get(URL, { headers: headers });
  }

  registerAddresClient(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'address_client/register';
    return this.http.post(URL, data, { headers: headers });
  }

  updateAddresClient(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'address_client/update';
    return this.http.put(URL, data, { headers: headers });
  }

  deleteAddresClient(address_client_id: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'address_client/delete/' + address_client_id;
    return this.http.delete(URL, { headers: headers });
  }
  //

  registerSale(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'sale/register';
    return this.http.post(URL, data, { headers: headers });
  }

  //
  showProfileClient(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'home/profile_client';
    return this.http.post(URL, data, { headers: headers });
  }

  updateProfileClient(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'home/update_client';
    return this.http.post(URL, data, { headers: headers });
  }

  //REVIEW
  registerProfileClientReview(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'review/register';
    return this.http.post(URL, data, { headers: headers });
  }

  updateProfileClientReview(data: any) {
    let headers = new HttpHeaders({ 'token': this.authServices.token });
    let URL = URL_SERVICIOS + 'review/update';
    return this.http.put(URL, data, { headers: headers });
  }



}
