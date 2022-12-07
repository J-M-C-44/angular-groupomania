// <-------------          service likes : tout ce que tourne autour des likes            ------------>

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Like } from '../../../shared/models/like.model';

const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})

/** regroupe toutes les fonctions relatives aux likes :
 *     - récupération de tous les likes pour un post donné  (via POST HTTP sur l'API)
 *     - ajouter un like sur un post donné (via POST HTTP sur l'API)
 *     - supprimer un like sur un post donné (via DELETE HTTP sur l'API)
 */
export class LikesService {

  private likesUrl = baseUrl+'likes/';
  private postsUrl = baseUrl+'posts/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  /**
   * ajoute un like sur un post donné (via POST HTTP sur l'API)
   * @param postId - id du post sur lequel ajouté un like
   */
  likePost(postId:number): Observable<Like> { 
    return this.http.post(this.postsUrl+postId+'/likes', this.httpOptions)
      .pipe(
        tap((data: any) => {
          // console.log('données likePost reçues : ', data)
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
  };

/**
  * suppression d'un like donné (via DELETE HTTP sur l'API)
  * @param likeId - id du like à supprimer
  */
  unlikePost(likeId:number): Observable<Like> { 
    return this.http.delete(this.likesUrl+likeId, this.httpOptions)
      .pipe(
        tap((data: any) => {
          // console.log('données delete like reçues : ', data)
        }),
        catchError(err => {
          // console.log('err : ', err);
          if (!err.status) {
              err = 'serveur non accessible'  
          } else if (err.status == 429) {
              err = 'trop de requêtes dans le temps imparti, réessayez plus tard'  
          }  else if (err.status == 404) {
                err = 'non trouvé'
          } else {
              err = err.error.message
          } 
          throw err;
        })
      )
  };

  /**
   * récupère tous les likes pour un post donné  (via GET HTTP sur l'API)
   * @param postId - id du post sur lequel recherche les likes
   * @returns tableau des likes
   */
  getAllLikesForOnePost (postId:number): Observable<Like[]> {
    return this.http.get<Like[]>(this.postsUrl+postId+'/likes/')
        .pipe(
          tap((data: any) => {
            // console.log('données getAllLikesForOnePost reçues : ', data)
          }),
          catchError(err => {
              // console.log('err : ', err);
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
