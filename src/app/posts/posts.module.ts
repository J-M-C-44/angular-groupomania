import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared.module';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsListComponent } from './posts-list/posts-list.component';



@NgModule({
  declarations: [
    PostsListComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    // SharedModule
  ]
})
export class PostsModule { }
