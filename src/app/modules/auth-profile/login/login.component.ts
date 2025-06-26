import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';


declare function alertDanger([]) : any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email!: string;
  password!: string;


  constructor(
    public authService: AuthService,
    public router: Router,

  ) { }


  ngOnInit(): void {
    //CONTROL SI EL USUARIO YA ESATA AUTENTICADO QUE NO ENTRE AL LOGIN NI AL REGISTRO
    if (this.authService.user) {
        this.router.navigate(['/'])
    }
  }

  login() {

    if (!this.email) { alertDanger('ES NECESARIO INGRESAR EL EMAIL') }
    if (!this.password) { alertDanger('ES NECESARIO INGRESAR UNA CONTRASEÑA') }


    this.authService.login(this.email, this.password).subscribe(resp => {
      console.log('respuesta', resp);
      if (!resp.error && resp) {
        // EL USUSARIO INGRESO CON EXITO
        this.router.navigate(['/'])
      } else {
        alert(resp.error.message)
      }
    })
  }

}
