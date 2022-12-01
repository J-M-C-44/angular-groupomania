import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from '../../shared/services/snack-bar.service';
// import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/shared/services/users.service';
import { UserExtended } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-email-form',
  templateUrl: './user-email-form.component.html',
  styleUrls: ['./user-email-form.component.scss']
})
export class UserEmailFormComponent implements OnInit {
  emailForm!: FormGroup;
  errorMsgSubmit=''
  

  @Input() editedUser!: UserExtended

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    console.log('input editedUser :' , this.editedUser)
    this.emailForm = new FormGroup({
      email : new FormControl(this.editedUser?.email, [Validators.required, Validators.email]),
    });
  }

  getErrorMessageEmail() {
    if (this.emailForm.controls.email.hasError('required'))
        return 'email obligatoire';
    return this.emailForm.controls.email.invalid ? 'format d\'email invalide ' : ''
  }


  onEditedUserSubmit() {
    console.log ('on edit user email!' )
    if (this.emailForm.valid) {
      
      let {email} = this.emailForm.value;
      console.log('modification de user demandée - this.emailForm.value: ', email)
      email = email.trim();
      
      console.log('modification de user demandée - email : ',email!)
      this.usersService.updateEmailUser(this.editedUser, email)
          .subscribe ( {
            next : (data) => {
              this.errorMsgSubmit = ''
              this.snackBarService.openSnackBar('email modifié !','');
              // this.onResetForm()   
              // on met à jour le user pour l'affichage
              this.editedUser.email = email
              this.emailForm = new FormGroup({
                email : new FormControl(this.editedUser?.email, [Validators.required, Validators.email]),
              //  this.dialogRef.close()
              });
            },

            error: (err) => {
              console.log('données updateUser email  ko : ', err);
              this.errorMsgSubmit = 'modification échouée: ' + err
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }


}
