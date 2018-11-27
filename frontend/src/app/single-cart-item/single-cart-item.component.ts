import {Component, Input, OnInit} from '@angular/core';
import {CartService} from '../cart.service';
import {Cart} from '../models/cart';

@Component({
  selector: 'app-single-cart-item',
  templateUrl: './single-cart-item.component.html',
  styleUrls: ['./single-cart-item.component.css']
})
export class SingleCartItemComponent implements OnInit {
  @Input() cartItem: Cart;

  constructor(private cartService: CartService) { }

  ngOnInit() {
  }

  add() {
    let quantity = this.cartItem.quantity + 1;
    quantity = quantity < this.cartItem.availableQ ? quantity : this.cartItem.availableQ;
    this.cartService.modifyCartItem(this.cartItem.itemID, quantity).subscribe(data => {
      if (data.status == '1') {this.cartItem.quantity = quantity; }
      this.cartService.update();
    });
  }

  minus() {
    let quantity = this.cartItem.quantity - 1;
    quantity = quantity > 1 ? quantity : 1;
    this.cartService.modifyCartItem(this.cartItem.itemID, quantity).subscribe(data => {
      if (data.status == '1') {this.cartItem.quantity = quantity; }
      this.cartService.update();
    });

  }

  delete() {
    this.cartService.deleteCartItem(this.cartItem.itemID).subscribe(data => {
      if (data.status == '1') {
        this.cartService.update();
      }
    });
  }

}
