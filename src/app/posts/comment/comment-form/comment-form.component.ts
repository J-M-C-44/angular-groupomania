// <--------------------         création / modification d'un commentaire                   ------------------>
// <--------------------            1) création : via appel par  post.component             ------------------>
// <--------------------            2) modification : via appel par comment-edit-dialog     ------------------>

import { Component, OnInit, Input, Output, EventEmitter, Inject, Optional  } from '@angular/core';
import { PostExtended } from '../../../shared/models/post.model';
import { CommentsService } from '../../shared/services/comments.service';
import { Comment } from '../../../shared/models/comment.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommentEditDialogComponent } from '../comment-edit-dialog/comment-edit-dialog.component';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})

/**
 * gestion de la création d'un commentaire
 * gestion de la modification d'un commentaire
 */
export class CommentFormComponent implements OnInit {

  // données en provenance du composant parent post.component / comment-edit-dialog, et qui seront également mises à jour
  @Input() postExt!: PostExtended
  @Input() comment?: Comment

  commentFileName = '';
  commentImageFile!: File;
  commentImagePreview = ''
  newCommentForm!: FormGroup;

  constructor(
    private commentsService: CommentsService,
    private snackBarService: SnackBarService,
    @Optional() public dialogRef: MatDialogRef<CommentEditDialogComponent>,
  ) { }

  ngOnInit(): void {
    if (this.comment) {
      this.commentImagePreview = this.comment.imageUrl ? this.comment.imageUrl : '' 
    } 
    // initialisation du formulaire avec les éventuelles données déjà présentes
    this.newCommentForm = new FormGroup({
      textComment : new FormControl(this.comment?.text, [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
      imageComment: new FormControl <File | string | null> (null)
    });

  }
  /**
 * gère la récupération du fichier uploadé qui sera ensuite:
 *    - intègré au formulaire 
 *    - pré-affiché
 */
  onCommentImageAdded(event:any) : void {
    this.commentImageFile = event.target.files[0];
    this.newCommentForm.get('imageComment')!.setValue(this.commentImageFile);

    if (this.commentImageFile) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.commentImagePreview = fileReader.result as string;
      };
      fileReader.readAsDataURL(this.commentImageFile)
      this.commentFileName = this.commentImageFile.name;
    }
  }

/**
 * gère la demande de suppression de l'image actuelle du commentaire 
 *    - intègre la demande dans le formulaire 
 *    - met à jour le pré-affichage
 */
  onCommentImageDeleted(): void {
    this.newCommentForm.get('imageComment')!.setValue('toDelete');
    console.log('this.newCommentForm.value  image deleted: ', this.newCommentForm.value);
    this.commentFileName = '';
    this.commentImagePreview =''
    }
  
/**
 * réinitialise le formulaire 
 */
  onResetCommentForm() : void {
    this.newCommentForm.reset();
    this.newCommentForm.controls.textComment.setErrors(null)
    this.newCommentForm.updateValueAndValidity()
    this.commentFileName ='';
    // icicJCO : à revoir si je laisse ?? ou si ? -- : --
    this.commentImagePreview = this.comment?.imageUrl ?? '';
  }
 
/**
 * restitue l'eventuel message d'erreur sur la saisie du texte
 *  @return { string } message d'erreur
 */
  getErrorMessageTextComment() {

    if (this.newCommentForm.controls.textComment.hasError('required'))
        return 'texte obligatoire';
    return this.newCommentForm.controls.textComment.invalid ? 'format de texte invalide ' : ''
  }

/**
 * uniquement pour entrée directe via post.component :
 * gère la demande de création du commentaire avec les données validées du formulaire
 *    - appel API via service comments
 *    - met à jour les données pour l'affichage
 * @param postExt - post sur lequel on ajoute le commentaire
 */
  onNewCommentSubmit(postExt:PostExtended) {
    
    if (this.newCommentForm.valid) {
      
      let {textComment, imageComment} = this.newCommentForm.value;
      if (!textComment || textComment.trim().length <3 ) {
        this.newCommentForm.controls.textComment.setErrors(Validators.required)
        this.newCommentForm.updateValueAndValidity()
        return
      }
      textComment = textComment!.trim();
  
      this.commentsService.addComment(postExt.id, textComment, imageComment)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetCommentForm()        
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
          })
    }
  }

/**
 * uniquement pour entrée via comment-edit-dialog :
 * gère la demande de modification du post avec les données validées du formulaire:
 *    - appel API via service comments
 *    - met à jour les données pour l'affichage
 */
  onEditedCommentSubmit(postExt:PostExtended) {
   
    if (this.newCommentForm.valid) {
      
      let {textComment, imageComment} = this.newCommentForm.value;
      if (!textComment || textComment.trim().length <3 ) {
        this.newCommentForm.controls.textComment.setErrors(Validators.required)
        this.newCommentForm.updateValueAndValidity()
        return
      }
      textComment = textComment!.trim();
      this.commentsService.updateComment(this.comment!.id, textComment, imageComment)
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
              
            },
            error: (err) => {
              console.log('données updateComment  ko : ', err);
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
    }
  }
}
