import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'book-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  continue(): void {
    this.dialogRef.close(true);
  }

}
