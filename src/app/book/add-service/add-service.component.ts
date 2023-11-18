import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent {

  services = [
    { id: 1, name: 'Maquillaje', displayDuration: '1hr', duration: 60, price: 70000 },
    { id: 2, name: 'Maquillaje y peinado', displayDuration: '1hr y 30 min', duration: 90, price: 100000 },
    { id: 3, name: 'Ondas', displayDuration: '40 min', duration: 40, price: 30000 },
    { id: 4, name: 'Lifting de pestañas', displayDuration: '1hr', duration: 60, price: 45000 },
    { id: 5, name: 'Laminado de cejas', displayDuration: '1hr', duration: 60, price: 45000 },
    { id: 6, name: 'Porcelanizacion', displayDuration: '1hr', duration: 60, price: 75000 },
    { id: 7, name: 'Peeling', displayDuration: '1hr', duration: 60, price: 80000 },
    { id: 8, name: 'Alta hidratación', displayDuration: '1hr', duration: 60, price: 50000 },
    { id: 9, name: 'Masaje de relajación', displayDuration: '1hr', duration: 60, price: 60000 },
    { id: 10, name: 'Masaje con piedras', displayDuration: '1hr', duration: 60, price: 75000 },
    { id: 11, name: 'Masaje con bambú', displayDuration: '1hr', duration: 60, price: 75000 },
  ];

  nonSelected = false;
  selected: any = undefined;

  constructor(public dialogRef: MatDialogRef<AddServiceComponent>) {}

  onSelect(value: any): void {
    this.selected = value;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  add(): void {
    if (!this.selected) this.nonSelected = true;
    else this.dialogRef.close(this.selected);
  }
}
