import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Cart} from './models/cart';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'bearer ' + localStorage.getItem('token'));

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart[]> {
    return this.http.get<Cart[]>(Env.serverURL + 'cart/', {headers: this.headers});
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(Env.serverURL + 'cart/', {headers: this.headers});
  }

  deleteCartItem(id: string): Observable<any> {
    return this.http.delete<any>(Env.serverURL + 'cart/item/' + id, {headers: this.headers});
  }

  modifyCartItem(id: string, quantity: number): Observable<any> {
    return this.http.put<any>(Env.serverURL + 'cart/item/' + id, {quantity: quantity}, {headers: this.headers});
  }


}
