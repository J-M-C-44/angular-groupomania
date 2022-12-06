import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
    
  { path: '', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'users/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
  // { path: '', component: UserslistComponent, canActivate: [AuthGuard] },
  //ICIJCO : à revoir ?
  { path: '', pathMatch: 'full', redirectTo: 'UserDetailsComponent' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
