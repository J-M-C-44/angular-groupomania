import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour gérer les messages snack bar.
 */
export class SnackBarService {

  constructor(private matSnackBar: MatSnackBar) { }

/**
 * Permet d'envoyer des messages snackbar.
 * @param {string} message - Le message à mettredans le snackbar.
 * @param {string} action - le libellé pour l'action snackbar.
 * @param {number} duration - durée d'affichage en ms (optionnal - default: 2000)
 * @param {string} hPosition - position horizontale (optionnal - default: 'center')
 * @param {string} vPosition - position verticale (optionnal - default: 'bottom')
 * @param {string} className - class à appliquer (optionnal - snack-style--ok | snack-style--ko - default: 'snack-style--ok')
 */
  openSnackBar(message: string, action: string, duration?: any, hPosition?: any, vPosition? : any, className?: any ) :void {
    this.matSnackBar.open(message, action, {
      duration: duration ? duration : 2000,
      horizontalPosition: hPosition ? hPosition : 'center',
      verticalPosition: vPosition ? vPosition : 'bottom',
      panelClass: className ? className : 'snack-style--ok'
    });
  }
}
