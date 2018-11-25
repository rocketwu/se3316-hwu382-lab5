import { Injectable } from '@angular/core';
import {User} from './models/user';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  postLogin(user: User): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<any>(Env.serverURL + 'login/', user, {headers: headers});

  }
}
