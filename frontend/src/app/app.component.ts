import { Component } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Huiyuan\'s Lab 5';
  showSignUp = false;
  showLogin = false;

  constructor(private notify: ToastrService) {}

  clickSignUp() {
    this.showSignUp = true;
  }
  cancelSignup() {
    this.showSignUp = false;
  }

  clickLogin() {
    this.showLogin = true;
  }

  cancelLogin() {
    this.showLogin = false;
  }

  clickLogout() {
    localStorage.clear();
    this.notify.success('', 'Log Out Success',
      {timeOut: 1000 * 2,
        positionClass: 'toast-center-center'
      });
  }

  get isLoggedIn() {
    return (localStorage.length > 0);
  }
}
