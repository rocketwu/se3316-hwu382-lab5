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


  isMore = false;

  ngOnInit() {
    this.itemService.update();
    this.isMore = false;
  }

  get limitedItem(): Item[]{
    return this.itemService.limitedItem;
  }

  get visibleItem(): Item[]{
    return this.itemService.visibleItem;
  }

  get items(): Item[]{
    return this.itemService.items;
  }

  updateData() {
    this.itemService.update();
  }

  showMore(){
    this.updateData();
    this.isMore = true;
  }

  getLogin(){
    return (localStorage.getItem('token'));
  }

  get manageMode(): boolean {
    return (localStorage.getItem('manageMode') == 'true');
  }

}
