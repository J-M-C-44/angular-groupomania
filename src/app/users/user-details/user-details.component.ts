import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { User, UserExtended } from '../../shared/models/user.model';
import { DecodedToken, TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  decodedToken= new DecodedToken ;
  myUserId = 0;
  detailedUser: UserExtended = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:'', fullName:''}
  userIsAdmin = false;
  //ICIJCO : à voir si utile au final
  defaultAvatarUrl ='/assets/logo-avatar.jpg'
  avatarUrl ='';
  fullName ='';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    console.log('entrée dans user-detail')
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
              if (data.avatarUrl) {
                this.avatarUrl = data.avatarUrl;
              } 
            }
            ,
            error: (err) => {
              console.log('données getMyUser  ko : ', err);
              // ICIJCO : à intégrer
              // this.router.navigateByUrl('/auth/login')
            },
          }) 
        }
      
    let stringId = this.route.snapshot.paramMap.get('id');


    this.detailedUser.id = (stringId == 'me') ? this.myUserId : +stringId! ;
    
    let userFoundinCache =  this.usersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.detailedUser.id))
    if (userFoundinCache) {
      // this.avatarUrl = userFoundinCache.avatarUrl;
      // this.fullName = userFoundinCache.fullName;
      this.detailedUser = userFoundinCache;
    } else {
      this.usersService.getOneUser(this.detailedUser.id)
        .subscribe ( {
          next : (data) => {
            console.log('données getOneUser reçues : ', data)
            
            // let fullName = ('utilisateur n° ' + this.detailedUser.id);
            // if (data.lastname && data.firstname)
            //   fullName = (data.firstname + ' '+ data.lastname)
            // else if (data.lastname)
            //   fullName = data.lastname
            // else if(data.firstname)
            //   fullName = data.firstname;
            
            let fullName = this.usersService.formatFullName(data.id, data.lastname, data.firstname)  
            this.detailedUser = {...data, fullName}
            this.detailedUser.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;
          },

          error: (err) => {
            console.log('données getOneUser  ko : ', err);
            this.detailedUser.avatarUrl = this.defaultAvatarUrl
            this.detailedUser.fullName = ('utilisateur n° ' + this.detailedUser.id)
          },
        }) 
    }
  }


}
