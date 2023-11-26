import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'book-available-hour',
  templateUrl: './available-hour.component.html',
  styleUrls: ['./available-hour.component.scss']
})
export class AvailableHourComponent {

  @Input() availableHours: string[] | null = null;
  @Input() nonSelected: boolean = false;
  @Output() tabChanged = new EventEmitter();
  @Output() showResult = new EventEmitter();

  hourIndexClicked: number | null = null;

  hourClicked(value: any, index: number) {
    this.hourIndexClicked = index;
    this.showResult.emit(value)
  }

  tabSelected($event: any) {
    this.tabChanged.emit($event);
    this.hourIndexClicked = null;
  }

}
