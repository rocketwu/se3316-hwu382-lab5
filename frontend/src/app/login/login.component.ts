import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../models/user';
import {LoginService} from '../login.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() canceled = new EventEmitter();

  username = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  signUpForm = new FormGroup({
    username: this.username,
    password: this.password
  });

  onSubmit() {
    this.login();
  }

  constructor(private loginService: LoginService, private notify: ToastrService) { }


  ngOnInit() {
  }


  login() {
    let user = new User();
    user.username = this.signUpForm.value.username;
    user.password = this.signUpForm.value.password;
    localStorage.clear();

    this.loginService.postLogin(user).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        // login success
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('userID', res.userID);
        localStorage.setItem('isManager', res.isManager);
        this.notify.success('Welcome back ' + localStorage.getItem('username'),
          'Login Success',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.canceled.emit();
      } else {
        // Error happens
        let errMessage = res.message;
        if (errMessage === 'Disabled') {
          this.notify.warning('Please contact manager', 'Account Disabled',
            {timeOut: 1000 * 2,
              positionClass: 'toast-center-center'
            });
        } else if (errMessage === 'wrong password') {
          this.notify.warning('', 'Wrong Password',
            {timeOut: 1000 * 1.5,
              positionClass: 'toast-center-center'
            });
        } else {
          this.notify.warning('', errMessage,
            {timeOut: 1000 * 1.5,
              positionClass: 'toast-center-center'
            });
        }
      }
    });
  }

  cancel() {
    this.canceled.emit();
    console.log(localStorage);
  }

}
