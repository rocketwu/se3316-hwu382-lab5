import {Component, Inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {UserCartComponent} from './user-cart/user-cart.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserComponent} from './user/user.component';
import {AddItemComponent} from './add-item/add-item.component';
import {PolicyComponent} from './policy/policy.component';
import {DcmaComponent} from './dcma/dcma.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Huiyuan\'s Lab 5';
  showSignUp = false;
  showLogin = false;

  constructor(private notify: ToastrService, public dialog: MatDialog) {

  }

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

  clickAbout() {
    this.dialog.open(AboutComponent, {
      width: '600px'
    });
  }

  clickCart() {
    const d = this.dialog.open(UserCartComponent, {
      width: '600px'
    });
    d.afterClosed().subscribe((data) => {

    });
  }

  clickList() {
    const d = this.dialog.open(UserListComponent,  {
      width: '600px',
      data: {mode: 'show'}
    });
  }

  clickDcma() {
    const d = this.dialog.open(DcmaComponent, {
      width: '600px'
    });
  }

  get isLoggedIn() {
    return (localStorage.getItem('token'));
  }
  get isManager(): boolean {
    return (localStorage.getItem('isManager') == 'true');
  }
  get manageMode(): boolean {
    return (localStorage.getItem('manageMode') == 'true');
  }

  clickManage() {
    if (this.manageMode) {
      localStorage.setItem('manageMode', 'false');
    } else {
      localStorage.setItem('manageMode', 'true');
    }
  }
  clickUser() {
    const d = this.dialog.open(UserComponent,  {
      width: '600px',
      data: {mode: 'show'}
    });
  }

  clickAddItem() {
    const d = this.dialog.open(AddItemComponent,  {
      width: '600px'
    });
  }

  clickPolicy() {
    const d = this.dialog.open(PolicyComponent, {
      width: '600px'
    });
  }
}

@Component({
  selector: 'app-about',
  templateUrl: 'about.html'
})
export class AboutComponent {

  constructor(
    public dialogRef: MatDialogRef<AboutComponent>) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

}
