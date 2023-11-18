import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableHourComponent } from './available-hour.component';

describe('AvailableHourComponent', () => {
  let component: AvailableHourComponent;
  let fixture: ComponentFixture<AvailableHourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableHourComponent]
    });
    fixture = TestBed.createComponent(AvailableHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
