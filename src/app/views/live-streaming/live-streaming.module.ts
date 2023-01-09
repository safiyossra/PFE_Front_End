import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveStramingRoutingModule } from './live-streaming-routing.module';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';
import { SharedModule } from '../components/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [
    LiveStreamingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LiveStramingRoutingModule,
    MyDateRangePickerModule,
    SharedModule,
    MyDropdownModule,
    CollapseModule.forRoot(),
    TabsModule,
  ]
})
export class LiveStreamingModule {


}
