import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {List, ListItem} from './models/list';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http: HttpClient) { }

  public lists: List[];

  getOwnList(): Observable<List[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<List[]>(
      Env.serverURL + 'list/own/',
      {headers: headers}
    );
  }

  postOwnList(list: List): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));

    return this.http.post<any>(
      Env.serverURL + 'list/own/',
      list,
      {headers: headers}
    );
  }

  getDetail(id: string): Observable<ListItem[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<ListItem[]>(
      Env.serverURL + 'list/own/' + id,
      {headers: headers}
    );
  }

  postDetail(id: string, item: ListItem): Observable<any>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(
      Env.serverURL + 'list/own/' + id,
      item,
      {headers: headers}
    );
  }

  putList(id: string, list: List): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(
      Env.serverURL + 'list/own/' + id,
      list,
      {headers: headers}
    );
  }

  putItem(lid: string, iid: string, item: ListItem): Observable<any>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(
      Env.serverURL + 'list/own/' + lid + '/' + iid,
      item,
      {headers: headers}
    );
  }

  deleteItem(lid: string, iid: string): Observable<any>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.delete<any>(
      Env.serverURL + 'list/own/' + lid + '/' + iid,
      {headers: headers}
    );
  }

  getPublic(): Observable<List[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<List[]>(
      Env.serverURL + '/public',
      {headers: headers}
    );
  }

  getPublicDetail(id: string): Observable<ListItem[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<ListItem[]>(
      Env.serverURL + 'public/' + id,
      {headers: headers}
    );
  }

}
