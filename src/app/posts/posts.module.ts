import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared.module';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsListComponent } from './posts-list/posts-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommentComponent } from './comment/comment/comment.component';
import { CommentFormComponent } from './comment/comment-form/comment-form.component';
import { CommentDeleteDialogComponent } from './comment/comment-delete-dialog/comment-delete-dialog.component';
import { CommentEditDialogComponent } from './comment/comment-edit-dialog/comment-edit-dialog.component';
import { PostFormComponent } from './post-form/post-form.component';

@NgModule({
  declarations: [
    PostsListComponent,
    CommentComponent,
    CommentFormComponent,
    CommentDeleteDialogComponent,
    CommentEditDialogComponent,
    PostFormComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule
  ]
})
export class PostsModule { }
