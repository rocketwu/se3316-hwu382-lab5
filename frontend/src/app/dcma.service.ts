import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Dcma} from './models/dcma';
import {Observable} from 'rxjs';
import {Env} from './env';

@Injectable({
  providedIn: 'root'
})
export class DcmaService {

  constructor(private  http: HttpClient) { }

  postDcma(dcma: Dcma): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<any>(Env.serverURL + 'dcma/', dcma, {headers: headers});
  }

  putDcma(dcma: Dcma): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(Env.serverURL + 'dcma/' + dcma._id, {done: dcma.done}, {headers: headers});
  }

  getDcmas(): Observable<Dcma[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    return this.http.get<Dcma[]>(Env.serverURL + 'dcma/', {headers: headers});
  }
}
