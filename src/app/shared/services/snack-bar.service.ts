import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private matSnackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string,
    duration?: any,
    hPosition?: any, vPosition? : any,
    className?: any ) {
    this.matSnackBar.open(message, action, {
      duration: duration ? duration : 3000,
      horizontalPosition: hPosition ? hPosition : 'center',
      verticalPosition: vPosition ? vPosition : 'top',
      panelClass: className ? className : 'snack-style--ok'
    });
  }
}
