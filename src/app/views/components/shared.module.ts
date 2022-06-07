import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'


// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TabsModule } from 'ngx-bootstrap/tabs';
import { MaterialsModule } from 'src/app/materials.module';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { MyDataTableComponent } from '../components/my-data-table/my-data-table.component';
import { DetailsTableComponent } from '../components/details-table/details-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'
// import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
// import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
// import { MatSelectModule } from '@angular/material/select';
// import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    MenuCardComponent,
    // DetailsTableComponent,

    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    // TabsModule,
    // FormsModule,
    // MatSelectModule,
    // ChartsModule,
    // MaterialsModule,
    // MyDateRangePickerModule, 
    // MyDropdownModule,
    // ReactiveFormsModule,
  ],
  imports: [
    CommonModule,    
    // DetailsTableComponent,
    // MaterialsModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
  ],
  exports: [
    MenuCardComponent,
    // DetailsTableComponent,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    // TabsModule,
    // FormsModule,
    // MatSelectModule,
    // ChartsModule,
    // MaterialsModule,
    // MyDateRangePickerModule,
    // MyDropdownModule,
    // ReactiveFormsModule,
  ]
})
export class SharedModule { }
