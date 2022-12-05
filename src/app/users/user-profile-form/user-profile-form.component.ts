import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { UserExtended } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})
export class UserProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  errorMsgSubmit=''
  fileName = '';
  imageFile!: File;
  imagePreview = '';
  defaultAvatarUrl ='/assets/logo-avatar.jpg';
  charAndDigitTypeRegexpMedium = new RegExp('^[a-zàâéèëêïîôùüûçœ0-9][a-zàâéèëêïîôùüûçœ0-9\'’ !&_-]{1,58}[a-zàâéèëêïîôùüûçœ0-9!\\s]$','i');
  charTypeRegexp =new RegExp('^[a-zàâéèëêïîôùüçœ][a-zàâéèëêïîôùüçœ\'’ -]{0,58}[a-zàâéèëêïîôùüçœ]$','i');
  
  @Input() editedUser!: UserExtended

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {

    this.imagePreview = this.editedUser.avatarUrl ? this.editedUser.avatarUrl : '' ;


    this.profileForm = new FormGroup({
      lastname : new FormControl(this.editedUser?.lastname, [Validators.pattern(this.charTypeRegexp)]),
      firstname : new FormControl(this.editedUser?.firstname, [Validators.pattern(this.charTypeRegexp)]),
      fonction : new FormControl(this.editedUser?.fonction, [Validators.pattern(this.charAndDigitTypeRegexpMedium)]),
      avatar: new FormControl <File | string | null> (null)
    });
  }


  onImageAdded(event:any) {
    this.imageFile = event.target.files[0];
    console.log('this.imageFile : ', this.imageFile);
    console.log('this.profileForm.value : ', this.profileForm.value);
    this.profileForm.get('avatar')!.setValue(this.imageFile);
    console.log('this.profileForm.value : ', this.profileForm.value);
    // this.profileForm.updateValueAndValidity();
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

  onImageDeleted(): void {
    this.profileForm.get('avatar')!.setValue('toDelete');
    console.log('this.profileForm.value  image avatar deleted: ', this.profileForm.value);
    this.fileName = '';
    this.imagePreview = this.defaultAvatarUrl
    
    }

  // onResetForm() {
  //   this.profileForm.reset();
  //   this.profileForm.controls.textPost.setErrors(null)
  //   this.profileForm.updateValueAndValidity()
  //   this.fileName ='';
  //   this.imagePreview = '';

  // }
  getErrorMessageLastname() {
    if (this.profileForm.controls.lastname.hasError('required'))
        return 'nom obligatoire';
    return this.profileForm.controls.lastname ? 'format de texte invalide ' : ''
  }
  getErrorMessageFirstname() {
    if (this.profileForm.controls.firstname.hasError('required'))
        return 'prénom obligatoire';
    return this.profileForm.controls.firstname ? 'format de texte invalide ' : ''
  }
  getErrorMessageFonction() {
    if (this.profileForm.controls.fonction.hasError('required'))
        return 'fonction obligatoire';
    return this.profileForm.controls.fonction ? 'format de texte invalide ' : ''
  }


  onEditedUserSubmit() {
    console.log ('on edit profile!')
    if (this.profileForm.valid) {
      
      let {lastname, firstname, fonction, avatar} = this.profileForm.value;
      
      lastname = lastname!.trim();
      firstname = firstname!.trim();
      fonction = fonction!.trim();

      console.log('modification de post demandée - lastname: ',lastname, 'firstname : ', firstname, 'fonction : ', fonction, 'avatar : ', avatar )
      
      // /*ICIJCO - pré test profil
      //   pas d'image --> avatar = null
      //   si image --> avatar = file
      //   si ajout et suppression image : avatar = toDelete

      //   ***** attention: ajouter test sur pertinennce d'enregistrer : si pas d'image ajoutée alors qu'existe au départ --> 
      
      //         // this.postExt!.text = textPost
      //         // if (imagePost) { 
      //         //   if  (imagePost == 'toDelete') {
      //         //     this.postExt!.imageUrl = null;
      //         //   } else {
      //         //     this.postExt!.imageUrl = data.imageUrl
      //         //   }
      //         // }

          this.usersService.updateProfileUser(this.editedUser, lastname, firstname, fonction, avatar)
          .subscribe ( {
            next : (data) => {
              this.errorMsgSubmit = ''
              this.snackBarService.openSnackBar('profil modifié !','');
              // this.onResetForm()   
              // on met à jour le user pour l'affichage
              this.editedUser.lastname = lastname;
              this.editedUser.firstname = firstname;
              this.editedUser.fonction = fonction;
              if (avatar) 
                if (avatar = 'toDelete') {
                  this.editedUser.avatarUrl = this.defaultAvatarUrl;
                } else {
                  this.editedUser.avatarUrl = data.avatarUrl;
                }
              
              this.profileForm = new FormGroup({
                lastname : new FormControl(this.editedUser?.lastname, [Validators.pattern(this.charTypeRegexp)]),
                firstname : new FormControl(this.editedUser?.firstname, [Validators.pattern(this.charTypeRegexp)]),
                fonction : new FormControl(this.editedUser?.fonction, [Validators.pattern(this.charAndDigitTypeRegexpMedium)]),
                avatar: new FormControl <File | string | null> (null)
              });
            },

            error: (err) => {
              console.log('données updateUser profil  ko : ', err);
              this.errorMsgSubmit = 'modification échouée: ' + err
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
          
    }
  }

}
