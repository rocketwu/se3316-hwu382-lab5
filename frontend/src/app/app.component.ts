import {Component, Inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {DialogData, SingleItemDialogComponent} from './item/item.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommentService} from './comment.service';
import {AddCommentComponent} from './add-comment/add-comment.component';
import {UserCartComponent} from './user-cart/user-cart.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserComponent} from './user/user.component';

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
    localStorage.setItem('manageMode','false');
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
      // TODO: 不完美处理另外一个todo的问题（item 的数量）
      window.location.reload();
    });
  }

  clickList() {
    const d = this.dialog.open(UserListComponent,  {
      width: '600px',
      data: {mode: 'show'}
    });
  }

  get isLoggedIn() {
    return (localStorage.length > 0);
  }
  get isManager(): boolean {
    return (localStorage.getItem('isManager') == 'true');
  }
  get manageMode(): boolean {
    return (localStorage.getItem('manageMode') == 'true');
  }

  clickManage() {
    if (this.manageMode){
      localStorage.setItem('manageMode','false');
    } else {
      localStorage.setItem('manageMode','true');
    }
  }
  clickUser() {
    const d = this.dialog.open(UserComponent,  {
      width: '600px',
      data: {mode: 'show'}
    });
  }

  clickAddItem() {
    
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
