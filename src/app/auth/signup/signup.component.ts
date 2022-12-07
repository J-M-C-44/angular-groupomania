import { Component, OnInit,  ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({
            opacity: 0,
        }),
        animate('300ms ease-in', style({
            opacity: 1,
        }))
      ])
    ])
  ]
})

/**
 * gestion de l'enregistrement d'un nouvel utilisateur
 */
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
  })
  hide = true;
  errorMsgSubmit=''

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router,
    private el : ElementRef 
  ) { }

  ngOnInit(): void {
  }

  
/**
 * restitue l'eventuel message d'erreur sur la saisie de l'email
 * @return { string } message d'erreur
 */
  getErrorMessageEmail() {
    if (this.signupForm.controls.email.hasError('required'))
        return 'email obligatoire';
    return this.signupForm.controls.email.invalid ? 'format d\'email invalide ' : ''
  }

  /**
 * restitue l'eventuel message d'erreur sur la saisie du mot de passel
 * @return { string } message d'erreur
 */
  getErrorMessagePassword() {
    if (this.signupForm.controls.password.hasError('required'))
        return 'mot de passe obligatoire';
    return this.signupForm.controls.password.invalid ? 'doit contenir au moins 8 caractères dont 2 chiffres, 1 minuscule, 1 majuscule et un caractère spécial ' 
      : '';
  }
  
/**
 * gère la demande d'enregistrement avec les données validées du formulaire :
 *    - appel API via service auth
 *    - reroutage vers page de login
 */
  onSubmit() {
    if (this.signupForm.valid) {
      let {email, password} = this.signupForm.value;
      email = email!.trim();
      password = password!.trim()
      this.authService.signup(email!, password!)
          .subscribe ( {
            next : (data) => {
              this.snackBarService.openSnackBar('enregistrement réussi! Connectez vous pour accéder au réseau social','');
              this.router.navigateByUrl('auth/login');
            },
            error: (err) => {
              console.log('données signup ko : ', err);
              this.errorMsgSubmit = 'enregistrement impossible:  ' + err;
              if (err.includes('invalid email')) 
                 this.el.nativeElement.querySelector('input[formControlName="email"]')
                    .focus()
              if (err.includes('invalid password')) 
                 this.el.nativeElement.querySelector('input[formControlName="password"]').focus();

              this.snackBarService.openSnackBar(this.errorMsgSubmit,'','','', 'bottom', 'snack-style--ko');
            },
            // complete: () => console.info('complete')
          })
    }
  }
}
