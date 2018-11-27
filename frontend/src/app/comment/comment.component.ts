import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../models/item';
import {CommentService} from '../comment.service';
import {Comment} from '../models/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() item: Item;
  @Input() isLogin: boolean;

  comments: Comment[];
  visibleComment: Comment[];
  limitedComment: Comment[];

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.visibleComment = [];
    this.limitedComment = [];
    this.getComment();
  }

  getComment() {
    this.commentService.getComment(this.item._id).subscribe(comments => {
      this.comments = comments;
      for (let i = 0; i < this.comments.length; i++) {
        if (!this.comments[i].isVisible) { continue; }
        if (this.limitedComment.length <= 5) {this.limitedComment.push(this.comments[i]); }
        this.visibleComment.push(this.comments[i]);
      }
    });

  }

  getRank(comment: Comment) {
    let r = [];
    for (let i = 0 ; i < 5; i++) {
      r.push((i < comment.rank));
    }
    return r;
  }

}
