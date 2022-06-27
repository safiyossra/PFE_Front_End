import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'my-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.scss']
})
export class PointFormComponent implements OnInit, OnChanges {

  // @Input() point: {
  //   latitude: any,
  //   longitude: any,
  // }

  @Input() points: []

  @Input() latitude: FormControl
  @Input() longitude: FormControl


  constructor() {
  }


  ngOnInit(): void {
    // console.log(this.latitude);
    // console.log(this.longitude);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }


  latChange(event: any) {
    // console.log(event.value);

  }

}
