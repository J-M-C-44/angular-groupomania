import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsListComponent } from './posts-list/posts-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommentComponent } from './comment/comment/comment.component';
import { CommentFormComponent } from './comment/comment-form/comment-form.component';
import { CommentEditDialogComponent } from './comment/comment-edit-dialog/comment-edit-dialog.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostComponent } from './post/post.component';
import { PostEditDialogComponent } from './post-edit-dialog/post-edit-dialog.component';

@NgModule({
  declarations: [
    PostsListComponent,
    CommentComponent,
    CommentFormComponent,
    CommentEditDialogComponent,
    PostFormComponent,
    PostComponent,
    PostEditDialogComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule
  ]
})
export class PostsModule { }
