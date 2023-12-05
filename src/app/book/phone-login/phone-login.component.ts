import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WindowService } from 'src/app/window.service';
import { AbstractControl, FormControl } from '@angular/forms';
import { AppointmentService } from 'src/app/appointment.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'book-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent {

  @Input() phoneNumber: AbstractControl | null = null;
  code = new FormControl();
  codeSent = false;
  resendCodeTime: string = '';
  invalidCode: boolean = false;
  @Output() verified = new EventEmitter();
  details: string = '';

  constructor(private win: WindowService, private appointmentService: AppointmentService,
    private authService: AuthService) { }

  sendLoginCode() {
    this.codeSent = true;
    this.invalidCode = false;
    this.code.setValue('');

    const formattedPhone = `+57${this.phoneNumber?.value}`;

    try {
      this.appointmentService.sendOTP(formattedPhone).subscribe((data) => {
        this.details = data.data;
      });
    } finally {
      setTimeout(() => {
        this.resendCodeTimer(1);
      }, 10000);
    }
  }

  verifyLoginCode() {
    this.codeSent = true;
    this.appointmentService.verifyOTP(this.code.value, this.details).subscribe((data) => {
      if (data.data !== null) {
        this.authService.authenticateToken(data.data);
      }
      this.invalidCode = false;
      this.verified.emit(this.details);
    }, (error) => {
      this.codeSent = true;
      this.invalidCode = true;
      this.code.setValue('');
    });
  }

  resendCodeTimer(minute: number) {
    this.codeSent
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;

      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else {
        textSec = statSec;
      }

      this.resendCodeTime = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        clearInterval(timer);
        this.codeSent = false;
        this.resendCodeTime = '';
      }
    }, 1000);
  }

}
