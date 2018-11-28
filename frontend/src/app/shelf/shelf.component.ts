import { Component, OnInit } from '@angular/core';
import {ItemService} from '../item.service';
import {Item} from '../models/item';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {

  constructor(private itemService: ItemService) { }

  items: Item[];
  visibleItem: Item[];
  limitedItem: Item[];
  isMore = false;

  ngOnInit() {
    this.getItems();
    this.visibleItem = [];
    this.limitedItem = [];
    this.isMore = false;
  }



  getItems() {
    // TODO: 如何把已经没有available的物品加回到shelf
    this.visibleItem = [];
    this.limitedItem = [];
    this.itemService.getItems().subscribe(data => {
      this.items = data;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].available > 0) {this.visibleItem.push(this.items[i]); }
      }
      this.visibleItem.sort(function (a: Item, b: Item) {
        return (b.sold-a.sold);
      });
      this.limitedItem = this.visibleItem.slice(0, 10);
    });
  }

  showMore(){
    this.getItems();
    this.isMore = true;
  }

  getLogin(){
    return (localStorage.getItem('token'));
  }

}
