import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Env } from './env';
import {User} from './models/user';


@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }



  postSignup(newUser: User): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<any>(Env.serverURL + 'signup/', newUser, {headers: headers});

  }

  postResend(email: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<any>(Env.serverURL + 'signup/resend/', {email: email}, {headers: headers});
  }



}
