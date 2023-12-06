import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'book-payment-transfer-method',
  templateUrl: './payment-transfer-method.component.html',
  styleUrls: ['./payment-transfer-method.component.scss']
})
export class PaymentTransferMethodComponent {

  method: any = null;
  advancePayment!: number;

  methods = [
    {
      id: 'bancolombia',
      name: 'Bancolombia',
      account: '584-177304-92',
      accountType: 'Cuenta de Ahorros',
      logo: '/assets/images/book/bancolombia.png',
      qrCode: '/assets/images/book/qrBancolombia.jpg'
    },
    {
      id: 'nequi',
      name: 'Nequi',
      account: '3122818064',
      accountType: null,
      logo: '/assets/images/book/nequi.png',
      qrCode: '/assets/images/book/qrNequi.jpg'
    }
  ]

  constructor(public dialogRef: MatDialogRef<PaymentTransferMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.method = this.methods.find(x => x.id === data.method);
      this.advancePayment = data.advancePayment;
    }

  close() {
    this.dialogRef.close();
  }

  paid() {
    this.dialogRef.close(true);
  }

}
