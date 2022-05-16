import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { MyDateRangePickerComponent } from './my-daterangepicker.component';
import { MyFormatPipe } from './my-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    // FormsModule
  ],
  declarations: [MyDateRangePickerComponent, MyFormatPipe],
  exports: [MyDateRangePickerComponent, MyFormatPipe]
})
export class MyDateRangePickerModule { }
