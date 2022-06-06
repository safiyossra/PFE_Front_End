import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'
import { DetailsTableComponent } from '../components/details-table/details-table.component';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    MenuCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuCardComponent, DetailsTableComponent, MyDateRangePickerModule, MyDropdownModule, MatSelectModule
  ]
})
export class SharedModule { }
