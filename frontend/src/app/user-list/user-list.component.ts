import {Component, Inject, OnInit} from '@angular/core';
import {ListService} from '../list.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {SingleListComponent} from '../single-list/single-list.component';
import {List, ListItem} from '../models/list';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../user.service';

export interface DialogData2 {
  list: List;
  isNew: boolean;
  isOwn: boolean;
  username: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['List Name', 'Description', 'Visibility', 'Operation'];
  showOther: boolean;

  constructor(public dialogRef: MatDialogRef<UserListComponent>,
              private lService: ListService,
              private uService: UserService,
              @Inject(MAT_DIALOG_DATA) public data,
              public dialog: MatDialog,
              private notify: ToastrService) { }

  ngOnInit() {
    this.getLists();
    this.showOther = false;
  }

  get lists() {
    if (this.showOther) {
      return this.lService.sharedList;
    }else {
      return this.lService.lists;
    }
  }

  getLists() {
    this.lService.update();
    this.lService.updateShared();
  }

  addList() {
    const d = this.dialog.open(SingleListComponent, {
      width: '600px',
      data: {list: null, isNew: true}
    });
    d.afterClosed().subscribe((data) => {
      this.getLists();
    });
  }

  show(list: List){
    const d = this.dialog.open(SingleListComponent, {
      width: '600px',
      data: {list: list, isNew: false, isOwn: !this.showOther, username: this.getUserName(list)}
    });
  }

  delete(list: List){
    this.lService.deleteList(list._id).subscribe((data) => {
      this.lService.update();
    });
  }

  addTo(list: List){
    let newItem = new ListItem();
    newItem.itemID = this.data.item._id;
    newItem.itemName = this.data.item.name;
    newItem.quantity = 1;
    newItem.listID = list._id;
    this.lService.postDetail(list._id, newItem).subscribe((data) => {
      if (data.status == '1'){
        this.notify.success('', 'Add',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.dialogRef.close();
      }
    });
  }

  switchBetweenMineAndOthers() {
    this.showOther = !this.showOther;
  }

  getUserName(list: List): string{
    // TODO: 使用user service接收user name
    this.uService.update();
    let username = list.userID;
    for (let user of this.uService.users) {
      if (user._id == list.userID){
        username = user.username;
        break;
      }
    }
    return username;
  }


}
