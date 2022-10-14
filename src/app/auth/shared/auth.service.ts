import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// ICIJCO à mettre en import/param
const baseUrl = 'http://localhost:3000/api/v1/'
// ICIJCO à mettre en interface + import 
export interface LoginDataRetreived {
  id: number,
  last_name:string,
  first_name:string,
  fonction: string,
  avatarUrl: string,
  role: number,
  token: string
}

export interface SignupDataRetreived {
  id: number,
  last_name:string,
  first_name:string,
  fonction: string,
  avatarUrl: string,
  role: number,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = baseUrl+'auth/login';
  private signupUrl = baseUrl+'auth/signup';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }
  

  login(email:string, password:string): Observable<LoginDataRetreived> {
      return this.http.post(this.loginUrl, {email,password}, this.httpOptions)
      .pipe(
        tap((data: any) => console.log('données reçues : ', data)),
        catchError(err => {
          // console.log('err : ', err);
          if (!err.status) {
              err = 'serveur non accessible'  
          } else if (err.status == 429) {
              err = 'trop de requêtes dans le temps imparti, réessayez plus tard'  
          } else {
              err = err.error.message
          } 
          throw err;
        })
      )
  }

  
  signup(email:string, password:string): Observable<SignupDataRetreived> {
    return this.http.post(this.signupUrl, {email,password}, this.httpOptions)
    .pipe(
      tap((data: any) => console.log('données reçues : ', data)),
      catchError(err => {
        // console.log('err : ', err);
        if (!err.status) {
            err = 'serveur non accessible'  
        } else if (err.status == 429) {
            err = 'trop de requêtes dans le temps imparti, réessayez plus tard'  
        } else {
            err = err.error.message
        } 
        throw err;
      })
    )
}
}
