//  <----------------------------          service de gestion du TOKEN        ---------------------->

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  jwt = new JwtHelperService()

  constructor(private router: Router,) { }


  saveToken(token:string) {
    localStorage.setItem('token', token);

  }
  
  getToken() :string{

      if (this.isTokenValid()) {
        return localStorage.getItem('token')!
      }
      else {
        this.router.navigateByUrl('/auth/login');
        return ''
      }
  }

  isTokenValid() : boolean {
    const savedToken = localStorage.getItem('token') ; 

    if (savedToken) {
      if (this.jwt.isTokenExpired(savedToken)) {
          return false
      } else {
          return true
      }
    } else {
        return false
    }
  }

  deleteToken() : void {
    localStorage.removeItem('token');

  }

}
