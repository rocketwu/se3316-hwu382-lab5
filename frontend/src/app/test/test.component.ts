import { Component, OnInit, Input } from '@angular/core';
import {ItemService} from '../item.service';
import {Item} from '../models/item';
import {CartService} from '../cart.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private  testService: ItemService, private cartService: CartService) { }
  ngOnInit(): void {


  }

  onSubmit() {
    this.cartService.modifyCartItem('5bfb9b331b9c672669e85858', 2).subscribe(data => {
      console.log(data);
    });
    this.cartService.getCart().subscribe(data => {
      console.log(data);
    });
  }

}
