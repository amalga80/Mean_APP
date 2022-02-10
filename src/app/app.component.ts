import { AuthService } from './auth/auth.service';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authservice :AuthService) {}

  ngOnInit(): void {
    this.authservice.autoAuthUser();
  }

}
