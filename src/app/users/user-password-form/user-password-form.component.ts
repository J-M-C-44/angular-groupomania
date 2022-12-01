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

  getErrorMessagePassword() {
    // if (this.passwordForm.controls.password.hasError('required'))
    //     return 'mot de passe obligatoire';
    // return this.passwordForm.controls.password.invalid ? 'doit contenir au moins 8 caractères dont 2 chiffres, 1 minuscule, 1 majuscule et un caractère spécial ' 
    //   : '';
    if (this.passwordForm.controls.password.hasError('required')) {
        return 'mot de passe obligatoire';
    } else if (this.passwordForm.controls.password.invalid) {
        return 'doit contenir au moins 8 caractères dont 2 chiffres, 1 minuscule, 1 majuscule et un caractère spécial ';
    } else {
        return '';
    };
  }

  onEditedUserSubmit() {
    console.log ('on edit user password!' )
    if (this.passwordForm.valid) {
      
      let {oldPassword, password} = this.passwordForm.value;
      //icijco : penser à virer le display console du password !
      console.log('modification de user demandée - this.passwordForm.value: ', password)
      oldPassword = oldPassword.trim();
      password = password.trim();
      
      console.log('modification de user demandée - password : ',password!)
      this.usersService.updatepasswordUser(this.editedUser, oldPassword, password)
          .subscribe ( {
            next : (data) => {
              this.errorMsgSubmit = ''
              this.snackBarService.openSnackBar('password modifié !','');
              // this.passwordForm = new FormGroup({
              //   oldPassword : new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
              //   password : new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
              // });
              // this.passwordForm.reset();
              // this.passwordForm.controls.password.setErrors(null);
              // this.passwordForm.controls.oldPassword.setErrors(null);
              // this.passwordForm.updateValueAndValidity()
              //  this.dialogRef.close()
            },

            error: (err) => {
              console.log('données update user password  ko : ', err);
              this.errorMsgSubmit = 'modification échouée: ' + err
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }



}
