import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenService: TokenService,
       
  ) { }

  ngOnInit(): void {
    //ICIJCO: récupérer token ? à moins que ce ne soit fait par gards/interceptor ?
  }

  goToPostsList() : void {
    this.router.navigateByUrl('posts');
  }
  goToUsersList() : void {
    this.router.navigateByUrl('/users');
  }
  goToProfile() : void {
    this.router.navigateByUrl('users/user-detail');

  }
  logout() : void {
    //localStorage.removeItem('token');
    this.tokenService.deleteToken();
    this.router.navigateByUrl('/auth/login');
  }
}
