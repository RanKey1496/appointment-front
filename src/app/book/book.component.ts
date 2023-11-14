import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  isServicioDomicilio: boolean = false;
  cantidadPersonas: number = 1;
  horasDisponibles: string[] = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
  ];

  minDate: Date;
  maxDate: Date;

  services = [
    { name: 'Maquillaje', hour: '12:00 PM - 12:40 PM' },
    { name: 'Maquillaje + Peinado', hour: '12:40 PM - 01:40 PM' },
    { name: 'Maquillaje', hour: '01:40 PM - 02:20 PM' }
  ]
  
  constructor() {
    this.minDate = moment().add('1', 'd').toDate();
    this.maxDate = moment().add(15, 'd').toDate();
  }
}
