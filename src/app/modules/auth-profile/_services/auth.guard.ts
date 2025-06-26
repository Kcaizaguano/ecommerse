import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    public authServices: AuthService,
    public router: Router
  ) {

  }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.authServices.user || !this.authServices.token ) {
      this.router.navigate(['auth/login'])
      return false
    }

    let token = this.authServices.token;
    let expiration = (JSON.parse(atob(token.split('.')[1]))).exp;
    if (Math.floor((new Date).getTime()/1000) >= expiration ) {
      this.authServices.logout();
      return false
    }

    return true
  }

}
