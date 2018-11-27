import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Item} from '../models/item';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommentService} from '../comment.service';
import {AddCommentComponent} from '../add-comment/add-comment.component';
import {CartService} from '../cart.service';
import {ToastrService} from 'ngx-toastr';
import {UserListComponent} from '../user-list/user-list.component';

export interface DialogData {
  item: Item;
  isLogin: boolean;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() isLogin: boolean;
  @Output() e = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(){
    const dialogRef = this.dialog.open(SingleItemDialogComponent,{
      width: '600px',
      data: {item: this.item, isLogin: this.isLogin}
    });

    dialogRef.afterClosed().subscribe((data)=>{
      this.e.emit();
    });
  }
}

@Component({
  selector: 'app-single-item-dialog',
  templateUrl: 'single-item-dialog.html'
})
export class SingleItemDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SingleItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commentService: CommentService,
    public dialog: MatDialog,
    private cartService: CartService,
    private notify: ToastrService) {}

    ngOnInit(){

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addList(){
    // TODO: add list function
    const d = this.dialog.open(UserListComponent,  {
      width: '600px',
      data: {mode: 'add', item: this.data.item}
    });
  }

  addCart(){
    let quantity = 1;
    for (var i = 0; i < this.cartService.cartItems.length; i++) {
      if (this.cartService.cartItems[i].itemID === this.data.item._id) {
        quantity = quantity + this.cartService.cartItems[i].quantity;
      }
    }
    if (typeof this.cartService.cartItems[i] !== 'undefined') {
      if (this.cartService.cartItems[i].availableQ < quantity){
        this.notify.warning('Reach the max quantity', 'Fail',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });
        return;
      }
    }


    this.cartService.modifyCartItem(this.data.item._id, quantity).subscribe(res => {
      if (res.status == 1){
        this.notify.success('',
          'Added',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.cartService.update();
      } else {
        this.notify.warning(res.message, 'Fail',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        if (res.message === 'Login status expired') {
          localStorage.clear();
        }
      }
    });
  }

  addComment(){
    const dialogRef = this.dialog.open(AddCommentComponent,{
      width: '600px',
      data: {item: this.data.item}
    });

  }

}
