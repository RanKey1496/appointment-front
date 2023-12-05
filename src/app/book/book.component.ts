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
import { ConfirmComponent } from './confirm/confirm.component';
import { PaymentTransferMethodComponent } from './payment-transfer-method/payment-transfer-method.component';
import { MatInput } from '@angular/material/input';
import { MatDatepicker } from '@angular/material/datepicker';
import { Book } from 'src/model/book';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  stepperOrientation: Observable<StepperOrientation>;

  services: any = [];
  addServiceClicked: boolean = false;
  addedServices: any = [];
  addedServicesGrouped: any = [];
  isHomeService: boolean = false;
  minDate: Date = moment().add('1', 'd').toDate();
  maxDate: Date = moment().add(15, 'd').toDate();
  date: Date | null = new Date();
  typeOfRequest: string = 'starts';
  availableHours: string[] = [];
  unavailableHours: boolean = false;
  resultTotal: any;
  selectedHour!: any;
  confirmBookError = false;

  @ViewChild('bookAvailableHours') bookAvailableHours: any;
  scheduleFormGroup = this.formBuilder.group({
    startDate: [Date, Validators.required],
    filled: [false, Validators.requiredTrue]
  });

  @ViewChild(MatStepper) stepper!: MatStepper;
  signUpError: boolean = false;
  userFormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    instagram: ['', [Validators.minLength(4)]],
    phoneVerified: [false, [Validators.requiredTrue]],
    details: ['', [Validators.minLength(1)]],
    privacyAcceptance: [false, [Validators.requiredTrue]]
  });
  user!: { isAuthenticated: boolean, userData: any };

  editable: boolean = true;

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
    });
    this.appointmentService.allServices().subscribe(services => {
      this.services = services.data;
    });
  }

  scrollToView(target: HTMLElement) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
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
      const price = grouped[id].reduce((acc: number, curr: any) => acc + curr.price, 0);
      const value = { id, name: grouped[id][0].name, quantity: grouped[id].length, price };
      result.push(value);
    }
    this.addedServicesGrouped = result;
  }

  getPriceTotal() {
    return this.addedServicesGrouped.reduce((acc: number, curr: any) => acc + curr.price, 0);
  }

  addService() {
    const dialogRef = this.dialog.open(AddServiceComponent, {
      data: this.services
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.availableHours = [];
      this.scheduleFormGroup.patchValue({ startDate: null });
      this.addedServices.push(result);
      if (!this.addServiceClicked) this.addServiceClicked = true;
      this.getServicesGrouped();
      this.resultTotal = null;
    });
  }

  getAvailableHours() {
    try {
      const ids = this.addedServices.map((x: any) => x.id);
      const date: any = this.scheduleFormGroup.get('startDate')!.value;
      this.appointmentService.availableHoursByType(
        moment(date).format(),
        this.typeOfRequest, ids)
      .subscribe((data) => {
        if (data.data.availableHours.length === 0) {
          this.unavailableHours = true;
          this.scheduleFormGroup.get('filled')?.setValue(false);
        } else {
          this.availableHours = data.data.availableHours;
          this.unavailableHours = false;
        }
      });
    } catch (error) {
      console.log('Error in getAvailableHours', error);
    }
  }

  onDateChange() {
    this.getAvailableHours();
    this.resultTotal = null;
  }

  onTypeTapeChange(event: any) {
    if (event.index === 0) {
      this.typeOfRequest = 'starts';
    } else {
      this.typeOfRequest = 'ends';
    }
    this.getAvailableHours();
    this.resultTotal = null;
  }

  generateTotal(duration: number, startDate: any, endDate: any) {
    return {
      name: `${this.addedServices.length} servicio(s)`,
      duration: duration,
      displayDuration: humanizeDuration(duration * 60 * 1000, { language: 'es' }),
      startDate,
      endDate
    };
  }

  showResult(selectedHour: string) {
    const time = moment(selectedHour);
    const date: any = this.scheduleFormGroup.get('startDate')!.value;
    const duration = this.addedServices.reduce((acc: number, curr: any) => acc + curr.duration, 0);
    if (this.typeOfRequest === 'starts') {
      const startDate = moment(date);
      startDate.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: 0
      });
      let endDate = moment(startDate);
      endDate.add(duration, 'minutes');
      this.resultTotal = this.generateTotal(duration, startDate, endDate);
    } else {
      const endDate = moment(date);
      endDate.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: 0
      });
      let startDate = moment(endDate);
      startDate.subtract(duration, 'minutes');
      this.resultTotal = this.generateTotal(duration, startDate, endDate);
    }
    this.scheduleFormGroup.get('filled')?.setValue(true);
    this.selectedHour = time;
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
    this.availableHours = [];
    this.scheduleFormGroup.patchValue({ startDate: null });
    this.getServicesGrouped();
    if (this.addedServices.length === 0) this.addServiceClicked = false;
    this.typeOfRequest = 'starts';
    this.resultTotal = null;
  }

  phoneVerifiedSuccessfully(details: string) {
    this.userFormGroup.patchValue({
      phoneVerified: true,
      details
    });
    this.userFormGroup.get('phone')?.disable();
  }

  putFieldsAsValid() {
  }

  saveNewUser() {
    if (!this.userFormGroup.valid) return;
    this.signUpError = false;

    const user = new User();
    user.name = this.userFormGroup.controls['name'].value!;
    user.phone = `+57${this.userFormGroup.controls['phone'].value!}`;
    user.instagram = this.userFormGroup.controls['instagram'].value!;
    user.details = this.userFormGroup.controls['details'].value!;

    try {
      this.appointmentService.signUp(user).subscribe((data) => {
        if (data.data) {
          this.authService.authenticateToken(data.data);
          this.stepper.next();
        }
      });
    } catch (error) {
      this.signUpError = true;
      console.log('Error in signUp', error);
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.userFormGroup.controls;
    for (const name in controls) {
        if (this.userFormGroup.get(name)?.valid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  saveBookData() {
    const book = new Book();
    book.services = this.addedServices;
    book.hour = this.selectedHour.format();

    this.appointmentService.book(book).subscribe((data) => {
      if (data.data) {
        this.stepper.next();
        this.editable = false;
        this.confirmBookError = false;
      }
    }, (error) => {
      this.confirmBookError = true;
    });
  }

  areYouSure() {
    const dialogRef = this.dialog.open(ConfirmComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('resultado', result)
      if (!result) return;
      this.saveBookData();
    });
  }

  openPaymentTransfer(method: string) {
    const dialogRef = this.dialog.open(PaymentTransferMethodComponent, {
      data: { method }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.sendToWhatsapp();
    })
  }

  sendToWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=573122818064&text=Hola%2C%20mi%20nombre%20es%20%E2%9C%A8Jhon%20Gil%E2%9C%A8%20y%20realic%C3%A9%20el%20pago%20del%20anticipo%20para%20confirmar%20la%20cita%20*123*%20por%20un%20valor%20de%20%2420.000%0AAdjunto%20comprobante%20%E2%9C%85', '_blank');
  }
}
