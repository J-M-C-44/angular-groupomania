import { Component, OnInit } from '@angular/core';
// import { DecodedToken, TokenService } from 'src/app/core/services/token.service';
import { TokenService } from 'src/app/core/services/token.service';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../../shared/models/post.model';
import { PostExtended } from '../../shared/models/post.model';
import { LikesService } from '../shared/services/likes.service';
import { Like } from '../../shared/models/like.model';
import { CommentsService } from '../shared/services/comments.service';
import { Comment } from '../../shared/models/comment.model';
import { UsersService } from '../../shared/services/users.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
// import { User } from '../../shared/models/user.model';
// import {MatDialog} from '@angular/material/dialog'
// à voir si je garde....
// import { take, delay, tap  } from 'rxjs/operators';
// import { Observable, of } from 'rxjs'; 


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  animations: [
    trigger('animFromRight', [
      transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateX(-100%)',
        }),
        animate('500ms ease-out',
                style({ 
                      opacity: 1,
                      transform: 'translateX(0)'
                })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateX(0)',
        }),
        animate('400ms ease-in',
                style({ 
                      opacity: 0,
                      transform: 'translateX(+100%)',
                      
                })
        ),
      ]),
    ])
  ],
})

export class PostsListComponent implements OnInit {

  userId = 0;
  userIsAdmin = false;
  defaultAvatarUrl ='../../../assets/logo-avatar.jpg'
  avatarUrl ='';
  // monavatarUrl$ = Observable<User>;
  // url2$ = Observable<string>;
  // asyncObservable!: Observable<User>;
  // decodedToken= new DecodedToken ;
  //AvatarUrl=
  fullName = 'Vous';
  myUserData={}
  // newPostForm = new FormGroup({
  //   //icicjco : reprendre controle back-end
  //   textPost : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
  //   imagePost: new FormControl <File | null> (null)
  // })
  // newCommentForm = new FormGroup({
  //   //icicjco : reprendre controle back-end
  //   textComment : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
  //   imageComment: new FormControl <File | null> (null)
  // })
  fileName = '';
  imageFile!: File;
  imagePreview = '';
  commentFileName = '';
  commentImageFile!: File;
  commentImagePreview = ''

  posts:Post[] =[];
  postsExt:PostExtended[] =[];
  likes:Like[]=[]
  // comments:Comment[]=[]
  currentPage = 0;
  totalPages = 0;
  firstPage = true;
  lastPage = true;
  totalRows = 0;
  isLoading = true;
  // pageEvent: PageEvent;
  // datasource: null;
  // pageIndex:number;
  // pageSize:number;
  // length:number;
  // nbLikes = 0;
  // nbComments =0;

  constructor(
    //  private tokenService: TokenService,
     private snackBarService: SnackBarService,
     private PostsService: PostsService,
     private UsersService: UsersService,
     private LikesService: LikesService,
     private CommentsService: CommentsService,
     private router: Router,
  ) { }
  
  ngOnInit(): void {
    //recup token
    // this.decodedToken = this.tokenService.getDecodedToken();  
    // this.userId = this.decodedToken.userId;
    // this.decodedToken.userRole > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

    // on vérifie si on n'a pas déjà les données avant d'aller les chercher
    if (this.UsersService.myUser.id !=0) {
      this.userId = this.UsersService.myUser.id,
      this.UsersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
      if (this.UsersService.myUser.avatarUrl) {
        this.avatarUrl = this.UsersService.myUser.avatarUrl
      }
      this.isLoading = false;
      this.getAllPostsByPage();

    } else { 
      this.UsersService.getMyUser()
        .subscribe ( {
          next : (data) => {
            console.log('données getMyUser reçues : ', data);
            this.userId = data.id
            data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
            if (data.avatarUrl) {
              this.avatarUrl = data.avatarUrl;
            } 
            this.isLoading = false;
            this.getAllPostsByPage();
            }
          ,
          error: (err) => {
            console.log('données getMyUser  ko : ', err);
            this.router.navigateByUrl('/auth/login')
          },
        }) 
      }

    // console.log ('this.token.userId: ', this.token.userId, ' - this.userIsAdmin: ', this.userIsAdmin, ' this.token.role', this.token.userRole )
    //recup image avatar
    // ICIJCO get user actif à faire
    // this.UsersService.getOneUser(this.userId)
    //   .subscribe ( {
    //     next : (data) => {
    //       console.log('données getOneUser reçues : ', data)
    //       if (data.avatarUrl) {
    //         this.avatarUrl = data.avatarUrl;
    //       }
    //     },
    //     error: (err) => {
    //       console.log('données getOneUser  ko : ', err);
    //     },
    //   }) 
    
    // création blok posts-list
    // this.monavatarUrl$ = 123
    // const url1$ = new Observable(observer => {

    //   observer.next(this.defaultAvatarUrl+1);
    //   observer.next(this.defaultAvatarUrl+2);
    //   observer.next(this.defaultAvatarUrl+3);
    //   observer.complete();
  
    // });
    // url1$.subscribe({
    //   next: value => console.log(value),
    //   error: err => console.error(err),
    //   complete: () => console.log('DONE!')
    // });

    // // this.url2$ = this.makeObservableUrl2('Async Observable');
    // // this.asyncObservable = this.makeObservable('Async Observable');
    // this.asyncObservable = this.getAvatarUrl(this.userId);
   
    // this.url2$.subscribe({
    //   next: value => console.log(value),
    //   error: err => console.error(err),
    //   complete: () => console.log('DONE!')
    // });

    
  // makeObservableAvatarUrl(userId:number) :Observable<string> {
  //   let avatarUrl = this.defaultAvatarUrl;
  //   // on vérifie si on n'a pas déjà l'url pour l'utilisateur connecté
  //   if ((userId == this.userId) && this.avatarUrl) {
  //       return this.avatarUrl;
  //   }
  // } 

  // à virer
  // makeObservableUrl2(value: string): Observable<string> {
  //  return of(value).pipe(delay(2000));
  // };
  // makeObservable(value: string): Observable<string> {
  //   console.log('entrée dans makeObservable')
  //   return of(value).pipe(delay(3000));
  // }

  // getAvatarUrl(userId:number) : Observable<User> {
  //   let avatarUrl = this.defaultAvatarUrl;
  //   // on vérifie si on n'a pas déjà l'url pour l'utilisateur connecté
  //   // if ((userId == this.userId) && this.avatarUrl) {
  //   //     return this.avatarUrl;
  //   // }
  //   // return 
  //   console.log('--- un apel getAvatarURl pour userID ', userId )
  //   return this.UsersService.getOneUser(userId) 
  //   // this.UsersService.getOneUser(userId)
  //     .pipe(
  //       take(1),
  //       tap( data => console.log(' ------- et un resultat getOneuser')),
        
  //       )
  //     // .subscribe ( {
  //     //   next : (data) => {
  //     //     console.log('données getOneUser getAvatarUrl reçues : ', data)
  //     //     data.avatarUrl ?  avatarUrl = data.avatarUrl  :  avatarUrl = this.defaultAvatarUrl ;
  //     //     // if (userId == this.userId) 
  //     //     //     this.avatarUrl = avatarUrl;
  //     //     //  return avatarUrl;
  //     //     },         

  //     //   error: (err) => {
  //     //     console.log('données getOneUser  ko : ', err);
  //     //     //  return avatarUrl;
  //     //   },
  //     // })

  // } 
    
  }

  getAllPostsByPage(page?:number, limit?:number) :void {
    this.PostsService.getAllPosts(page,limit)
          .subscribe ( {
            next : (data) => {
              console.log('données getAllPosts reçues : ', data)
              const { posts, currentPage, totalPages, firstPage, lastPage, totalRows} = data;
              this.posts = posts;
              this.currentPage = currentPage;
              this.totalPages = totalPages;
              this.firstPage = firstPage;
              this.lastPage = lastPage ;
              this.totalRows = totalRows;

              for (let post of this.posts) {
                let nbLikes = 0;
                let likeId = 0;
                let isLiked = false;
                let nbComments = 0;
                let comments:Comment[] = [];
                let commentsShowed = false
                
                // on créé le tableau des données "post étendues" servant à l'affichage et on le mettra à jour après récupération des éventuels likes et commentaires
                let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                console.log('newPostExt : ', newPostExt)
                this.postsExt.push(newPostExt)
                // this.asyncObservable = this.getAvatarUrl(post.userId);
               // this.avatarUrl$ = this.getAvatarUrl(post.userId)
                this.LikesService.getAllLikesForOnePost(post.id)
                  .subscribe ( {
                    next : (data) => {
                      this.likes = data;
                      nbLikes = this.likes.length
                      let userLike =  this.likes.find(searchItem => (searchItem.userId == this.userId))
                      if (userLike) {
                        isLiked= true
                        likeId = userLike.id
                      }
                  
                      this.CommentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {
                            // icijco: reprise 24/11 
                            // comments = data;
                            // nbComments = comments.length
                            // let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            // console.log('newPostExt ok ok : ', newPostExt)
                            // this.postsExt.push(newPostExt)
                            let searchedPostExt =  this.postsExt.find(searchItem => (searchItem.id == post.id));
                            if (searchedPostExt) {
                              searchedPostExt.nbLikes = nbLikes;
                              searchedPostExt.isLiked = isLiked;
                              searchedPostExt.likeId = likeId
                              searchedPostExt.comments = data;
                              searchedPostExt.nbComments = searchedPostExt.comments.length;
                            }

                          },
                          error: (err) => {
                            // icijco: reprise 24/11 
                            // let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            // this.postsExt.push(newPostExt)
                            // console.log('newPostExt ok ko : ', newPostExt)
                            let searchedPostExt =  this.postsExt.find(searchItem => (searchItem.id == post.id));
                            if (searchedPostExt) {
                              searchedPostExt.nbLikes = nbLikes;
                              searchedPostExt.isLiked = isLiked;
                              searchedPostExt.likeId = likeId
                            }  
                          },  
                        })

                    },
                    error: (err) => {
                      this.CommentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {
                            // icijco: reprise 24/11
                            // comments = data;
                            // nbComments = comments.length
                            // let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            // console.log('newPostExt ko ok : ', newPostExt)
                            // this.postsExt.push(newPostExt)
                            let searchedPostExt =  this.postsExt.find(searchItem => (searchItem.id == post.id));
                            if (searchedPostExt) {
                              searchedPostExt.comments = data;
                              searchedPostExt.nbComments = searchedPostExt.comments.length;
                            }
                          },
                          error: (err) => {
                            // icijco: reprise 24/11
                            // let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            // console.log('newPostExt ko ko : ', newPostExt)
                            // this.postsExt.push(newPostExt)
                            console.log('pas de like ni de commentaire pour post: ', post)
                          },
                        })
                    },
                    // complete: () => {
                  })  
              }
            },
            error: (err) => {
              console.log('données getAllPosts  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'récupération des posts échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
           // complete: () => console.info('complete')
          })    
  }

  managePageEvent(event:PageEvent) :void {
    console.log('page event :', event);
    this.postsExt = [];
    const page = event.pageIndex + 1
    const limit = event.pageSize
    this.getAllPostsByPage(page, limit );
  }

};

