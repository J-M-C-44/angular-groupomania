import { Component, OnInit } from '@angular/core';
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
import { trigger, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],

  // animation gérant - l'apparition progressive par la gauche des posts (:enter),
  //                  - la disparition progressive par la droite d'un post (:leave)
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

/**
 * 2 parties :
 * création d'un post (en haut de page), via le composant enfant post-form (cf template)
 * gestion de la liste des posts : 
 *   - recherche l'ensemble des posts (par page) côté API (via le service posts):
 *   - recherche ensuite les likes et commentaires associés
 *   - créé un tableau de post enrichis des infos likes et commentaires (postsExt) qui sera la référence de données pour l'affichage
 *   - affiche "unitairement" chacun des posts via le composant enfant post ( cf template)
 */
export class PostsListComponent implements OnInit {
  // userid de l'utilisateur actuel
  userId = 0;
  userIsAdmin = false;
  posts:Post[] =[];
  postsExt:PostExtended[] =[];
  likes:Like[]=[]
  currentPage = 0;
  totalPages = 0;
  firstPage = true;
  lastPage = true;
  totalRows = 0;
  isLoading = true;


  constructor(
     private snackBarService: SnackBarService,
     private postsService: PostsService,
     private usersService: UsersService,
     private likesService: LikesService,
     private commentsService: CommentsService,
     private router: Router,
  ) { }
  
  ngOnInit(): void {

    // les données du user actuel sont nécessaires pour l'affichage/utilisation de certaines fonctions.
    // on utilise des données du user actuel si on les a déjà ( elles sont stockées temporairement dans le service user)
    if (this.usersService.myUser.id !=0) {
      this.userId = this.usersService.myUser.id,
      this.usersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
      this.isLoading = false;
       // puis on récupère une page de posts sur l'api
      this.getAllPostsByPage();
    
    //si on n'a pas les données du  user actuel, on les récupère sur l'api (via service user)
    } else { 
      this.usersService.getMyUser()
        .subscribe ( {
          next : (data) => {
            console.log('données getMyUser reçues : ', data);
            this.userId = data.id
            data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
            this.isLoading = false;
            // puis on récupère une page de posts sur l'API
            this.getAllPostsByPage();
            }
          ,
          error: (err) => {
            console.log('données getMyUser  ko : ', err);
            // si on entrouve pas le sinfos du user actuel, ce n'est pas normal. on redirige alors vers la page login
            this.router.navigateByUrl('/auth/login')
          },
        }) 
      }
  }
/**

/**
 * récupère l'ensemble des posts d'une page
 * recherche ensuite les likes et commentaires associés
 * créé un tableau de post enrichis des infos likes et commentaires ( = postsExt) qui sera la référence de données pour l'affichage
 * @param page :  numéro de la page 
 * @param limit : nombre de posts par page 
 */
  getAllPostsByPage(page?:number, limit?:number) :void {

    // récupération d'unepage de posts
    this.postsService.getAllPosts(page,limit)
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
                this.postsExt.push(newPostExt)

                // on récupère les likes associés au post et on regarde si le user actuel l'a déjà liké
                this.likesService.getAllLikesForOnePost(post.id)
                  .subscribe ( {
                    next : (data) => {
                      this.likes = data;
                      nbLikes = this.likes.length
                      let userLike =  this.likes.find(searchItem => (searchItem.userId == this.userId))
                      if (userLike) {
                        isLiked= true
                        likeId = userLike.id
                      }
                      // on récupère ensuite également les commentaires associés au post
                      this.commentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {
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
                      this.commentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {
                            let searchedPostExt =  this.postsExt.find(searchItem => (searchItem.id == post.id));
                            if (searchedPostExt) {
                              searchedPostExt.comments = data;
                              searchedPostExt.nbComments = searchedPostExt.comments.length;
                            }
                          },
                          error: (err) => {
                            // console.log('pas de like ni de commentaire pour post: ', post)
                          },
                        })
                    },
                  })  
              }
            },
            error: (err) => {
              console.log('données getAllPosts  ko : ', err);
              let errorMsgSubmit = 'récupération des posts échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })    
  }

/** gère la modification de la pagination et le rechargement de la page
 *  le tableau postsExt est vidé et on le remplit à nouveau avec les nouveaux paramètres
 * @param event 
 */ 
  managePageEvent(event:PageEvent) :void {
    console.log('page event :', event);
    this.postsExt = [];
    const page = event.pageIndex + 1
    const limit = event.pageSize
    this.getAllPostsByPage(page, limit );
  }

};

