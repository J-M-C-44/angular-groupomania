import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
;

const routes: Routes = [
  // routage vers les différents features modules. 
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },
    { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
    { path: '**', redirectTo: 'auth' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

