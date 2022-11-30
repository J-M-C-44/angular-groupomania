import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Comment } from '../../../shared/models/comment.model';

const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private commentsUrl = baseUrl+'comments/';
  private postsUrl = baseUrl+'posts/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  getAllCommentsForOnePost (postId:number): Observable<Comment[]> {
    //icicjco demander à Mentor comment accepter erreur 404 qui n'est pas une erreur dans certain cas
    return this.http.get<Comment[]>(this.postsUrl+postId+'/comments/')
        .pipe(
          tap((data: any) => console.log('données getAllCommentsForOnePost  : ', data)),
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

  addComment(postId:number,text:string, imageComment?:File): Observable<Comment> {
    if (imageComment) {
      //form data
      const formData: FormData = new FormData();
      let comment = { text : text}
      formData.append('comment', JSON.stringify(comment));
      formData.append('image', imageComment);
      return this.http.post(this.postsUrl+postId+'/comments', formData, this.httpOptions)
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
    } else {
      // JSON
        return this.http.post(this.postsUrl+postId+'/comments',{ text }, this.httpOptions)
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
  }

  deleteComment (commentId:number): Observable<Comment> {
    return this.http.delete<Comment[]>(this.commentsUrl+commentId)
        .pipe(
          tap((data: any) => console.log('données deleteComment  : ', data)),
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

  updateComment(commentId:number, text:string, imageComment?:File|string,) : Observable<Comment> {
    if (imageComment && (imageComment != 'toDelete')) {
      //form data
      const formData: FormData = new FormData();
      let comment = { text : text}
      formData.append('comment', JSON.stringify(comment));
      formData.append('image', imageComment);
      return this.http.put(this.commentsUrl+commentId, formData, this.httpOptions)
          .pipe(
            tap((data: any) => console.log('données reçues : ', data)),
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
        // return this.http.post(this.commentsUrl+commentId,{ text }, this.httpOptions)
        return this.http.put(this.commentsUrl+commentId, body, this.httpOptions)
          .pipe(
            tap((data: any) => console.log('données reçues : ', data)),
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

