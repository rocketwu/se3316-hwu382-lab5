import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Comment} from './models/comment';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  postComment(comment: Comment): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(Env.serverURL + 'comment/' + comment.itemID, comment, {headers: headers});
  }

  getComment(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(Env.serverURL + 'comment/' + id);
  }

  hideComment(comment: Comment): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(Env.serverURL + 'hide/' + comment._id, comment, {headers: headers});
  }
}
