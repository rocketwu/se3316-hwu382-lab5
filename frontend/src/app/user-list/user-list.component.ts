import {Component, Inject, OnInit} from '@angular/core';
import {ListService} from '../list.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {SingleListComponent} from '../single-list/single-list.component';
import {List, ListItem} from '../models/list';
import {ToastrService} from 'ngx-toastr';

export interface DialogData2 {
  list: List;
  isNew: boolean;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['List Name', 'Description', 'Visibility', 'Operation'];

  constructor(public dialogRef: MatDialogRef<UserListComponent>,
              private lService: ListService,
              @Inject(MAT_DIALOG_DATA) public data,
              public dialog: MatDialog,
              private notify: ToastrService) { }

  ngOnInit() {
    this.getLists();
  }

  get lists() {
    return this.lService.lists;
  }

  getLists() {
    this.lService.update();
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
      data: {list: list, isNew: false}
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

}
