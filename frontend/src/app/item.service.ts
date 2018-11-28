import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Item} from './models/item';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class ItemService {



  constructor(private http: HttpClient) {

  }

  public items: Item[];
  public visibleItem: Item[];
  public limitedItem: Item[];

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

  update() {
    this.getItems().subscribe(data => {
      this.visibleItem=[];
      this.limitedItem=[];
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

}
