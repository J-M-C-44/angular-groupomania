// <-------------          service posts : tout ce que tourne autour des posts            ------------>

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post, PostDataRetreived, PaginatedPostList   } from '../../../shared/models/post.model';

const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})

/** regroupe toutes les fonctions relatives aux posts :
 *     - récupération des posts sur l'API : un post, tous les posts avec pagination, tous les post d'un user donné
 *     - création d'un post via l'API: avec ou sans image
 *     - mise à jour d'un post via l'API : avec ou sans image
 *     - suppression d'un post via l'API
 */
export class PostsService {

  private postsUrl = baseUrl+'posts/';
  private usersUrl = baseUrl+'users/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  /**
   *  création d'un post via l'API: avec ou sans image
   * @param text - message du post
   * @param imagePost - fichier image du post(optionnel)
   * @returns données users
   */
  createPost(text:string, imagePost?:File): Observable<PostDataRetreived> {
    if (imagePost) {
      //form data en cas de fichier joint
      const formData: FormData = new FormData();
      let post = { text : text}
      formData.append('post', JSON.stringify(post));
      formData.append('image', imagePost);
      return this.http.post(this.postsUrl, formData, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
              }
            ),
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
        return this.http.post(this.postsUrl,{ text }, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
              }
            ),
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
  *  recupération de tous les posts (par page) par get HTTP sur API
  * @param page - numéro de page
  * @param limit - nombre par page
  * @returns tableau de données posts + infos de pagination
  */
  getAllPosts(page?:number, limit?:number): Observable<PaginatedPostList> {
    if (page && limit) {}
    const url = (page && limit) ? this.postsUrl+'?page='+page+'&limit='+limit : this.postsUrl;
      return this.http.get<PaginatedPostList>(url)
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
   
  }

  /**
  *  recupération de tous les posts pour un user donné  (par get HTTP sur API)
  * @param userId - id du user pour lequel rechercher des posts
  * @returns tableau de données posts + infos de pagination
  */
  getAllPostsForOneUser(userId:number) : Observable<Post[]> {
    return this.http.get<Post[]>(this.usersUrl+userId+'/posts')
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
            }),  
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
/**
  *  suppression d'un post donné (par delete HTTP sur API)
  * @param postId - id du post à supprimer
  */
  deletePost (postId:number): Observable<Post> {
    return this.http.delete<Post[]>(this.postsUrl+postId)
        .pipe(
          tap((data: any) => {
            console.log('données deletePost  : ', data)
          }),
          catchError(err => {

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
 * 
 * @param postId - id du post à mettre à jour
 * @param text - message de remplacement
 * @param imagePost (optionnel) - fichier image de remplacement ou 'todelete' en cas de demande de suppression de l'image existante  
 */
  updatePost(postId:number, text:string, imagePost?:File|string,) : Observable<Post> {
    if (imagePost && (imagePost != 'toDelete')) {
      //form data si fichier
      const formData: FormData = new FormData();
      let post = { text : text}
      formData.append('post', JSON.stringify(post));
      formData.append('image', imagePost);
      return this.http.put(this.postsUrl+postId, formData, this.httpOptions)
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
        if (imagePost && (imagePost = 'toDelete')) {
          let imageUrl = imagePost
          body = {text, imageUrl}; 
        } else {
          body = {text};
        }
        // return this.http.post(this.commentsUrl+commentId,{ text }, this.httpOptions)
        return this.http.put(this.postsUrl+postId, body, this.httpOptions)
          .pipe(
            tap((data: any) =>  {
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


