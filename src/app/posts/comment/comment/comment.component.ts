// <--------------  gestion  de l'affichage unitaire des données d'un commentaire  -  appelé via template par post.component      ------------->

import { Component, OnInit} from '@angular/core';
import { Input } from '@angular/core';
import { Comment } from '../../../shared/models/comment.model';
import { CommentsService } from '../../shared/services/comments.service';
import { UsersService } from '../../../shared/services/users.service';
import { PostExtended } from '../../../shared/models/post.model';
import {MatDialog} from '@angular/material/dialog'
import {CommentEditDialogComponent} from '../comment-edit-dialog/comment-edit-dialog.component';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';;
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})

/**
 * affichage unitaire des données d'un commentaire
 * gestion de l'appel à la fenetre dialogue pour edition/suppression du commentaire
 */
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() postExt!: PostExtended
  @Input() isCommentEditable!: boolean
  defaultAvatarUrl ='../../../assets/logo-avatar.jpg'
  avatarUrl ='';
  fullName ='';

  constructor(
    private UsersService: UsersService,
    private CommentsService: CommentsService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // recherche des infos du user ayant fait le commentaire dans le cache.
    let userFoundinCache =  this.UsersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.comment.userId))
    if (userFoundinCache) {
      this.avatarUrl = userFoundinCache.avatarUrl;
      this.fullName = userFoundinCache.fullName;
      // si non trouvé, on passe par un appel api.
    } else {
      this.UsersService.getOneUser(this.comment.userId)
        .subscribe ( {
          next : (data) => {
            this.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;

            if (data.lastname && data.firstname)
              this.fullName = (data.firstname + ' '+ data.lastname);
            else if (data.lastname)
              this.fullName = data.lastname;
            else if(data.firstname)
              this.fullName = data.firstname;
            else 
              this.fullName = ('utilisateur n° ' + this.comment.userId);
          },

          error: (err) => {
            console.log('données getOneUser  ko : ', err);
            this.avatarUrl = this.defaultAvatarUrl;
            this.fullName = ('utilisateur n° ' + this.comment.userId);
          },
        })
      } 
  }

/**
 * ouvre la boite de dialogue permettant d'éditer les données du commentaire 
 */
  openDialogEdit() : void {

    const dialogRef = this.dialog.open(CommentEditDialogComponent, {
        width:'95%',
        maxWidth:'800px',
        data: {
          comment: this.comment,
          postExt: this.postExt,
        },
    });
  }

/** gestion la demande de suppression de commentaire (accessible pour l'admin et le propriétaire du commentaire): 
 *     - ouvre la fenetre de dialogue demandant la confirmation de suppression du commentaire
 *     - si confirmée: suppression du commentaire en bdd appel API via comments service et mise à jour des données servant à l'affichage.
 */
  openDialogDelete() : void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        type: 'comment',
      },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        this.CommentsService.deleteComment(this.comment.id)
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('commentaire supprimé',''); 
              this.postExt.nbComments! --
              // on supprime également le commentaire de postExt (pour l'affichage)
              this.postExt.comments = this.postExt.comments!.filter(c => c.id !== this.comment.id)
            },
            error: (err) => {
              console.log('suppression commentaire  ko : ', err);
              let errorMsgSubmit = 'suppression commentaire échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
      }
    });
  }
}
