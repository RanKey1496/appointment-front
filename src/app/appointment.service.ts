import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentServiceURL = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  login(token: string): Observable<any> {
    const url = `${this.appointmentServiceURL}/login`;
    return this.http.post(url, { token });
  }

  signUp(user: User): Observable<any> {
    const url = `${this.appointmentServiceURL}/signup`;
    return this.http.post(url, user);
  }

  authenticate(token: string): Observable<any> {
    const url = `${this.appointmentServiceURL}/authenticate`;
    return this.http.post(url, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
