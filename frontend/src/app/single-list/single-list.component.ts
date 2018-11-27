import {Component, Inject, Input, OnInit} from '@angular/core';
import {List, ListItem} from '../models/list';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../item/item.component';
import {DialogData2} from '../user-list/user-list.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ListService} from '../list.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-single-list',
  templateUrl: './single-list.component.html',
  styleUrls: ['./single-list.component.css']
})
export class SingleListComponent implements OnInit {
  displayedColumns: string[] = ['Item', 'Quantity', 'Operation'];
  items: ListItem[];

  name = new FormControl('', [Validators.required]);
  description = new FormControl('');
  myForm = new FormGroup({
    name: this.name,
    description: this.description
  });
  isPublic: boolean;

  constructor(public dialogRef: MatDialogRef<SingleListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData2,
              private lServer: ListService,
              private notify: ToastrService) { }

  ngOnInit() {
    if (!this.data.isNew){
      this.name.setValue(this.data.list.name);
      this.description.setValue(this.data.list.description);
      this.isPublic = this.data.list.isPublic;
      if (this.data.isOwn){
        this.getItems();
      } else {
        this.getPublicItems();
      }
    }

  }

  onSubmit(){
    let newList = new List();
    newList.description = this.description.value;
    newList.name = this.name.value;
    newList.isPublic = this.isPublic;
    newList.userID = localStorage.getItem('userID');
    this.lServer.postOwnList(newList).subscribe(data => {
      if (data.status == '1') {
        this.notify.success('', 'Add',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.cancel();
      }else {
        this.notify.warning(data.message, 'Fail',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
      }
    });
  }

  cancel(){
    this.dialogRef.close();
  }

  updateList() {
    let list = this.data.list;
    list.description = this.description.value;
    list.name = this.name.value;
    list.isPublic = this.isPublic;

    this.lServer.putList(list._id, list).subscribe(data => {
      if (data.status == '1') {
        this.notify.success('', 'Update',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.cancel();
      }else {
        this.notify.warning(data.message, 'Fail',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
      }
    });
  }

  getItems(){
    this.lServer.getDetail(this.data.list._id).subscribe((data) => {
      this.items = data;
    });
  }

  addItem(item: ListItem) {
    item.quantity = item.quantity + 1;
    this.lServer.putItem(this.data.list._id, item.itemID, item).subscribe();
  }

  minusItem(item: ListItem) {
    item.quantity = item.quantity - 1;
    item.quantity = item.quantity > 0 ? item.quantity : 1;
    this.lServer.putItem(this.data.list._id, item.itemID, item).subscribe();
  }

  deleteItem(item: ListItem) {
    this.lServer.deleteItem(this.data.list._id, item.itemID).subscribe((data) => {
      this.getItems();
    });
  }

  private getPublicItems() {
    this.lServer.getPublicDetail(this.data.list._id).subscribe((data) => {
      this.items = data;
    });
  }
}
