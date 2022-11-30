import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header-card-users-info',
  templateUrl: './header-card-users-info.component.html',
  styleUrls: ['./header-card-users-info.component.scss']
})
export class HeaderCardUsersInfoComponent implements OnInit {

  @Input() userId!: number;
  @Input() createdTime?: string;

  defaultAvatarUrl ='../../../assets/logo-avatar.jpg'
  avatarUrl ='';
  fullName ='';
 
  constructor(
         private UsersService: UsersService,
  ) { }

  ngOnInit(): void {

    // this.avatarUrl = this.defaultAvatarUrl
    
    let userFoundinCache =  this.UsersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.userId))
    if (userFoundinCache) {
      this.avatarUrl = userFoundinCache.avatarUrl;
      this.fullName = userFoundinCache.fullName;
    } else {
      this.UsersService.getOneUser(this.userId)
        .subscribe ( {
          next : (data) => {
            console.log('données getOneUser reçues : ', data)
            // if (data.avatarUrl)
            //   this.avatarUrl = data.avatarUrl;
            this.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;

            // if (data.lastname && data.firstname)
            //   this.fullName = (data.firstname + ' '+ data.lastname)
            // else if (data.lastname)
            //   this.fullName = data.lastname
            // else if(data.firstname)
            //   this.fullName = data.firstname;
            // else 
            //   this.fullName = ('utilisateur n° ' + this.userId)

            this.fullName = this.UsersService.formatFullName(data.id, data.lastname, data.firstname)
              
            // let newUserExtendedCache = {...data, fullName:this.fullName};
            // newUserExtendedCache.avatarUrl = this.avatarUrl;
            // this.UsersService.UsersExtendedCache = this.UsersService.UsersExtendedCache!.filter(u => u.id !== this.userId)
            // this.UsersService.UsersExtendedCache.push(newUserExtendedCache)
          },

          error: (err) => {
            console.log('données getOneUser  ko : ', err);
            this.avatarUrl = this.defaultAvatarUrl
            this.fullName = ('utilisateur n° ' + this.userId)
          },
        }) 
    }
  }

}
