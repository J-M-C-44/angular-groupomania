import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
//icicjco
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSliderModule } from '@angular/material/slider';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    //icijco
    // MatSliderModule,
    // MatFormFieldModule,
    //MatInputModule,
    //FormsModule,
    //ReactiveFormsModule,
    

  ]
})
export class AuthModule { }
