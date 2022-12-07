// <--------------------         création / modification d'un post                       ------------------>
// <--------------------            1) création : via appel par  posts-list              ------------------>
// <--------------------            2) modification : via appel par post-edit-dialog     ------------------>


import { Component, Input, OnInit, Optional } from '@angular/core';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../../shared/models/post.model';
import { PostExtended } from '../../shared/models/post.model';
import { Comment } from '../../shared/models/comment.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { MatDialogRef } from '@angular/material/dialog';

import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import {formatDate } from '@angular/common';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})

/**
 * gestion de la création d'un post
 * gestion de la modification d'un post
 */
export class PostFormComponent implements OnInit {
  @Input() postsExt!: PostExtended[]
  @Input() postExt!: PostExtended

  newPostForm!: FormGroup;
  fileName = '';
  imageFile!: File;
  imagePreview = '';

  constructor(
    private snackBarService: SnackBarService,
    private PostsService: PostsService,
    @Optional() public dialogRef: MatDialogRef<PostEditDialogComponent>,
  ) { }

  ngOnInit(): void {

    this.imagePreview = this.postExt?.imageUrl ? this.postExt.imageUrl : '' ;

    this.newPostForm = new FormGroup({
      textPost : new FormControl(this.postExt?.text, [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
      imagePost: new FormControl <File | string | null> (null)
    });
  }

/**
 * gère la récupération du fichier uploadé qui sera ensuite:
 *    - intègré au formulaire 
 *    - pré-affiché
 */
  onImageAdded(event:any) :void {
    this.imageFile = event.target.files[0];
    console.log('this.imageFile : ', this.imageFile);
    console.log('this.newPostForm.value : ', this.newPostForm.value);
    this.newPostForm.get('imagePost')!.setValue(this.imageFile);
    console.log('this.newPostForm.value : ', this.newPostForm.value);
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

/**
 * gère la demande de suppression de l'image actuelle du post 
 *    - intègre la demande dans le formulaire 
 *    - met à jour le pré-affichage
 */
  onImageDeleted(): void {
    this.newPostForm.get('imagePost')!.setValue('toDelete');
    console.log('this.newPostForm.value  image deleted: ', this.newPostForm.value);
    this.fileName = '';
    this.imagePreview =''
    }

/**
 * réinitialise le formulaire 
 */
  onResetForm() :void {
    this.newPostForm.reset();
    this.newPostForm.controls.textPost.setErrors(null)
    this.newPostForm.updateValueAndValidity()
    this.fileName ='';
    this.imagePreview = '';

  }
/**
 * restitue l'eventuel message d'erreur sur la saisie du texte
 *  @return { string } message d'erreur
 */
  getErrorMessageTextPost() {

    if (this.newPostForm.controls.textPost.hasError('required'))
        return 'texte obligatoire';
    return this.newPostForm.controls.textPost.invalid ? 'format de texte invalide ' : ''
  }

/**
 * uniquement pour entrée directe via post-list :
 * gère la demande de création du post avec les données validées du formulaire (entrée via post-list):
 *    - appel API via service posts
 *    - met à jour les données pour l'affichage
 */
  onNewPostSubmit() {
    
    if (this.newPostForm.valid) {
      
      let {textPost, imagePost} = this.newPostForm.value;
      if (!textPost || textPost.trim().length <3 ) {
        this.newPostForm.controls.textPost.setErrors(Validators.required)
        this.newPostForm.updateValueAndValidity()
        return
      }
      textPost = textPost!.trim();
      // console.log('création de post demandée - textPost: ',textPost!, 'imagePost : ', imagePost! )

      this.PostsService.createPost(textPost!,imagePost!)
          .subscribe ( {
            next : (data) => {
              // console.log('données createPost reçues : ', data)
              this.snackBarService.openSnackBar('c\'est partagé !','');
              // on réinitialise le formulaire
              this.onResetForm()        
              let createdTime = formatDate(new Date(), 'yyyy-MM-ddThh:mm:ss', 'en-US')
              let modifiedTime = createdTime;
              let nbLikes = 0;
              let likeId = 0;
              let isLiked = false;
              let nbComments = 0;
              let comments:Comment[] = [];
              let commentsShowed = false
              // on ajoute le post au tableau postsExt pour mettra à jour l'affichage
              let newPostExt = {...data!, createdTime, modifiedTime, nbLikes, isLiked, likeId, nbComments, comments, commentsShowed}
              this.postsExt.unshift(newPostExt);

            },
            error: (err) => {
              console.log('données createPost  ko : ', err);
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }

/**
 * uniquement pour entrée via post-edit-dialog :
 * gère la demande de modification du post avec les données validées du formulaire:
 *    - appel API via service posts
 *    - met à jour les données pour l'affichage
 */
  onEditedPostSubmit() {

    if (this.newPostForm.valid) {
      
      let {textPost, imagePost} = this.newPostForm.value;
      if (!textPost || textPost.trim().length <3 ) {
        this.newPostForm.controls.textPost.setErrors(Validators.required)
        this.newPostForm.updateValueAndValidity()
        return
      }
      textPost = textPost!.trim();
      // console.log('modification de post demandée - textPost: ',textPost!, 'imagePost : ', imagePost! )
      this.PostsService.updatePost(this.postExt!.id, textPost!,imagePost!)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetForm()   
              // on met à jour post pour l'affichage
              this.postExt!.text = textPost
              if (imagePost) { 
                if  (imagePost == 'toDelete') {
                  this.postExt!.imageUrl = null;
                } else {
                  this.postExt!.imageUrl = data.imageUrl
                }
              }
               this.dialogRef.close()
            },

            error: (err) => {
              console.log('données updatePost  ko : ', err);
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }

}
