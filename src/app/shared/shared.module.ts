import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HeaderCardUsersInfoComponent } from './components/header-card-users-info/header-card-users-info.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    HeaderCardUsersInfoComponent,
    DeleteDialogComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatPaginatorModule,
    MatListModule,
    MatTabsModule,
    ToolbarComponent,
    HeaderCardUsersInfoComponent,

  ]
})
export class SharedModule { }
