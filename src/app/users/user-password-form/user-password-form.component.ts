// <--------------  gestion de la modification du mot de passe : appelé par edit-user-dialog  ------------->

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
// import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/shared/services/users.service';
import { UserExtended } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-password-form',
  templateUrl: './user-password-form.component.html',
  styleUrls: ['./user-password-form.component.scss']
})

/** gestion de la modification du mot de passe :
 *     - saisie d'un formulaire
 *     - appel API via user service
 *     - mise à jour des données pour l'affichage
 */
export class UserPasswordFormComponent implements OnInit {
  hideOldPassword = true;
  hidePassword = true;
  errorMsgSubmit=''
  passwordForm!: FormGroup;

  @Input() editedUser!: UserExtended

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    console.log('input editedUser :' , this.editedUser)
    this.passwordForm = new FormGroup({
      oldPassword : new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      password : new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    });
  }

/**
 * restitue l'eventuel message d'erreur sur la saisie du mot de passe
 *  @return { string } message d'erreur
 */
  getErrorMessagePassword() :string{
    if (this.passwordForm.controls.password.hasError('required')) {
        return 'mot de passe obligatoire';
    } else if (this.passwordForm.controls.password.invalid) {
        return 'doit contenir au moins 8 caractères dont 2 chiffres, 1 minuscule, 1 majuscule et un caractère spécial ';
    } else {
        return '';
    };
  }

/**
 * gère la demande de modification du password : appel API (via service user) avec les données validées du formulaire (ancien et nouveau mot de passe)
 * Le back-end fait un contrôle préalable de l'ancien mot de passe 
 */
  onEditedUserSubmit() :void {

    if (this.passwordForm.valid) {
      let {oldPassword, password} = this.passwordForm.value;
      oldPassword = oldPassword.trim();
      password = password.trim();

      this.usersService.updatepasswordUser(this.editedUser, oldPassword, password)
          .subscribe ( {
            next : (data) => {
              this.errorMsgSubmit = ''
              this.snackBarService.openSnackBar('password modifié !','');
            },

            error: (err) => {
              console.log('données update user password  ko : ', err);
              this.errorMsgSubmit = 'modification échouée: ' + err
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
    }
  }



}
