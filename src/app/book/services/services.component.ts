import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'book-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {

  @Input() services: any[] | null = null;
  @Output() addService = new EventEmitter();
  @Output() isHomeService = new EventEmitter();
  @Output() quantityModified = new EventEmitter();

  isHomeServiceCheck = new FormControl({ value: false, disabled: true });

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit() {
    setTimeout(() => {
      this._snackBar.open('¡Para domicilios comunicate por Whatsapp para más información!', 'OK', {
        duration: 8000
      })
    }, 2000);
  }

  ngOnChanges() {
    this.isHomeServiceChange();
  }

  isHomeServiceChange() {
    this.isHomeService.emit(this.isHomeServiceCheck.value);

    const result = this.services?.reduce((acc, cur) => acc + cur.quantity, 0) > -1;
    if (result) {
      this.isHomeServiceCheck.patchValue(false);
      this.isHomeServiceCheck.disable();
    } else {
      this.isHomeServiceCheck.enable();
    }
  }

  modifyQuantity(event: string, serviceId: number) {
    this.quantityModified.emit({ event, id: serviceId });
  }

}
