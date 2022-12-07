import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { PostExtended } from '../../shared/models/post.model';
import { PostsService } from '../shared/services/posts.service';
import { LikesService } from '../shared/services/likes.service';
import { UsersService } from '../../shared/services/users.service';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [
    // anim1 : - apparition progressive par le bas des commentaires (:enter),
    //         - l'inverse pour le masquage des commenatires (:leave)
    trigger('anim1', [
      transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateY(+100%)',
        }),
        animate('400ms ease-out',
                style({ 
                      opacity: 1,
                      transform: 'translateY(0)'
                })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
        animate('250ms ease-in',
                style({ 
                      opacity: 0,
                      transform: 'translateY(+100%)',
                      
                })
        ),
      ]),
    ]),
    // anim2 : - apparition progressive par la gauche du nouveau commentaire dans la liste lors de sa création  (:enter),
    //         - disparition progressive du commentaires par la droite lors de sa suppression (:leave)
    trigger('anim2', [
      transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateX(-100%)',
        }),
        animate('400ms ease-out',
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
        animate('250ms ease-in',
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
 * affichage unitaire des données d'un post
 * gestion de l'appel à la fenetre dialogue pour edition/suppression du post
 * gestion de l'ajout de like
 * affichage/masquage de la partie commentaires :
 *    - afficher les commentaires existants (via app-comment, cf template)
 *    - affichier le formulaire de création de commentaire (via app-comment-form, cf template)
 */
export class PostComponent implements OnInit {

  // données en provenance du composant parent posts-list et qui seront également mises à jour pour certaines
  @Input() postsExt!: PostExtended[]
  @Input() postExt!: PostExtended
  @Input() userIsAdmin! : boolean
  @Input() userId! : number

  defaultAvatarUrl ='../../../assets/logo-avatar.jpg'
  avatarUrl ='';

  constructor(
    private snackBarService: SnackBarService,
    private PostsService: PostsService,
    private LikesService: LikesService,
    private UsersService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

/**
 * ouvre la boite de dialogue permettant d'éditer les données du post 
 */
  openDialogEdit() : void {
    const dialogRef = this.dialog.open(PostEditDialogComponent, {
        width:'95%',
        maxWidth:'800px',
        data: {
          postExt: this.postExt,
          postsExt: this.postsExt,
        },
    });
  }

/** gestion la demande de suppression de post (accessible pour l'admin et le propriétaire du post): 
 *     - ouvre la fenetre de dialogue demandant la confirmation de suppression du post
 *     - si confirmée: suppression du post en bdd appel API via posts service
 */
  openDialogDelete() : void {
     console.log('openDialogDelete')
     const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        type: 'post',
      },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        this.PostsService.deletePost(this.postExt.id)
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('post supprimé',''); 
              // la suppression par filter ne déclenchant pas la détection de changement angular, on passe donc par splice
              // this.postsExt = this.postsExt.filter(p => p.id !== this.postExt.id);
              const index: number = this.postsExt.indexOf(this.postExt);
              if (index !== -1) {
                this.postsExt.splice(index, 1);
              }
            },
            error: (err) => {
              console.log('suppression post  ko : ', err);
              let errorMsgSubmit = 'suppression post échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
      };
    });
  }

  /**
   * supprime un like sur le post si l'utilisateur actuel en avait déjà un, sinon l'ajoute
   * @param postExt : post en cours de like/unlike
   */
  likePost(postExt:PostExtended) :void {
  
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
/**affiche/masque la partie commentaires contenant:
 *    - les commentaires existants (via app-comment, cf template)
 *    - le formulaire de création de commentaire (via app-comment-form, cf template)
 * @param postExt 
*/   
  showComments(postExt:PostExtended) {
    let userFoundinCache =  this.UsersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.userId))
    this.avatarUrl = userFoundinCache?.avatarUrl ? userFoundinCache.avatarUrl : this.defaultAvatarUrl ;

    postExt.commentsShowed= !postExt.commentsShowed


  }


}
