import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Like } from '../../../shared/models/post.model';

const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private likesUrl = baseUrl+'likes';
  private postsUrl = baseUrl+'posts/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  likePost(postId:number): Observable<likeDataRetreived> { 
        return this.http.post(this.postsUrl+postId, this.httpOptions)
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
      };

  getAllLikesForOnePost (postId:number): Observable<Like[]> {
    return this.http.get<Like[]>(this.postsUrl)
        .pipe(
          tap((data: any) => console.log('données reçues : ', data)),
          catchError(err => {
              console.log('err : ', err);
            if (!err.status) {
                err = 'serveur non accessible'  
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
