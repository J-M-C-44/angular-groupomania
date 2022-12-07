//  <!-------------- !!!!!!!!   component en cours de développement : détails d'un user avec affichage de ses posts  !!!!!!  ---------->
//  <!-------------- !!!!!!!!   n'est pas appelé pour le moment (mais possible par saisie directe URL users/:id      !!!!!!  ---------->

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { User, UserExtended } from '../../shared/models/user.model';
import { TokenService } from 'src/app/core/services/token.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { Post } from '../../shared/models/post.model';
import { PostExtended } from '../../shared/models/post.model';
import { PostsService } from '../../posts/shared/services/posts.service';
import { LikesService } from '../../posts/shared/services/likes.service'
import { Like } from '../../shared/models/like.model';
import { CommentsService } from '../../posts/shared/services/comments.service';
import { Comment } from '../../shared/models/comment.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  // decodedToken= new DecodedToken ;
  myUserId = 0;
  detailedUser: UserExtended = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:'', fullName:''}
  userIsAdmin = false;
  //ICIJCO : à voir si utile au final
  defaultAvatarUrl ='/assets/logo-avatar.jpg'
  avatarUrl ='';
  fullName ='';
  posts:Post[] =[];
  userPostsExt:PostExtended[] =[];
  likes:Like[]=[]

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private postsService: PostsService,
    private likesService: LikesService,
    private commentsService: CommentsService,
    // private tokenService: TokenService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log('entrée dans user-detail')
    if (this.usersService.myUser.id !=0) {
      this.myUserId = this.usersService.myUser.id,
      this.usersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

    } else { 
        this.usersService.getMyUser()
          .subscribe ( {
            next : (data) => {
              console.log('données getMyUser reçues : ', data);
              this.myUserId = data.id
              data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
              if (data.avatarUrl) {
                this.avatarUrl = data.avatarUrl;
              } 
            }
            ,
            error: (err) => {
              console.log('données getMyUser  ko : ', err);
              this.router.navigateByUrl('/auth/login')
            },
          }) 
    }
      
    let stringId = this.route.snapshot.paramMap.get('id');

    this.detailedUser.id = (stringId == 'me') ? this.myUserId : +stringId! ;
    
    let userFoundinCache =  this.usersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.detailedUser.id))
    if (userFoundinCache) {
      this.detailedUser = userFoundinCache;
    } else {
      this.usersService.getOneUser(this.detailedUser.id)
        .subscribe ( {
          next : (data) => {
            console.log('données getOneUser reçues : ', data)  
            let fullName = this.usersService.formatFullName(data.id, data.lastname, data.firstname)  
            this.detailedUser = {...data, fullName}
            this.detailedUser.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;
          },

          error: (err) => {
            console.log('données getOneUser  ko : ', err);
            let errorMsgSubmit = 'recherche utilisateur échouée: ' + err
            this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko'); 
            this.router.navigateByUrl('/users')
          },
        }) 
    }
  }
/** gestion la demande de suppression de compte (accessible pour l'admin uniquement): 
 *     - ouvre la fenetre de dialogue demandant la confirmation de suppression du compte
 *     - si confirmée: suppression du compte en bdd appel API via user service
 */
  openDialogDelete() : void {
    console.log('openDialogDelete')
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     data: {
       type: 'user',
     },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        console.log(`deleteIsConfirmed : ${deleteIsConfirmed}`) ;
        this.usersService.deleteUser(this.detailedUser.id)
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('user supprimé',''); 
            },
            error: (err) => {
              console.log('suppression user  ko : ', err);
              let errorMsgSubmit = 'suppression utilisateur échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
      };
    });
  }

  
/** récupère tous les pots créés par le user sur l'API via service user aisni que tous les likes et commentaires associés 
 * @param { number } UserId - id du user pour lequel on cherche les posts
 */
  getAllPostsOfUser(userId:number) :void {
    this.postsService.getAllPostsForOneUser(userId)
          .subscribe ( {
            next : (data) => {
              console.log('données getAllPostsForOneUser reçues : ', data)
              //const { posts} = data;
              this.posts = data;
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
                this.userPostsExt.push(newPostExt)
                this.likesService.getAllLikesForOnePost(post.id)
                  .subscribe ( {
                    next : (data) => {
                      this.likes = data;
                      nbLikes = this.likes.length
                      let userLike =  this.likes.find(searchItem => (searchItem.userId == this.myUserId))
                      if (userLike) {
                        isLiked= true
                        likeId = userLike.id
                      }
                  
                      this.commentsService.getAllCommentsForOnePost(post.id)
                        .subscribe ({
                          next : (data) => {

                            let searchedPostExt =  this.userPostsExt.find(searchItem => (searchItem.id == post.id));
                            if (searchedPostExt) {
                              searchedPostExt.nbLikes = nbLikes;
                              searchedPostExt.isLiked = isLiked;
                              searchedPostExt.likeId = likeId
                              searchedPostExt.comments = data;
                              searchedPostExt.nbComments = searchedPostExt.comments.length;
                            }

                          },
                          error: (err) => {
                            let searchedPostExt =  this.userPostsExt.find(searchItem => (searchItem.id == post.id));
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
                            let searchedPostExt =  this.userPostsExt.find(searchItem => (searchItem.id == post.id));
                            if (searchedPostExt) {
                              searchedPostExt.comments = data;
                              searchedPostExt.nbComments = searchedPostExt.comments.length;
                            }
                          },
                          error: (err) => {

                            console.log('pas de like ni de commentaire pour post: ', post)
                          },
                        })
                    },
                  })  
              }
            },
            error: (err) => {
              console.log('données getAllPostsForOneUser  ko : ', err);
              let errorMsgSubmit = 'récupération des posts échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
           // complete: () => console.info('complete')
          })    
  }
}
