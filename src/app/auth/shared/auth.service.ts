import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginDataRetreived, SignupDataRetreived } from '../../shared/models/auth.model';


// ICIJCO à mettre en import/param
const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})

/**
 * gestion de l'enregistrement d'un nouvel utilisateur
 * gestion de la connexion d'un utilisateur existant
 */
export class AuthService {

  private loginUrl = baseUrl+'auth/login';
  private signupUrl = baseUrl+'auth/signup';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }
  
/**
 * connexion d'un utilisateur préalablement enrgistré  (appel post HTTP à l'API)
 * @param email {string} - adresse email
 * @param password {string} - mot de passe
 */
  login(email:string, password:string): Observable<LoginDataRetreived> {
      return this.http.post(this.loginUrl, {email,password}, this.httpOptions)
      .pipe(
        tap((data: any) => {  
          // console.log('données reçues : ', data)
        }),
        catchError(err => {
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

/**
 * enregistre un nouvel utilisateur en bdd via un appel à l'api (post HTTP)
 * @param email {string} - adresse email
 * @param password {string} - mot de passe
 */
  signup(email:string, password:string): Observable<SignupDataRetreived> {
    return this.http.post(this.signupUrl, {email,password}, this.httpOptions)
    .pipe(
      tap((data: any) => {
        console.log('données reçues : ', data)
      }),
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
