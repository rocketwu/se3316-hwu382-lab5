import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Item} from '../models/item';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommentService} from '../comment.service';
import {AddCommentComponent} from '../add-comment/add-comment.component';
import {CartService} from '../cart.service';
import {ToastrService} from 'ngx-toastr';
import {UserListComponent} from '../user-list/user-list.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../item.service';

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

  name = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.required]);
  sold = new FormControl();
  available = new FormControl();
  detail = new FormControl();
  addItemForm = new FormGroup({
    name: this.name,
    price: this.price,
    sold: this.sold,
    available: this.available,
    detail: this.detail
  });

  constructor(
    public dialogRef: MatDialogRef<SingleItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commentService: CommentService,
    private itemService: ItemService,
    public dialog: MatDialog,
    private cartService: CartService,
    private notify: ToastrService) {}

    ngOnInit(){
      this.name.setValue(this.data.item.name);
      this.price.setValue(this.data.item.price);
      this.available.setValue(this.data.item.available);
      this.detail.setValue(this.data.item.detail);
      this.sold.setValue(this.data.item.sold);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addList(){
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

  get manageMode(): boolean {
    return (localStorage.getItem('manageMode') == 'true');
  }

  deleteItem() {
    this.itemService.deleteItem(this.data.item._id).subscribe((res) => {
      if (res.status == 1){
        this.notify.success('',
          'Deleted',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.itemService.update();
        this.cartService.update();
        this.cancel();
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

  onSubmit() {
    this.data.item.name = this.name.value;
    this.data.item.price = this.price.value;
    this.data.item.available = this.available.value;
    this.data.item.sold = this.sold.value;
    this.data.item.detail = this.detail.value;
    this.itemService.putItem(this.data.item).subscribe((res) => {
      if (res.status == 1){
        this.notify.success('',
          'Updated',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.itemService.update();
        this.cartService.update();
        this.cancel();
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

  cancel() {
    this.onNoClick();
  }



}
