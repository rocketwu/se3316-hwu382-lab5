import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../item/item.component';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../cart.service';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {
  displayedColumns: string[] = ['Item', 'Price', 'Quantity', 'Operation'];


  constructor(
    public dialogRef: MatDialogRef<UserCartComponent>,
    private cartService: CartService,
    private notify: ToastrService) {}

  ngOnInit() {

    this.getCartItems();
  }

  getCartItems() {
    this.cartService.getCart().subscribe(data => {
      if (data.status == '0') {
        this.notify.warning(data.message, 'Fail',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        localStorage.clear();
        return;
      }
      this.cartService.cartItems = data;
    });
  }

  buy() {
    this.cartService.buy().subscribe(data => {
      this.cartService.update();
      if (data.status == '1') {
        this.notify.show('', 'Thanks for Buying',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        this.dialogRef.close();
      }
    });
  }

  clear() {
    this.cartService.clearCart().subscribe(data => {
      this.cartService.update();
    })
  }

  get cartItems() {
    return this.cartService.cartItems;
  }

  get totalPrice() :number {
    let price = 0;
    for (let i = 0; i < this.cartItems.length; i++){
      price = price + this.cartItems[i].quantity * this.cartItems[i].itemPrice;
    }
    return price;
  }


}
