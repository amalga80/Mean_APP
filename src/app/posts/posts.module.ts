import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { PostListComponent } from '../posts/post-list/post-list.component'
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  imports:[
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ],
  declarations: [
    PostListComponent,
    PostCreateComponent,
  ]

})
export class PostsModule {}
