import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { PostExtended } from '../../shared/models/post.model';
import { PostsService } from '../shared/services/posts.service';
import { LikesService } from '../shared/services/likes.service';
import { UsersService } from '../../shared/services/users.service';
import { Like } from '../../shared/models/like.model';
import { Post } from '../../shared/models/post.model';
import {PostEditDialogComponent} from '../post-edit-dialog/post-edit-dialog.component';
import {DeleteDialogComponent} from '../../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [
    trigger('anim', [
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
    trigger('anim2', [
      transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateX(+100%)',
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
export class PostComponent implements OnInit {
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

  openDialogEdit() : void {
    console.log('openDialogEdit')
    const dialogRef = this.dialog.open(PostEditDialogComponent, {
        width:'95%',
        maxWidth:'800px',
        data: {
          postExt: this.postExt,
          postsExt: this.postsExt,
        },
    });
  }

  openDialogDelete() : void {
     console.log('openDialogDelete')
     const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        type: 'post',
      },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        console.log(`deleteIsConfirmed : ${deleteIsConfirmed}`) ;
        this.PostsService.deletePost(this.postExt.id)
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('post supprimé',''); 
              // la suppression par filter ne déclenchant pas la détection de changement angular, on passe par splice
              // this.postsExt = this.postsExt.filter(p => p.id !== this.postExt.id);
              const index: number = this.postsExt.indexOf(this.postExt);
              if (index !== -1) {
                this.postsExt.splice(index, 1);
              }
              console.log('this.postsExt :', this.postsExt);
            },
            error: (err) => {
              console.log('suppression post  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'suppression post échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
      };
    });
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
    let userFoundinCache =  this.UsersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.userId))
    this.avatarUrl = userFoundinCache?.avatarUrl ? userFoundinCache.avatarUrl : this.defaultAvatarUrl ;

    postExt.commentsShowed= !postExt.commentsShowed
    // console.log('showComments: postExt = ', postExt)
    // console.log('showComments: postExt.comments = ', postExt.comments)

  }


}
