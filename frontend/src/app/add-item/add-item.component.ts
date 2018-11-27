import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {ItemService} from '../item.service';
import {Item} from '../models/item';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<AddItemComponent>,
              private itemService: ItemService,
              private notify: ToastrService) { }

  ngOnInit() {
  }

  onSubmit() {
    let newItem = new Item();
    newItem.name = this.name.value;
    newItem.price = this.price.value;
    newItem.sold = this.sold.value;
    newItem.available = this.available.value;
    newItem.detail = this.detail.value;

    this.itemService.postItem(newItem).subscribe(res => {
        if (res.status == 1){
          this.notify.success('',
            'Add Item Success',
            {timeOut: 1000 * 2,
              positionClass: 'toast-center-center'
            });
          this.cancel();
        } else {
          this.notify.warning(res.message, 'Add Item Fail',
            {timeOut: 1000 * 2,
              positionClass: 'toast-center-center'
            });
          if (res.message === 'Login status expired') {
            localStorage.clear();
          }
        }
    });
  }

  cancel(){
    this.dialogRef.close();
  }
}
