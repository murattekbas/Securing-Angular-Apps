import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  isLoggedIn=false;

  constructor(private _authService:AuthService) {
    this._authService.loginChanged.subscribe(loggedIn=>{
      this.isLoggedIn=loggedIn;
    })
  }

  ngOnInit() {
    this._authService.isLoggedIn().then(loggedIn=>{
      this.isLoggedIn=loggedIn;
    })
  }

  login(){
    this._authService.login();
  }

  logout(){
    this._authService.logout();

  }

  
}
