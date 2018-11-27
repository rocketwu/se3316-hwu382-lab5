import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Cart} from './models/cart';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {
    this.cartItems=[];
  }

  public cartItems: Cart[];

  getCart(): Observable<Cart[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<Cart[]>(Env.serverURL + 'cart/', {headers: headers});
  }

  update() {
    this.getCart().subscribe(data => {
      this.cartItems = data;
    });
  }

  clearCart(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.delete<any>(Env.serverURL + 'cart/', {headers: headers});
  }

  deleteCartItem(id: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.delete<any>(Env.serverURL + 'cart/item/' + id, {headers: headers});
  }

  modifyCartItem(id: string, quantity: number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(Env.serverURL + 'cart/item/' + id, {quantity: quantity}, {headers: headers});
  }

  buy(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.delete<any>(Env.serverURL + 'cart/buy', {headers: headers});
  }

}
