import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Env} from './env';
@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  public policy: string
  constructor(private  http: HttpClient) {
  }

  update() {
    this.getPolicy().subscribe(data => {
      this.policy = data.content;
    });
  }
  getPolicy(): Observable<any> {
    return this.http.get<any>(Env.serverURL + 'policy/');
  }

  putPolicy(data: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(Env.serverURL + 'policy/', {content: data}, {headers: headers});
  }
}
