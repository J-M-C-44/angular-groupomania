// <-------------          service comments : tout ce que tourne autour des comments            ------------>

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Comment } from '../../../shared/models/comment.model';

const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})

/** regroupe toutes les fonctions relatives aux commentaires :
 *     - récupération des commentaires sur l'API pour un post donné
 *     - ajout d'un commentaire sur un post donné  via l'API: avec ou sans image
 *     - mise à jour d'un commentaire via l'API : avec ou sans image
 *     - suppression d'un commentaire via l'API
 */
export class CommentsService {

  private commentsUrl = baseUrl+'comments/';
  private postsUrl = baseUrl+'posts/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

/**
 * récupère les commentaires sur l'API pour un post donné
 * @param postId - post sur lequel recherché les commentaires
 * @returns tableau des commentaires
 */
  getAllCommentsForOnePost (postId:number): Observable<Comment[]> {
    //icicjco demander à Mentor comment accepter erreur 404 qui n'est pas une erreur dans certain cas
    return this.http.get<Comment[]>(this.postsUrl+postId+'/comments/')
        .pipe(
          tap((data: any) => {
            // console.log('données getAllCommentsForOnePost  : ', data)
          }),
          catchError(err => {
              // console.log('err : ', err);
            if (!err.status) {
                err = 'serveur non accessible'  
            } else if (err.status == 404) {
                err = 'non trouvé'  
              // err = of([]);
              // console.log('non trouvé !, err = ', err)
            } else if (err.status == 500) {
              err = 'erreur interne serveur'  
 
            } else {
                err = err.error.message
            } 
            throw err;
          })
        )
  }

 /**
  * ajoute un commentaire sur un post donné (via POST HTTP sur l'API)
  * @param postId - id du post sur lequel ajouté un commentaire
  */
  addComment(postId:number,text:string, imageComment?:File): Observable<Comment> {
    if (imageComment) {
      //form data
      const formData: FormData = new FormData();
      let comment = { text : text}
      formData.append('comment', JSON.stringify(comment));
      formData.append('image', imageComment);
      return this.http.post(this.postsUrl+postId+'/comments', formData, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
          }),
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
    } else {
      // JSON
        return this.http.post(this.postsUrl+postId+'/comments',{ text }, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
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
  }

/**
 * suppression d'un commentaire donné (via DELETE HTTP sur l'API)
 * @param commentId - id du commentaire à supprimer
 */
  deleteComment (commentId:number): Observable<Comment> {
    return this.http.delete<Comment[]>(this.commentsUrl+commentId)
        .pipe(
          tap((data: any) => {
            // console.log('données deleteComment  : ', data)
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

  /**
   * mise à jour d'un commentaire donné 
   * @param commentId - id du commentaire à modifier
   * @param text - message de remplacement
   * @param imageComment (optionnel) - fichier image de remplacement ou 'toDelete' si demande suppression de l'image existante
   */
  updateComment(commentId:number, text:string, imageComment?:File|string,) : Observable<Comment> {
    if (imageComment && (imageComment != 'toDelete')) {
      //form data si fichier
      const formData: FormData = new FormData();
      let comment = { text : text}
      formData.append('comment', JSON.stringify(comment));
      formData.append('image', imageComment);
      return this.http.put(this.commentsUrl+commentId, formData, this.httpOptions)
          .pipe(
            tap((data: any) => {
              console.log('données reçues : ', data)
            }),
            catchError(err => {
               console.log('err : ', err);
              if (!err.status) {
                  err = 'serveur non accessible'  
              } else if (err.status == 500) {
                  err = 'erreur interne serveur' 
              } else if (err.status == 404) {
                  err = 'non trouvé'   
              } else {
                  err = err.error.message
              } 
              throw err;
            })
          )
    } else {
      // JSON
        let body = {} 
        if (imageComment && (imageComment = 'toDelete')) {
          let imageUrl = imageComment
          body = {text, imageUrl}; 
        } else {
          body = {text};
        }
        return this.http.put(this.commentsUrl+commentId, body, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
            }),
            catchError(err => {
              // console.log('err : ', err);
              if (!err.status) {
                err = 'serveur non accessible'  
            } else if (err.status == 500) {
                err = 'erreur interne serveur' 
            } else if (err.status == 404) {
                err = 'non trouvé'   
            } else {
                err = err.error.message
            } 
              throw err;
            })
          )
      };
  }
}

