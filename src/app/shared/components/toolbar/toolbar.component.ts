// <----------------                 TOOLBAR : sert de header /navigation - disponible sur /users et /posts     ---------->

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

/**
 * la TOOLBAR permet de naviguer entre la liste des posts, la liste des users, la modification de profil et la déconnection 
 */
export class ToolbarComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private usersService: UsersService,
    private dialog: MatDialog,
       
  ) { }

  ngOnInit(): void {

  }

/**
 * route vers la liste des posts
 */
  goToPostsList() : void {
    // this.router.navigate(['/posts']);
    this.router.navigateByUrl('/posts');
  }

/**
 * route vers la liste des users
 */
  goToUsersList() : void {
    this.router.navigateByUrl('/users');
  }
  // goToProfile() : void {
  //   this.router.navigateByUrl('/users/me');
  // }

/**
 * ouvre la boite de dialogue permettant d'éditer les données de l'utilisateur actuellement connecté
 */
  openDialogEditUser() : void {
    console.log('openDialogEditUser')
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
        width:'95%',
        maxWidth:'800px',
        data: {
            userId: "me",
        },
    });
  }

/**
 * déconnecte et fait le ménage (token et données en mémoire)
 */
  logout() : void {
    this.tokenService.deleteToken();
    this.usersService.eraseMyUserData();
    this.router.navigateByUrl('/auth/login');
  }
}
