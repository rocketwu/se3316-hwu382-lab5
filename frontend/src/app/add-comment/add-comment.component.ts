import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CommentService} from '../comment.service';
import {DialogData} from '../item/item.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../models/comment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {

  title: string;
  content = new FormControl('', [Validators.required]);
  addCommentForm = new FormGroup({
    content: this.content,
  });

  constructor(
    public dialogRef: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commentService: CommentService,
    private notify: ToastrService) {}

  ngOnInit() {
    this.title='Comment for ' + this.data.item.name;
  }

  onSubmit(rate: number) {
    let newComment = new Comment();
    newComment.rank = rate;
    newComment.content = this.content.value;
    newComment.author = localStorage.getItem('username');
    newComment.isVisible = true;
    newComment.itemID = this.data.item._id;
    newComment.authorID = localStorage.getItem('useID');
    this.commentService.postComment(newComment).subscribe(res => {
      if (res.status == 1){
        this.notify.success('',
          'Comment Success',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
      } else {
        this.notify.warning(res.message, 'Comment Fail',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
        if (res.message === 'Login status expired') {
          localStorage.clear();
        }
      }
    });
    this.cancel();
  }

  cancel(){
    this.dialogRef.close();
  }


}
