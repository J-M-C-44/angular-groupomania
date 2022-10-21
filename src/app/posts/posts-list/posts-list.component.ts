import { Component, OnInit } from '@angular/core';
import { DecodedToken, TokenService } from 'src/app/core/services/token.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../../shared/models/post.model';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
userId = 0;
userIsAdmin = false;
token = new DecodedToken ;
//AvatarUrl=
fullName = 'Current User';
newPostForm = new FormGroup({
  //icicjco : reprendre controle back-end
  textPost : new FormControl('', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
  imagePost: new FormControl <File | null> (null)
})
// imagePreview ='';
fileName = '';
imageFile!: File;
imagePreview = '';

posts:Post[] =[];
currentPage = 0;
totalPages = 0;
firstPage = true;
lastPage = true;
totalRows = 0;
// nbLikes = 0;
// nbComments =0;

  constructor(
     private tokenService: TokenService,
     private snackBarService: SnackBarService,
     private PostsService: PostsService,
  ) { }
  
  ngOnInit(): void {
    //recup token
    this.token = this.tokenService.getDecodedToken();
    this.userId = this.token.userId
    this.token.userRole > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
    // console.log ('this.token.userId: ', this.token.userId, ' - this.userIsAdmin: ', this.userIsAdmin, ' this.token.role', this.token.userRole )
    //recup image avatar
    // ICIJCO get user actif à faire

    // création blok posts-list
    this.PostsService.getAllPosts()
          .subscribe ( {
            next : (data) => {
              console.log('données getAllPosts reçues : ', data)
              const { posts, currentPage, totalPages, firstPage, lastPage, totalRows} = data;
              this.posts = posts;
              this.currentPage = currentPage;
              this.totalPages = totalPages;
              this.firstPage = firstPage;
              this.lastPage = lastPage ;
              this.totalRows = totalRows;
            },
            error: (err) => {
              console.log('données getAllPosts  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'récupération des posts échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })   
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
              // ICIJCO : ajouter le nouveau post à la liste des posts
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

  likePost(postId:number) {
    console.log('liked : postID = ', postId)
    // icijco : ajouter appel à addLike
  }
  showComments(postId:number) {
    console.log('showComments: postID = ', postId)
    // icijco : ajouter appel à addLike
  }

  getCountLikes(postId:number) :number  {
    //icijco : ajouter appel à countLikes
    
    return 1 ;
  };

  getCountComments(postID:number) :number {
    //icijco : ajouter appel à countComments
    return 2;
  }
};

