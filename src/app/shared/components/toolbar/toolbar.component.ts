import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';
import { UsersService } from '../../services/users.service';


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
       
  ) { }

  ngOnInit(): void {
    //ICIJCO: récupérer token ? à moins que ce ne soit fait par gards/interceptor ?
  }

  goToPostsList() : void {
    this.router.navigate(['/posts']);
  }
  goToUsersList() : void {
    this.router.navigateByUrl('/users');
  }
  goToProfile() : void {
    this.router.navigateByUrl('/users/me');
    // ICICJCO pour test, à virer
    // this.router.navigateByUrl('/users/1');

  }
  logout() : void {
    this.tokenService.deleteToken();
    this.usersService.eraseMyUserData();
    this.router.navigateByUrl('/auth/login');
  }
}
