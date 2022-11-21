import { Component, Input, OnInit } from '@angular/core';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../../shared/models/post.model';
import { PostExtended } from '../../shared/models/post.model';
import { Comment } from '../../shared/models/comment.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  @Input() postsExt!: PostExtended[]

  newPostForm!: FormGroup;
  fileName = '';
  imageFile!: File;
  imagePreview = '';

  constructor(
    private snackBarService: SnackBarService,
    private PostsService: PostsService,
  ) { }

  ngOnInit(): void {

    this.newPostForm = new FormGroup({
      // textPost : new FormControl(this.post?.text, [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
      textPost : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
      imagePost: new FormControl <File | string | null> (null)
    });
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




}
