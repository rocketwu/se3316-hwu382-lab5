import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Item} from './models/item';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  postItem(item: Item): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(Env.serverURL + 'item/', item, {headers: headers});
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(Env.serverURL + 'item/');
  }

  putItem(item: Item): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(Env.serverURL + 'item/' + item._id, item, {headers: headers});
  }

  deleteItem(id): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.delete<any>(Env.serverURL + 'item/' + id, {headers: headers});
  }

  getItem(id): Observable<Item> {
    return this.http.get<Item>(Env.serverURL + 'item/' + id);
  }

}
