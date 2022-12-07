// <--------------  gestion de la modification de l'email : appelé par edit-user-dialog  ------------->

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { UserExtended } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-email-form',
  templateUrl: './user-email-form.component.html',
  styleUrls: ['./user-email-form.component.scss']
})

/** gestion de la modification de l'email :
 *     - saisie d'un formulaire
 *     - appel API via user service
 *     - mise à jour des données pour l'affichage
 */
export class UserEmailFormComponent implements OnInit {
  emailForm!: FormGroup;
  errorMsgSubmit=''
  
  // données en provenance du composant parent (user-edit-dialog) et qui seront également mises à jour
  @Input() editedUser!: UserExtended

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    // formulaire pour la partie email. On initialise avec l'éventuelle donnée en notre possession.
    this.emailForm = new FormGroup({
      email : new FormControl(this.editedUser?.email, [Validators.required, Validators.email]),
    });
  }

/** restitue l'eventuel message d'erreur sur la saisie de l'email
 *  @return { string } message d'erreur
 */
  getErrorMessageEmail() :string {
    if (this.emailForm.controls.email.hasError('required'))
        return 'email obligatoire';
    return this.emailForm.controls.email.invalid ? 'format d\'email invalide ' : ''
  }

/**
 * gère la demande de modification de l'email avec la donnée validée du formulaire:
 *    - appel API via service user
 *    - mise à jour de l'email du user pour l'affichage
 */
  onEditedUserSubmit() :void {

    if (this.emailForm.valid) {
      
      let {email} = this.emailForm.value;
      email = email.trim();
      
      this.usersService.updateEmailUser(this.editedUser, email)
          .subscribe ( {
            next : (data) => {
              this.errorMsgSubmit = ''
              this.snackBarService.openSnackBar('email modifié !','');
              // on met à jour le user pour l'affichage
              this.editedUser.email = email
              // réinitialisation du formulaire
              this.emailForm = new FormGroup({
                email : new FormControl(this.editedUser?.email, [Validators.required, Validators.email]),
              });
            },

            error: (err) => {
              console.log('données updateUser email  ko : ', err);
              this.errorMsgSubmit = 'modification échouée: ' + err
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
    }
  }


}
