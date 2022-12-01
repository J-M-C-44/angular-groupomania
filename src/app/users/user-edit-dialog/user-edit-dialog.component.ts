import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserExtended } from 'src/app/shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';


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


  close() {
    this.dialogRef.close();
  }
}
