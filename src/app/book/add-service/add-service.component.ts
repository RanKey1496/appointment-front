import { Component, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent {

  services: any = [];
  nonSelected = false;
  selected: any = undefined;

  @ViewChild('select') selectService!: MatSelect;

  constructor(public dialogRef: MatDialogRef<AddServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef) {
      this.services = data;
    }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.selectService) {
        this.selectService.open();
        this.changeRef.detectChanges();
      }
    }, 500)
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
