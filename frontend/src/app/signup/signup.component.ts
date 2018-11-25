import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SignupService} from '../signup.service';
import {User} from '../models/user';
import {FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @Output() canceled = new EventEmitter();

  username = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  signUpForm = new FormGroup({
    username: this.username,
    password: this.password
  });
  needResend = false;

  onSubmit() {
    this.signUp();
  }

  constructor(private signupService: SignupService, private notify: ToastrService) { }


  ngOnInit() {
    this.needResend = false;
  }


  signUp() {
    let user = new User();
    user.username = this.signUpForm.value.username;
    user.password = this.signUpForm.value.password;

    this.signupService.postSignup(user).subscribe(res => {
      // console.log(res);
      if (res.status == 1) {
        // Email sent
        this.notify.success('Please go to you Inbox and click verification link', 'Success',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });

        this.canceled.emit();
      } else {
        // Error happens
        let errMessage = res.message;
        this.notify.error(errMessage, 'Fail',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });
        if (errMessage === 'Email verification in process, Want to resend verification Email?') {
          this.needResend = true;
        }
      }
    });
  }

  cancel() {
    this.canceled.emit();
  }

  resend () {
    this.signupService.postResend(this.signUpForm.value.username).subscribe(data => {
      this.notify.info('', data.message,
        {timeOut: 1000 * 1.5,
          positionClass: 'toast-center-center'
        });
      this.cancel();
    });
  }

}
