import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
  })
  hide = true;
  errorMsgSubmit=''

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  getErrorMessageEmail() {

    // if (this.loginForm.emailControl.hasError('required')) {
    //   return 'You must enter a value';
    // }
    // return this.emailControl.hasError('email') ? 'Not a valid email' : '';
    if (this.loginForm.controls.email.hasError('required'))
        return 'email obligatoire';
    return this.loginForm.controls.email.invalid ? 'format d\'email invalide ' : ''
  }

  getErrorMessagePassword() {
    // if (this.passwordControl.hasError('required')) {
    //   return 'You must enter a value';
    // }
    // return this.passwordControl.invalid ?  'doit contenir au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule et un caractère spécial ' : '';

    if (this.loginForm.controls.password.hasError('required'))
        return 'mot de passe obligatoire';
    return this.loginForm.controls.password.invalid ? 'doit contenir au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule et un caractère spécial ' 
      : '';
  }
  
  onSubmit() {
    console.warn(this.loginForm.value)
    if (this.loginForm.valid) {
      let {email, password} = this.loginForm.value;
      email = email!.trim();
      password = password!.trim()
        // const email = this.loginForm.get('emailControl')!.value
        // const password = this.loginForm.get('passwordControl')!.value
      this.authService.login(email!, password!)
          .subscribe ( {
            next : (data) => {
              console.log('données subscribe reçues : ', data)
              this.snackBarService.openSnackBar('Bienvenue sur le réseau social de Groupomania!','');
              localStorage.setItem('token', data.token);
              this.router.navigateByUrl('posts');
            },
            error: (err) => {
              console.log('données subscribe ko : ', err);
              this.errorMsgSubmit = 'Connection impossible:  ' + err;
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', 'bottom', 'snack-style-ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }
}
