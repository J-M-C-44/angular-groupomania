import { Component, OnInit } from '@angular/core';
import { DecodedToken, TokenService } from 'src/app/core/services/token.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../../shared/models/post.model';
import { PostExtended } from '../../shared/models/post.model';
import { LikesService } from '../shared/services/likes.service';
import { Like } from '../../shared/models/like.model';
import { CommentsService } from '../shared/services/comments.service';
import { Comment } from '../../shared/models/comment.model';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
// à voir si je garde....
import { take, delay, tap  } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; 


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {

  userId = 0;
  userIsAdmin = false;
  defaultAvatarUrl ='../../../assets/logo-avatar.jpg'
  avatarUrl ='';
  monavatarUrl$ = Observable<User>;
  url2$ = Observable<string>;
  asyncObservable!: Observable<User>;
  token = new DecodedToken ;
  //AvatarUrl=
  fullName = 'Vous';
  newPostForm = new FormGroup({
    //icicjco : reprendre controle back-end
    textPost : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
    imagePost: new FormControl <File | null> (null)
  })
  newCommentForm = new FormGroup({
    //icicjco : reprendre controle back-end
    textComment : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
    imageComment: new FormControl <File | null> (null)
  })
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
  // nbLikes = 0;
  // nbComments =0;

  constructor(
     private tokenService: TokenService,
     private snackBarService: SnackBarService,
     private PostsService: PostsService,
     private UsersService: UsersService,
     private LikesService: LikesService,
     private CommentsService: CommentsService,
  ) { }
  
  ngOnInit(): void {
    //recup token
    this.token = this.tokenService.getDecodedToken();
    this.userId = this.token.userId;
    this.token.userRole > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
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

    this.PostsService.getAllPosts()
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

              // ICIJCO : attention pb de tri au final ! données backend bien triées mais ordre postExts résultant différent
              for (let post of this.posts) {
                // [postExt.nbLikes, this.postExt.isliked] = this.nbLikes(post.id)
                // let [nbLikes, isLiked] = this.nbLikes(post.id)
                let nbLikes = 0;
                let likeId = 0;
                let isLiked = false;
                let nbComments = 0;
                let comments:Comment[] = [];
                let commentsShowed = false
                
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
                      // this.likes.find(searchItem => (searchItem.userId == this.userId)) ? isLiked= true : isLiked = false;
                      
                      this.CommentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {
                            comments = data;
                            nbComments = comments.length
                            let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            console.log('newPostExt ok ok : ', newPostExt)
                            this.postsExt.push(newPostExt)
                          },
                          error: (err) => {
                            let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            console.log('newPostExt ok ko : ', newPostExt)
                            this.postsExt.push(newPostExt)
                          },
                        })

                    },
                    error: (err) => {
                      this.CommentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {
                            comments = data;
                            nbComments = comments.length
                            let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            console.log('newPostExt ko ok : ', newPostExt)
                            this.postsExt.push(newPostExt)
                          },
                          error: (err) => {
                            let newPostExt = {...post, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
                            console.log('newPostExt ko ko : ', newPostExt)
                            this.postsExt.push(newPostExt)
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

    // console.log('avant postext2')
    // for (let post of this.posts) {
    //   // [postExt.nbLikes, this.postExt.isliked] = this.nbLikes(post.id)
    //   let [nbLikes, isliked] = this.nbLikes(post.id)
    //   let newPostExt = {...post, nbLikes, isliked}
    //   this.postsExt.push(newPostExt)
    // }
          
  }

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

  getAvatarUrl(userId:number) : Observable<User> {
    let avatarUrl = this.defaultAvatarUrl;
    // on vérifie si on n'a pas déjà l'url pour l'utilisateur connecté
    // if ((userId == this.userId) && this.avatarUrl) {
    //     return this.avatarUrl;
    // }
    // return 
    console.log('--- un apel getAvatarURl pour userID ', userId )
    return this.UsersService.getOneUser(userId) 
    // this.UsersService.getOneUser(userId)
      .pipe(
        take(1),
        tap( data => console.log(' ------- et un resultat getOneuser')),
        
        )
      // .subscribe ( {
      //   next : (data) => {
      //     console.log('données getOneUser getAvatarUrl reçues : ', data)
      //     data.avatarUrl ?  avatarUrl = data.avatarUrl  :  avatarUrl = this.defaultAvatarUrl ;
      //     // if (userId == this.userId) 
      //     //     this.avatarUrl = avatarUrl;
      //     //  return avatarUrl;
      //     },         

      //   error: (err) => {
      //     console.log('données getOneUser  ko : ', err);
      //     //  return avatarUrl;
      //   },
      // })

  } 

  onImageAdded(event:any) {
    this.imageFile = event.target.files[0];
    console.log('this.imageFile : ', this.imageFile);
    console.log('this.newPostForm.value : ', this.newPostForm.value);
    this.newPostForm.get('imagePost')!.setValue(this.imageFile);
    console.log('this.newPostForm.value : ', this.newPostForm.value);
    // this.newPostForm.updateValueAndValidity();
    //icicjco: ajouter test sur la taille max
    if (this.imageFile) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.imagePreview = fileReader.result as string;
      };
      fileReader.readAsDataURL(this.imageFile)
      console.log('this.imageFile : ', this.imageFile);
      this.fileName = this.imageFile.name;
    }
  }
  onResetForm() {
    //icijco : à revoir car pb de non suppression image après soumission puis bouton reset ou erreur champs texte vide....
    // mettre untouch pour essayer
    this.newPostForm.reset();
    this.newPostForm.controls.textPost.setErrors(null)
    this.newPostForm.updateValueAndValidity()
    this.fileName ='';
    this.imagePreview = '';
    // this.imageFile 
    // this.newPostForm = new FormGroup({
    //   //icicjco : reprendre controle back-end
    //   textPost : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
    //   imagePost: new FormControl <File | null> (null)
    // })
  }
  getErrorMessageTextPost() {

    if (this.newPostForm.controls.textPost.hasError('required'))
        return 'texte obligatoire';
    return this.newPostForm.controls.textPost.invalid ? 'format de texte invalide ' : ''
  }

  onNewPostSubmit() {
    
    if (this.newPostForm.valid) {
      
      let {textPost, imagePost} = this.newPostForm.value;
      if (!textPost || textPost.trim().length <3 ) {
        this.newPostForm.controls.textPost.setErrors(Validators.required)
        this.newPostForm.updateValueAndValidity()
        return
      }
      textPost = textPost!.trim();
      // let textPost = this.newPostForm.get('textPost')!.value!.trim();
      console.log('création de post demandée - textPost: ',textPost!, 'imagePost : ', imagePost! )
      this.PostsService.createPost(textPost!,imagePost!)
      // this.PostsService.createPost(textPost!,this.imageFile)
          .subscribe ( {
            next : (data) => {
              // console.log('données createPost reçues : ', data)
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetForm()        
              // ICIJCO : ajouter le nouveau post à la liste des posts : 
              // ajouter createdTIme et modifiedTime au back-end et swagger !
              let createdTime = '2022-10-21T08:34:15.000Z'; 
              let modifiedTime = '2022-10-21T08:34:15.000Z'; 
              let nbLikes = 0;
              let likeId = 0;
              let isLiked = false;
              let nbComments = 0;
              let comments:Comment[] = [];
              let commentsShowed = false
              let newPostExt = {...data!, createdTime, modifiedTime, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
              this.postsExt.unshift(newPostExt);

            },
            error: (err) => {
              console.log('données createPost  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }

  onCommentImageAdded(event:any) {
    this.commentImageFile = event.target.files[0];
    console.log('this.commentImageFile : ', this.commentImageFile);
    console.log('this.newCommentForm.value : ', this.newCommentForm.value);
    this.newCommentForm.get('imageComment')!.setValue(this.commentImageFile);
    console.log('this.newCommentForm.value : ', this.newCommentForm.value);
    // this.newPostForm.updateValueAndValidity();
    //icicjco: ajouter test sur la taille max
    if (this.commentImageFile) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.commentImagePreview = fileReader.result as string;
      };
      fileReader.readAsDataURL(this.commentImageFile)
      console.log('this.commentImageFile : ', this.commentImageFile);
      this.commentFileName = this.commentImageFile.name;
    }
  }
  onResetCommentForm() {
    this.newCommentForm.reset();
    this.newCommentForm.controls.textComment.setErrors(null)
    this.newCommentForm.updateValueAndValidity()
    this.commentFileName ='';
    this.commentImagePreview = '';
  }
  
  getErrorMessageTextComment() {

    if (this.newCommentForm.controls.textComment.hasError('required'))
        return 'texte obligatoire';
    return this.newCommentForm.controls.textComment.invalid ? 'format de texte invalide ' : ''
  }

  onNewCommentSubmit(postExt:PostExtended) {
    
    if (this.newCommentForm.valid) {
      
      let {textComment, imageComment} = this.newCommentForm.value;
      if (!textComment || textComment.trim().length <3 ) {
        this.newCommentForm.controls.textComment.setErrors(Validators.required)
        this.newCommentForm.updateValueAndValidity()
        return
      }
      textComment = textComment!.trim();
      console.log('création de comment demandée - textComment: ',textComment!, 'imageComment : ', imageComment! )
      this.CommentsService.addComment(postExt.id,textComment!,imageComment!)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetCommentForm()        
              // ICIJCO : ajouter le nouveau commentaire à la liste des commentaires
              let newComment = {...data}
              postExt.nbComments! ++||1
              postExt.comments!.push(newComment)
            },
            error: (err) => {
              console.log('données createComment  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }

  likePost(postExt:PostExtended) {
    // console.log('like : postExt.id = ', postExt.id, 'isLiked :', postExt.isLiked, 'nb likes: ', postExt.nbLikes, ' likeId: ',  postExt.likeId)
    if (postExt.isLiked) {
      this.LikesService.unlikePost(postExt.likeId!)
      .subscribe ( {
        next : (data) => {
          postExt.nbLikes!-- ;
          postExt.isLiked! = false;
          postExt.likeId = 0;
        },
        error: (err) => {
          if (err == "non trouvé") {
            postExt.nbLikes!-- ;
            postExt.isLiked! = false;
            postExt.likeId = 0;
          }
          else { 
            console.log('delete like ko : ', err);
          } 
        },
      })
    } else {
        this.LikesService.likePost(postExt.id)
        .subscribe ( {
          next : (data) => {
            postExt.nbLikes!++ ;
            postExt.isLiked! = true;
            postExt.likeId = data.id;
          },
          error: (err) => {
            console.log('like post  ko : ', err);
          },
        })
    }
    
  }   
  showComments(postExt:PostExtended) {
    console.log('showComments: postID = ', postExt.id)
    postExt.commentsShowed= !postExt.commentsShowed
    console.log('showComments: postExt = ', postExt)
    console.log('showComments: postExt.comments = ', postExt.comments)
  }

  // nbLikes(postId:number) :number  {
  // nbLikes(postId:number): any  {
  
  
  // icijco : à virer....
  nbLikes(postId:number): [number, boolean]  {
    let nbLikes = 0
    let isLiked = false

    //   // ICIJCO à revoir / gestion des erreurs
    // try {
      this.LikesService.getAllLikesForOnePost(postId)
            .subscribe ( {
              next : (data) => {
                console.log('données getAllLikesForOnePost reçues : ', data)
                this.likes = data;
                nbLikes = this.likes.length
                this.likes.find(searchItem => (searchItem.userId == this.userId)) ? isLiked= true : isLiked = false;
                return [nbLikes, isLiked]
              },
              error: (err) => {
                console.log('données getAllLikesForOnePost  ko : ', err);
                console.log('nbLikes : ', nbLikes, 'isLiked: ', isLiked);
                return [nbLikes, isLiked]
              },
              // complete: () => {
              //   console.log('complete');
              //   // return [nbLikes, isLiked]
              // }
            }) 
            // console.log('postId : ', postId, 'nbLikes : ', nbLikes, 'isLiked: ', isLiked);
             return [nbLikes, isLiked]    
      // } catch {
      //   console.log('catch');
      //   return [nbLikes, isLiked];
      // } 

    // console.log( '+1 appel nb likes')
    // return 1 ;
  };

  // icijco : à virer....
  nbComments(postID:number) :number {
    console.log( '+1 appel nb comments')
    return 2;
  }
};

