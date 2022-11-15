import { Component, OnInit, ɵisDefaultChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Comment } from '../../../shared/models/comment.model';
import { CommentsService } from '../../shared/services/comments.service';
import { User } from '../../../shared/models/user.model';
import { UsersService } from '../../../shared/services/users.service';
import { PostExtended } from '../../../shared/models/post.model';
import {MatDialog} from '@angular/material/dialog'
import {CommentDeleteDialogComponent} from '../comment-delete-dialog/comment-delete-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() postExt!: PostExtended
  @Input() isEditable!: boolean
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
    this.avatarUrl = this.defaultAvatarUrl
    this.fullName = ('utilisateur n° ' + this.comment.userId)

    this.UsersService.getOneUser(this.comment.userId)
      .subscribe ( {
        next : (data) => {
          console.log('données getOneUser reçues : ', data)
          if (data.avatarUrl)
            this.avatarUrl = data.avatarUrl;

          if (data.lastname && data.firstname)
            this.fullName = (data.firstname + ' '+ data.lastname)
          else if (data.lastname)
            this.fullName = data.lastname
          else if(data.firstname)
            this.fullName = data.firstname;
        },

        error: (err) => {
          console.log('données getOneUser  ko : ', err);
        },
      }) 
  }
  openDialogEdit() : void {
    console.log('openDialogEdit')
  }

  openDialogDelete() : void {
    console.log('openDialogDelete')
    const dialogRef = this.dialog.open(CommentDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        console.log(`deleteIsConfirmed : ${deleteIsConfirmed}`) ;
        this.CommentsService.deleteComment(this.comment.id)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('commentaire supprimé',''); 
              this.postExt.nbComments! --
              // filter postExt
              this.postExt.comments = this.postExt.comments!.filter(c => c.id !== this.comment.id)
            },
            error: (err) => {
              console.log('suppression commentaire  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'suppression commentaire échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
      }
    });
  }
}
