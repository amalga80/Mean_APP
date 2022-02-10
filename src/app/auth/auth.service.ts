import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/user/";
@Injectable({ providedIn: "root" })

export class AuthService{
  private isAuthenticated = false;
  private token: string;
  private tokenTimer:any;
  private userId: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(firstName: string, lastName: string, email: string, password: string) {
    const authData: AuthData = {
      firstName : firstName,
      lastName : lastName,
      email : email,
      password : password,
    }
    return this.http.post( BACKEND_URL +"/signup", authData)
      .subscribe(res => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData ={ email : email, password : password }
    this.http.post<{token: string, expiresIn: number, userId: any}>( BACKEND_URL +"/login", authData)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        if (token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log( this.userId);
          this.saveAuthData(token,  expirationDate, this.userId)
          this.router.navigate(['/']);
        }
        console.log(res.token);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  private setAuthTimer(duration: number) {
    console.log("setting timer: " + duration);
    this.tokenTimer =  setTimeout(() => {
      this.logout();
    }, duration * 1000 );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.userId = authInformation.userId;
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000 );
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  getUser() {
    return this.userId;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthDate();
    this.userId = null;
    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem("user", user)
  }

  private clearAuthDate() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("user");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId : userId
    };
  }
}
