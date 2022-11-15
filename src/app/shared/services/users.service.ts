import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

// ICIJCO à mettre en import/param
const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = baseUrl+'users/';
  private postsUrl = baseUrl+'posts';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  

  getOneUser(userId:number): Observable<User> {
      return this.http.get<User>(this.usersUrl+userId)
          .pipe(
            tap((data: any) => console.log('données reçues : ', data)),
            catchError(err => {
              console.log('err : ', err);
              if (!err.status) {
                  err = 'serveur non accessible'  
              } else if (err.status == 404) {
                  err = 'non trouvé'  
              
              } else if (err.status == 500) {
                err = 'erreur interne serveur'  
  
              } else {
                  err = err.error.message
              } 
              throw err;
            })
          )
   
  }
}


