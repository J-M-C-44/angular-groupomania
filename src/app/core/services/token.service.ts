import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  jwt = new JwtHelperService()

  
  constructor() { }


  saveToken(token:string) {
    localStorage.setItem('token', token);
  }
  
  getToken(){
    let savedToken = localStorage.getItem('token') ; 
    return savedToken;
  }
  getDecodedToken() {
    let savedToken = localStorage.getItem('token') ; 
    let decodedToken : DecodedToken = this.jwt.decodeToken(savedToken!);
    let userId = decodedToken.userId;
    let userRole = decodedToken.userRole
    return decodedToken;
  }

  // gestion de l'expépiration ???
  //    jwt.isTokenExpired(savedToken);
  // }

  deleteToken() {
    localStorage.removeItem('token');
  }


}
