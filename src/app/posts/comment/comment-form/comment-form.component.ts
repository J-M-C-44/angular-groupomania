import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { PostExtended } from '../../../shared/models/post.model';
import { CommentsService } from '../../shared/services/comments.service';
import { Comment } from '../../../shared/models/comment.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Input() postExt!: PostExtended
  commentFileName = '';
  commentImageFile!: File;
  commentImagePreview = ''
  
  newCommentForm = new FormGroup({
    //icicjco : reprendre controle back-end
    textComment : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
    imageComment: new FormControl <File | null> (null)
  })

  constructor(
    private CommentsService: CommentsService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  
  onCommentImageAdded(event:any) {
    this.commentImageFile = event.target.files[0];
    console.log('this.commentImageFile : ', this.commentImageFile);
    console.log('this.newCommentForm.value : ', this.newCommentForm.value);
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
      console.log('this.commentImageFile : ', this.commentImageFile);
      this.commentFileName = this.commentImageFile.name;
    }
  }
  onResetCommentForm() {
    this.newCommentForm.reset();
    this.newCommentForm.controls.textComment.setErrors(null)
    this.newCommentForm.updateValueAndValidity()
    this.commentFileName ='';
    this.commentImagePreview = '';
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
      console.log('création de comment demandée - textComment: ',textComment!, 'imageComment : ', imageComment! )
      this.CommentsService.addComment(postExt.id,textComment!,imageComment!)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('c\'est partagé !','');
              this.onResetCommentForm()        
              // ICIJCO : ajouter le created et modified time dans la réponse back-end lors de la création commentaire
              let newComment = {...data}
              postExt.nbComments! ++||1
              postExt.comments!.push(newComment)
            },
            error: (err) => {
              console.log('données createComment  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'Publication échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }
}
