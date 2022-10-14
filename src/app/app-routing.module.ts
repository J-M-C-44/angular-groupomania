import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { LoginComponent } from './auth/login/login.component';
//import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
//  { path: 'auth/login', component: LoginComponent },
//{ path: 'auth/signup', component: SignupComponent },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },
    { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  declarations: [],
  imports: [
    //CommonModule
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

