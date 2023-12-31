import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from 'src/model/book';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointmentServiceURL = environment.appointment.url;

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

  availableHours(date: string): Observable<any> {
    const url = `${this.appointmentServiceURL}/book/available`;
    return this.http.post(url, { date });
  }

  availableHoursByType(date: string, type: string, ids: number[]): Observable<any> {
    const url = `${this.appointmentServiceURL}/book/available/type`;
    return this.http.post(url, { date, type, ids });
  }

  allServices(): Observable<any> {
    const url = `${this.appointmentServiceURL}/service`;
    return this.http.get(url);
  }

  sendOTP(phone: string): Observable<any> {
    const url = `${this.appointmentServiceURL}/phone/OTP`;
    return this.http.post(url, { phone });
  }

  verifyOTP(code: string, details: string): Observable<any> {
    const url = `${this.appointmentServiceURL}/verify/OTP`;
    return this.http.post(url, { code, details });
  }

  book(book: Book): Observable<any> {
    const url = `${this.appointmentServiceURL}/book/order`;
    return this.http.post(url, book, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
  }

}
