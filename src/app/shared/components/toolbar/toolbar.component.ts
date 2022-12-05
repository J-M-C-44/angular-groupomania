import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog'
import { UserEditDialogComponent } from 'src/app/users/user-edit-dialog/user-edit-dialog.component';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private usersService: UsersService,
    private dialog: MatDialog,
       
  ) { }

  ngOnInit(): void {

  }

  goToPostsList() : void {
    // this.router.navigate(['/posts']);
    this.router.navigateByUrl('/posts');
  }
  goToUsersList() : void {
    this.router.navigateByUrl('/users');
  }
  goToProfile() : void {
    this.router.navigateByUrl('/users/me');
  }

  openDialogEditUser() : void {
    console.log('openDialogEditUser')
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
        width:'95%',
        maxWidth:'800px',
        data: {
            userId: "me",
          //pour test
          // userId: 1,
        },
    });
  }


  logout() : void {
    this.tokenService.deleteToken();
    this.usersService.eraseMyUserData();
    this.router.navigateByUrl('/auth/login');
  }
}
