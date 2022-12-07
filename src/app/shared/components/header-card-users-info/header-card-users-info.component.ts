// <!---------  header mat-card mutualisé entre plusieurs components: posts-list, postet comment    --->

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
  
  // // données en provenance du composant parent (posts-list, post, comment.component)
  @Input() userId!: number;
  @Input() createdTime?: string;

  defaultAvatarUrl ='../../../assets/logo-avatar.jpg'
  avatarUrl ='';
  fullName ='';
 
  constructor(
         private UsersService: UsersService,
  ) { }

  ngOnInit(): void {

    // recherche en cache du user. si non trouvé on va chercher via l'API
    let userFoundinCache =  this.UsersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.userId))
    if (userFoundinCache) {
      this.avatarUrl = userFoundinCache.avatarUrl;
      this.fullName = userFoundinCache.fullName;
    } else {
      this.UsersService.getOneUser(this.userId)
        .subscribe ( {
          next : (data) => {
            // console.log('données getOneUser reçues : ', data)
            this.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;
            this.fullName = this.UsersService.formatFullName(data.id, data.lastname, data.firstname)
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
