import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WindowService } from 'src/app/window.service';
import { Auth, signInWithPhoneNumber, RecaptchaVerifier, } from "@angular/fire/auth";
import { AbstractControl, FormControl } from '@angular/forms';
import { AppointmentService } from 'src/app/appointment.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'book-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent {

  windowRef: any;
  @Input() phoneNumber: AbstractControl | null = null;
  code = new FormControl();
  codeSent = false;
  resendCodeTime: string = '';
  invalidCode: boolean = false;
  @Output() verified = new EventEmitter();

  constructor(private win: WindowService, private auth: Auth,
      private appointmentService: AppointmentService, private authService: AuthService) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
  }

  sendLoginCode() {
    this.codeSent = true;
    this.invalidCode = false;
    this.windowRef.recaptchaVerifier = this.windowRef.recaptchaVerifier ?
      this.windowRef.recaptchaVerifier : new RecaptchaVerifier(this.auth, 'recaptcha-container', { size: 'invisible' });

    const formattedPhone = `+57${this.phoneNumber?.value}`
    signInWithPhoneNumber(this.auth, formattedPhone, this.windowRef.recaptchaVerifier)
      .then((result: any) => {
        this.windowRef.confirmationResult = result;
        setTimeout(() => {
          this.resendCodeTimer(1);
        }, 10000);
      })
      .catch((error: any) => console.log('Error sending Login Code', error))
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.code?.value)
      .then((result: any) => {
        this.authService.loginUserWithFirebaseToken(result.user.accessToken);
        this.verified.emit({ firebaseUid: result.user?.uid, accessToken: result.user.accessToken });
      })
      .catch((error: any) => {
        console.log('Error verifying Login Code', error);
        this.invalidCode = true;
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
