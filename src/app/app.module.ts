import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from 'src/app/core/core.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { UsersModule } from 'src/app/users/users.module';
import { PostsModule } from 'src/app/posts/posts.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//icijco
import { MatSliderModule } from '@angular/material/slider';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    UsersModule,
    PostsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
//icicjco
    MatSliderModule,
    // MatFormFieldModule,
    // FormsModule,
    // ReactiveFormsModule,
    // MatInputModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
