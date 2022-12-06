import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({
            opacity: 0,
        }),
        animate('300ms ease-in',
                style({ 
                      opacity: 1,
                })
        )
      ])
    ])
  ]
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
    private router: Router,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    // si le token actuel est toujours valide et on redirige directement vers la page d'accueil sans demander de ressaisir login/mdp
    if (this.tokenService.isTokenValid()) {
      this.snackBarService.openSnackBar('Bon retour sur le réseau social de Groupomania!','');
      this.router.navigateByUrl('posts');
    }
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
    return this.loginForm.controls.password.invalid ? 'doit contenir au moins 8 caractères dont 2 chiffres, 1 minuscule, 1 majuscule et un caractère spécial ' 
      : '';
  }
  
  onSubmit() {
    // console.warn(this.loginForm.value)
    if (this.loginForm.valid) {
      let {email, password} = this.loginForm.value;
      email = email!.trim();
      password = password!.trim()
        // const email = this.loginForm.get('emailControl')!.value
        // const password = this.loginForm.get('passwordControl')!.value
      this.authService.login(email!, password!)
          .subscribe ( {
            next : (data) => {
              console.log('données authService subscribe reçues : ', data)
              this.snackBarService.openSnackBar('Bienvenue sur le réseau social de Groupomania!','',3000,'','top');
              this.tokenService.saveToken(data.token);
              this.router.navigateByUrl('posts');
            },
            error: (err) => {
              console.log('données subscribe ko : ', err);
              this.errorMsgSubmit = 'Connection impossible:  ' + err;
              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', 'bottom', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }
}
