import { AuthService } from './../../auth/auth.service';
import { PostSrevice } from './../posts.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls:['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading: boolean = false;
  totalPosts: number = 10;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  private authStatusSub: Subscription;
  userIsAuthenticated: boolean = false;
  userId:any;

  constructor(public postSrevice: PostSrevice,
    private authService: AuthService) {
    this.postSrevice = postSrevice;
  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUser();
    this.postSrevice.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postSrevice.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
       this.userIsAuthenticated = isAuthenticated;
       this.userId = this.authService.getUser();
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postSrevice.deletePost(postId).subscribe(res => {
      this.postSrevice.getPosts(this.postsPerPage, this.currentPage)
      }, () => {
        this.isLoading = false;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postSrevice.getPosts(this.postsPerPage, this.currentPage);

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
