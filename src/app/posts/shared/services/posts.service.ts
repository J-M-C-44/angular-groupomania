import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from '../../../shared/models/post.model';

// ICIJCO à mettre en import/param
const baseUrl = 'http://localhost:3000/api/v1/'
// ICIJCO à mettre en interface + import 
export interface PostDataRetreived {
  id: number,
  userId:string,
  text:string,
  imageUrl: string,
}
// export interface PostDatacreated {
//   text:string,
// }
export interface PaginatedPostList {
  posts : Post[],
  currentPage: number,
  totalPages: number,
  firstPage: boolean,
  lastPage: boolean,
  totalRows: number
}


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postsUrl = baseUrl+'posts';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  createPost(text:string, imagePost?:File): Observable<PostDataRetreived> {
    if (imagePost) {
      //form data
      const formData: FormData = new FormData();
      let post = { text : text}
      formData.append('post', JSON.stringify(post));
      formData.append('image', imagePost);
      return this.http.post(this.postsUrl, formData, this.httpOptions)
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
        return this.http.post(this.postsUrl,{ text }, this.httpOptions)
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

  getAllPosts(page?:number, limit?:number): Observable<PaginatedPostList> {
      return this.http.get<PaginatedPostList>(this.postsUrl)
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


