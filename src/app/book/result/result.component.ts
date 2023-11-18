import { Component, Input } from '@angular/core';

@Component({
  selector: 'book-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  @Input() result: any = [];

}
