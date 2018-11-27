import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../models/user';
import {element} from 'protractor';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['Username', 'IsManager', 'IsDisabled'];

  constructor(private userService: UserService,
              private notify: ToastrService) {
  }

  ngOnInit() {
    this.userService.update();
  }

  get users(): User[] {
    return this.userService.users;
  }

  changeManager(user: User){
    this.userService.putManager(user._id,user).subscribe(data => {
      if (data.status == '0'){
        this.notify.error(data.message, 'Fail',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });
        if (data.message === 'Login status expired') {
          localStorage.clear();
        }
      }
    });
  }

  changeDisabled(user: User){
    this.userService.putDisable(user._id, user).subscribe(data => {
      if (data.status == '0'){
        this.notify.error(data.message, 'Fail',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });
        if (data.message === 'Login status expired') {
          localStorage.clear();
        }
      }
    })
  }
}
