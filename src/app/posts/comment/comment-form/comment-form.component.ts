import { Component, OnInit, Input, Output, EventEmitter, Inject, Optional  } from '@angular/core';
import { PostExtended } from '../../../shared/models/post.model';
import { CommentsService } from '../../shared/services/comments.service';
import { Comment } from '../../../shared/models/comment.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommentEditDialogComponent } from '../comment-edit-dialog/comment-edit-dialog.component';
import { CommentComponent } from '../comment/comment.component';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Input() postExt!: PostExtended
  @Input() comment?: Comment
  commentFileName = '';
  commentImageFile!: File;
  commentImagePreview = ''

  
  newCommentForm!: FormGroup;/* = new FormGroup({
    //icicjco : reprendre controle back-end
    textComment : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
    imageComment: new FormControl <File | null> (null)
    // imageComment: new FormControl < ('http://localhost:3000/images/post/1668590693422-9478ad093e794d8db2dd8c5b62e55249.png')
    
  })*/

  constructor(
    private CommentsService: CommentsService,
    private snackBarService: SnackBarService,
    @Optional() public dialogRef: MatDialogRef<CommentEditDialogComponent>,
  ) { }

  ngOnInit(): void {
    if (this.comment) {
      this.commentImagePreview = this.comment.imageUrl ? this.comment.imageUrl : '' 
    } 

    this.newCommentForm = new FormGroup({
      textComment : new FormControl(this.comment?.text, [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
      imageComment: new FormControl <File | string | null> (null)
    });

  }
  // ICIJCO : à voir à froid: ajout sucre syntaxique
  // get form(): {[key: string]: AbstractControl<unknown, unknown>} {
  //   return this.newCommentForm.controls;
  // }
  
  onCommentImageAdded(event:any) : void {
    this.commentImageFile = event.target.files[0];
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
      this.commentFileName = this.commentImageFile.name;
    }
  }
  onCommentImageDeleted(): void {
    this.newCommentForm.get('imageComment')!.setValue('toDelete');
    console.log('this.newCommentForm.value  image deleted: ', this.newCommentForm.value);
    this.commentFileName = '';
    this.commentImagePreview =''
    }
  
  onResetCommentForm() : void {
    this.newCommentForm.reset();
    this.newCommentForm.controls.textComment.setErrors(null)
    this.newCommentForm.updateValueAndValidity()
    this.commentFileName ='';
    // icicJCO : à revoir si je laisse ?? ou si ? -- : --
    this.commentImagePreview = this.comment?.imageUrl ?? '';
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
      console.log('création de comment demandée - textComment: ',textComment, 'imageComment : ', imageComment )
      this.CommentsService.addComment(postExt.id, textComment, imageComment)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetCommentForm()        
              // ICIJCO : ajouter le created et modified time dans la réponse back-end lors de la création commentaire
              let createdTime = formatDate(new Date(), 'yyyy-MM-ddThh:mm:ss', 'en-US')
              let modifiedTime = createdTime;
              let newComment = {...data, createdTime, modifiedTime }
              postExt.nbComments! ++||1
              postExt.comments!.push(newComment)
            },
            error: (err) => {
              console.log('données createComment  ko : ', err);
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }

  onEditedCommentSubmit(postExt:PostExtended) {
    console.log ('on edit comment!')
    if (this.newCommentForm.valid) {
      
      let {textComment, imageComment} = this.newCommentForm.value;
      if (!textComment || textComment.trim().length <3 ) {
        this.newCommentForm.controls.textComment.setErrors(Validators.required)
        this.newCommentForm.updateValueAndValidity()
        return
      }
      textComment = textComment!.trim();
      console.log('modification de comment demandée - textComment: ',textComment, 'imageComment : ', imageComment )
      this.CommentsService.updateComment(this.comment!.id, textComment, imageComment)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetCommentForm()   
              // on met à jour comment pour l'affichagee
              this.comment!.text = textComment
              if (imageComment) { 
                if  (imageComment == 'toDelete') {
                  this.comment!.imageUrl = null;
                } else {
                  this.comment!.imageUrl = data.imageUrl
                }
              }
               this.dialogRef.close()
              //CommentEditDialogComponent.close();
              
            },
            error: (err) => {
              console.log('données updateComment  ko : ', err);
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }
}
