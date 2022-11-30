import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

// export interface DecodedToken {
//   userId: number,
//   role:number,
//   iat: number,
//   exp:number
// }
export class DecodedToken {
  userId: number = 0;
  userRole:number = 0;
  iat: number= 0;
  exp:number =0;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // savedToken =''
  // decodedToken = new DecodedToken

  jwt = new JwtHelperService()

  
  constructor(private router: Router,) { }


  saveToken(token:string) {
    localStorage.setItem('token', token);

    // this.savedToken = token
    // this.decodedToken = this.jwt.decodeToken(this.savedToken!);
    // console.log('savedToken :', this.savedToken)
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

  // getDecodedToken() : DecodedToken {
  //   // let savedToken = localStorage.getItem('token') ; 
  //   // let decodedToken : DecodedToken = this.jwt.decodeToken(this.savedToken!);
  //   // let userId = decodedToken.userId;
  //   // let userRole = decodedToken.userRole
  //   return this.decodedToken;
  // }

  isTokenValid() : boolean {
    const savedToken = localStorage.getItem('token') ; 
    // if ( (this.savedToken=='') || this.jwt.isTokenExpired(this.savedToken) ) {
    //   console.log('pas de token valide')
    //   this.router.navigateByUrl('/auth/login');
    // } else 
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
    
    // this.savedToken = '';
    // this.decodedToken = new DecodedToken;
  }

}
