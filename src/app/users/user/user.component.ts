import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { User, UserExtended } from '../../shared/models/user.model';
import {DeleteDialogComponent} from '../../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() usersExt!: UserExtended[];
  @Input() userExt!: UserExtended;
  @Input() userIsAdmin! : boolean;
  @Input() userId! : number;

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('userIsAdmin :' , this.userIsAdmin, 'userId : ', this.userId)
  }

  openDialogDelete() : void {
    console.log('openDialogDelete')
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     data: {
       type: 'user',
     },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        console.log(`deleteIsConfirmed : ${deleteIsConfirmed}`) ;
        this.usersService.deleteUser(this.userExt.id)
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('user supprimé',''); 
              const index: number = this.usersExt.indexOf(this.userExt);
              if (index !== -1) {
                this.usersExt.splice(index, 1);
              }
              console.log('this.usersExt :', this.usersExt);
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
}
