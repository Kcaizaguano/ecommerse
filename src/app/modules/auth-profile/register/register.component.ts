import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';


declare function alertDanger([]) : any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email!:string;
  name!:string;
  surname!:string;
  password!:string;
  repet_password!:string;

  constructor(
    public authServices: AuthService,
    public router: Router,


  ) {}

  ngOnInit(): void {
        //CONTROL SI EL USUARIO YA ESATA AUTENTICADO QUE NO ENTRE AL LOGIN NI AL REGISTRO
        if (this.authServices.user) {
          this.router.navigate(['/'])
      }
  }


registro(){
  if(!this.name  || !this.surname || !this.password || !this.repet_password || !this.email){
    alertDanger('TODOS LOS CAMPOS SON REQUERIDOS');
    return
  }

  if (this.password != this.repet_password) {
    alertDanger('LAS CONTRASEÑAS DEBEN SER IGUALES')
    return
  }

  let data  = {
      email: this.email,
      name: this.name,
      surname:this.surname,
      password:this.password,
      repet_password:this.repet_password,
      rol:'cliente'
  }
  
  this.authServices.registro(data).subscribe(res => {
    console.log('respueta', res);
  })
}

}
