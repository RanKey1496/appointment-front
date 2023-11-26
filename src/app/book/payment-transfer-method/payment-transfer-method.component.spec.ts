import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransferMethodComponent } from './payment-transfer-method.component';

describe('PaymentTransferMethodComponent', () => {
  let component: PaymentTransferMethodComponent;
  let fixture: ComponentFixture<PaymentTransferMethodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentTransferMethodComponent]
    });
    fixture = TestBed.createComponent(PaymentTransferMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
