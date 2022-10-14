import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';



@NgModule({
  declarations: [
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule, 
    // SharedModule
  ]
})
export class UsersModule { }
