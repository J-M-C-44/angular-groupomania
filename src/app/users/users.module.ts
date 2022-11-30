import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    UserDetailsComponent,
    UsersListComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule, 
    SharedModule,
    // SharedModule
  ]
})
export class UsersModule { }
