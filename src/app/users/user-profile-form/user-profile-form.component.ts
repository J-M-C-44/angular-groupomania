// <--------------  gestion de la modification du profil : appelé par edit-user-dialog  ------------->

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { UserExtended } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})

/** gestion de la modification du profil (nom, prénom, fonction, avatar) :
 *     - saisie d'un formulaire
 *     - appel API via user service
 *     - mise à jour des données pour l'affichage
 */
export class UserProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  errorMsgSubmit=''
  fileName = '';
  imageFile!: File;
  imagePreview = '';
  defaultAvatarUrl ='/assets/logo-avatar.jpg';
  // regexp pour controle données formulaire
  charAndDigitTypeRegexpMedium = new RegExp('^[a-zàâéèëêïîôùüûçœ0-9][a-zàâéèëêïîôùüûçœ0-9\'’ !&_-]{1,58}[a-zàâéèëêïîôùüûçœ0-9!\\s]$','i');
  charTypeRegexp =new RegExp('^[a-zàâéèëêïîôùüçœ][a-zàâéèëêïîôùüçœ\'’ -]{0,58}[a-zàâéèëêïîôùüçœ]$','i');
  
  // données en provenance du composant parent (user-edit-dialog) et qui seront également mises à jour
  @Input() editedUser!: UserExtended

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
  ) { }


  ngOnInit(): void {

    this.imagePreview = this.editedUser.avatarUrl ? this.editedUser.avatarUrl : '' ;
    
    // formulaire pour la partie profil. On initialise avec les éventuelles données en notre possession.
    this.profileForm = new FormGroup({
      lastname : new FormControl(this.editedUser?.lastname, [Validators.pattern(this.charTypeRegexp)]),
      firstname : new FormControl(this.editedUser?.firstname, [Validators.pattern(this.charTypeRegexp)]),
      fonction : new FormControl(this.editedUser?.fonction, [Validators.pattern(this.charAndDigitTypeRegexpMedium)]),
      avatar: new FormControl <File | string | null> (null)
    });
  }

/**
 * gère la récupération du fichier uploadé qui sera ensuite:
 *    - intègré au formulaire 
 *    - pré-affiché
 */
  onImageAdded(event:any) :void {

    this.imageFile = event.target.files[0];
    this.profileForm.get('avatar')!.setValue(this.imageFile);
    //todo: restera à ajouter test sur la taille max
    if (this.imageFile) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.imagePreview = fileReader.result as string;
      };
      fileReader.readAsDataURL(this.imageFile)
      this.fileName = this.imageFile.name;
    }
  }

/**
 * gère la demande de suppression de l'avatar actuel 
 *    - intègre la demande dans le formulaire 
 *    - met à jour le pré-affichage
 */
  onImageDeleted(): void {
    this.profileForm.get('avatar')!.setValue('toDelete');
    console.log('this.profileForm.value  image avatar deleted: ', this.profileForm.value);
    this.fileName = '';
    this.imagePreview = this.defaultAvatarUrl
    
    }

/**
 * restitue l'eventuel message d'erreur sur la saisie du nom
 *  @return { string } message d'erreur
 */
  getErrorMessageLastname() :string {
    if (this.profileForm.controls.lastname.hasError('required'))
        return 'nom obligatoire';
    return this.profileForm.controls.lastname ? 'format de texte invalide ' : ''
  }

/**
 * restitue l'eventuel message d'erreur sur la saisie du prénom
 *  @return { string } message d'erreur
 */
  getErrorMessageFirstname() :string {
    if (this.profileForm.controls.firstname.hasError('required'))
        return 'prénom obligatoire';
    return this.profileForm.controls.firstname ? 'format de texte invalide ' : ''
  }

/**
 * restitue l'eventuel message d'erreur sur la saisie de la fonction
 *  @return { string } message d'erreur
 */
  getErrorMessageFonction() :string {
    if (this.profileForm.controls.fonction.hasError('required'))
        return 'fonction obligatoire';
    return this.profileForm.controls.fonction ? 'format de texte invalide ' : ''
  }


/**
 * gère la demande de modification du profil avec les données validées du formulaire:
 *    - appel API via service user
 *    - met à jour les données pour l'affichage
 */
  onEditedUserSubmit() :void {

    if (this.profileForm.valid) {
      
      let {lastname, firstname, fonction, avatar} = this.profileForm.value;      
      lastname = lastname!.trim();
      firstname = firstname!.trim();
      fonction = fonction!.trim();
      //console.log('modification de post demandée - lastname: ',lastname, 'firstname : ', firstname, 'fonction : ', fonction, 'avatar : ', avatar )

      //appel API via service user
      this.usersService.updateProfileUser(this.editedUser, lastname, firstname, fonction, avatar)
      .subscribe ( {
        next : (data) => {
          this.errorMsgSubmit = ''
          this.snackBarService.openSnackBar('profil modifié !',''); 
          // on met à jour le user pour l'affichage
          this.editedUser.lastname = lastname;
          this.editedUser.firstname = firstname;
          this.editedUser.fonction = fonction;
          if (avatar) {
            if (avatar == 'toDelete') {
              this.editedUser.avatarUrl = this.defaultAvatarUrl;
            } else {
              this.editedUser.avatarUrl = data.avatarUrl;
            }
          } 
            
          // réinitialisation formulaire
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
      })
          
    }
  }

}
