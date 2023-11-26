import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent {

  services: any = [];
  nonSelected = false;
  selected: any = undefined;

  constructor(public dialogRef: MatDialogRef<AddServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.services = data;
    }

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
