import {Component, Inject, Input, OnInit} from '@angular/core';
import {Item} from '../models/item';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommentService} from '../comment.service';
import {AddCommentComponent} from '../add-comment/add-comment.component';

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

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(){
    const dialogRef = this.dialog.open(SingleItemDialogComponent,{
      width: '600px',
      data: {item: this.item, isLogin: this.isLogin}
    });

    dialogRef.afterClosed().subscribe();
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
    public dialog: MatDialog) {}

    ngOnInit(){

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addList(){
    // TODO: add list function
  }

  addCart(){
    // TODO: add cart function
  }

  addComment(){
    const dialogRef = this.dialog.open(AddCommentComponent,{
      width: '600px',
      data: {item: this.data.item}
    });

  }

}
