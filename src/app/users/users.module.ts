import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { UserEmailFormComponent } from './user-email-form/user-email-form.component';
import { UserPasswordFormComponent } from './user-password-form/user-password-form.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';



@NgModule({
  declarations: [
    UserDetailsComponent,
    UsersListComponent,
    UserComponent,
    UserEditDialogComponent,
    UserEmailFormComponent,
    UserPasswordFormComponent,
    UserProfileFormComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule, 
    SharedModule,
    // SharedModule
  ]
})
export class UsersModule { }
