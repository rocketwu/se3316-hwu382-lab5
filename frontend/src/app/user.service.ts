import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './models/user';
import {Observable} from 'rxjs';
import {Env} from './env';
@Injectable({
  providedIn: 'root'
})
export class UserService {User;

  constructor(private http: HttpClient) {
    this.update();
  }

  public users: User[];

  update() {
    this.getUsers().subscribe((data) => {
      this.users = data;
      for (const user of this.users) {
        user.password = null;
      }
    });
  }

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<User[]>(
      Env.serverURL + 'user/',
      {headers: headers}
    );
  }

  putManager(id: string, user: User): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(
      Env.serverURL + 'user/manager/' + id,
      {isManager: user.isManager},
      {headers: headers}
    );
  }

  putDisable(id: string, user: User): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(
      Env.serverURL + 'user/disable/' + id,
      {isDisabled: user.isDisabled},
      {headers: headers}
    );
  }

}
