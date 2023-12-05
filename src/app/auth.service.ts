import { Injectable } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logger = new Subject<boolean>();

  constructor(private appointmentService: AppointmentService) {}

  isLoggedIn(): Observable<boolean> {
    return this.logger;
  }

  loginUserWithFirebaseToken(token: string) {
    try {
      this.appointmentService.login(token).subscribe((data) => {
        localStorage.setItem('token', JSON.stringify({ token: data.data.accessToken }));
        this.authenticateToken(data.data.accessToken);
      });
    } catch (error) {
      console.log('Unable to login with FirebaseToken', error);
    }
  }

  authenticateToken(token: string) {
    try {
      this.appointmentService.authenticate(token).subscribe((data) => {
        this.setLoggedInUser(data.data);
        this.setLoggedInToken(token);
        this.logger.next(true);
      })
    } catch (error) {
      console.log('Unable to authenticate token');
    }
  }

  setLoggedInUser(userData: any): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  setLoggedInToken(token: string): void {
    if (localStorage.getItem('token') !== token) {
      localStorage.setItem('token', token);
    }
  }

  isAuthenticatedUser() {
    const userData: string | null = localStorage.getItem('userData') ? JSON.parse(String(localStorage.getItem('userData'))) : null;
    return {
      isAuthenticated: !!localStorage.getItem('token'),
      userData
    };
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.logger.next(false);
  }
}
