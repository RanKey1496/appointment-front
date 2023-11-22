import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as humanizeDuration from 'humanize-duration';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddServiceComponent } from './add-service/add-service.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { StepperOrientation } from '@angular/cdk/stepper';
import { User } from 'src/model/user';
import { AppointmentService } from '../appointment.service';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  stepperOrientation: Observable<StepperOrientation>;

  addServiceClicked: boolean = false;
  addedServices: any = [];
  addedServicesGrouped: any = [];
  isHomeService: boolean = false;
  minDate: Date = moment().add('1', 'd').toDate();
  maxDate: Date = moment().add(15, 'd').toDate();
  date: Date | null = new Date();
  availableHours: string[] = [];
  result: any = [];
  resultTotal: any;

  scheduleFormGroup = this.formBuilder.group({
    // startDate: [null, Validators.required]
    startDate: [null]
  });

  @ViewChild(MatStepper) stepper!: MatStepper;
  signUpError: boolean = false;
  userFormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    instagram: [''],
    firebaseUid: [''],
    phoneVerified: [false, [Validators.requiredTrue]],
    privacyAcceptance: [false, [Validators.requiredTrue]]
  });
  firebaseAccessToken!: string;
  user!: { isAuthenticated: boolean, userData: any };

  paymentFormGroup = this.formBuilder.group({

  });

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
    private appointmentService: AppointmentService, private breakPointObserver: BreakpointObserver,
    private authService: AuthService) {
      this.stepperOrientation = breakPointObserver.observe('(min-width: 800px)')
        .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
  }

  ngOnInit() {
    this.user = this.authService.isAuthenticatedUser();
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.user = this.authService.isAuthenticatedUser();
      }
    })
  }

  groupBy(input: any, key: string) {
    if (!input) return;
    return input.reduce((acc: any, currentValue: any) => {
      let groupKey = currentValue[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);
      return acc;
    }, {});
  }

  getServicesGrouped() {
    const grouped = this.groupBy(this.addedServices, 'id');
    const result = [];
    for (const id in grouped) {
      const value = { id, name: grouped[id][0].name, quantity: grouped[id].length }
      result.push(value);
    }
    this.addedServicesGrouped = result;
  }

  addService() {
    const dialogRef = this.dialog.open(AddServiceComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.result = [];
      this.availableHours = [];
      this.scheduleFormGroup.patchValue({ startDate: null });
      this.addedServices.push(result);
      if (!this.addServiceClicked) this.addServiceClicked = true;
      this.getServicesGrouped();
    });
  }

  onDateChange(event: any) {
    console.log('Consultar horas disponibles', event.value)
    try {
      this.appointmentService.availableHours(event.value).subscribe((data) => {
        this.availableHours = data.data.availableHours;
      })
    } catch (error) {
      console.log('Error in onDateChange', error);
    }
    /*this.availableHours = [
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
    ];*/
  }

  showResult(selectedHour: string) {
    const time = moment(selectedHour, 'hh:mm A');
    const startDate = moment(this.date);
    startDate.set({
      hour: time.get('hour'),
      minute: time.get('minute'),
      second: 0
    });
    let lastDate = moment(startDate);
    this.result = this.addedServices.map((s: any) => {
      const startDate = lastDate.toDate();
      const endDate = moment(startDate);
      endDate.add(s.duration, 'minute');
      const result = {
        name: s.name,
        duration: s.duration,
        startDate,
        endDate: endDate.toDate()
      };
      lastDate = endDate;
      return result;
    });
    const totalDuration = this.result.reduce((acc: any, cur: any) => acc + cur.duration, 0)
    this.resultTotal = {
      name: `${this.result.length} servicio(s)`,
      duration: totalDuration,
      displayDuration: humanizeDuration(totalDuration * 60 * 1000, { language: 'es' }),
      startDate,
      endDate: lastDate
    }
  }

  modifyAddedServicesQuantity(data: { event: string, id: number }) {
    const index = this.addedServices.findIndex((x: any) => x.id == data.id);
    if (index === -1) return;
    if (data.event === 'add') {
      this.addedServices.push(this.addedServices[index]);
    }
    if (data.event === 'remove') {
      this.addedServices.splice(index, 1)
    }
    this.result = [];
    this.availableHours = [];
    this.scheduleFormGroup.patchValue({ startDate: null });
    this.getServicesGrouped();
    if (this.addedServices.length === 0) this.addServiceClicked = false;
  }

  phoneVerifiedSuccessfully(data: { firebaseUid: string, accessToken: string }) {
    this.userFormGroup.patchValue({
      phoneVerified: true,
      firebaseUid: data.firebaseUid
    });
    this.userFormGroup.get('phone')?.disable();
    this.firebaseAccessToken = data.accessToken;
  }

  saveNewUser() {
    if (!this.userFormGroup.valid) return;
    this.signUpError = false;

    const user = new User();
    user.name = this.userFormGroup.controls['name'].value!;
    user.phone = `+57${this.userFormGroup.controls['phone'].value!}`;
    user.instagram = this.userFormGroup.controls['instagram'].value!;
    user.firebaseUid = this.userFormGroup.controls['firebaseUid'].value!;

    try {
      this.appointmentService.signUp(user).subscribe((data) => {
        this.stepper.next();
        this.authService.loginUserWithFirebaseToken(this.firebaseAccessToken);
      });
    } catch (error) {
      this.signUpError = true;
      console.log('Error in signUp', error);
    }
  }
}
