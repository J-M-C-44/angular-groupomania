import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserExtended } from 'src/app/shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';



@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  myUserId = 0;
  userIsAdmin = false;
  editedUser: UserExtended = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:'', fullName:''};
  defaultAvatarUrl ='/assets/logo-avatar.jpg';
  titre = '';
  

  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    private usersService: UsersService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    console.log('entrée dans user-edit-dialog')

    // recupération des infos du user actuel 
    if (this.usersService.myUser.id !=0) {
      this.myUserId = this.usersService.myUser.id,
      this.usersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

    } else { 
        this.usersService.getMyUser()
          .subscribe ( {
            next : (data) => {
              console.log('données getMyUser reçues : ', data);
              this.myUserId = data.id
              data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false; 
            }
            ,
            error: (err) => {
              console.log('données getMyUser  ko : ', err);
              // ICIJCO : à intégrer
              // this.router.navigateByUrl('/auth/login')
            },
          }) 
    }
  
    this.editedUser.id = (this.data.userId == 'me') ? this.myUserId : this.data.userId ;
    
    let userFoundinCache =  this.usersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.editedUser.id))
    if (userFoundinCache) {
      this.editedUser = userFoundinCache;

    } else {
      this.usersService.getOneUser(this.editedUser.id)
        .subscribe ( {
          next : (data) => {
            console.log('données getOneUser reçues : ', data)
            
            let fullName = this.usersService.formatFullName(data.id, data.lastname, data.firstname)  
            this.editedUser = {...data, fullName}
            this.editedUser.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;
          },

          error: (err) => {
            console.log('données getOneUser  ko : ', err);
            this.editedUser.avatarUrl = this.defaultAvatarUrl
            this.editedUser.fullName = ('utilisateur n° ' + this.editedUser.id)
          },
        }) 
    }
    this.titre = (this.data.userId == 'me') ? 'Modifier votre profil' : ('Modifier le profil de '+this.editedUser.fullName) ;
  }

  openDialogDelete() : void {
    console.log('openDialogDelete')
    let dataType = (this.data.userId == 'me') ? 'myUser' : 'user';
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     data: {
       type: dataType,
     },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        console.log(`deleteIsConfirmed : ${deleteIsConfirmed}`) ;
        this.usersService.deleteUser(this.editedUser.id )
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('user supprimé','');
              if (this.data.userId == 'me') {
                this.tokenService.deleteToken();
                this.usersService.eraseMyUserData();
                this.dialogRef.close();
                this.router.navigateByUrl('/auth/signup');
              } 
              
            },
            error: (err) => {
              console.log('suppression user  ko : ', err);
              let errorMsgSubmit = 'suppression utilisateur échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
      };
    });
  }

  close() {
    this.dialogRef.close();
  }
}
