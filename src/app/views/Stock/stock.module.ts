import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../components/shared.module';
import { StockComponent } from './stock.component';
import { StockRoutingModule } from './Stock-routing.module';
import{GestionStockModule}from'./gestionStock/gestion-stock.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { DropdownExportModule } from '../components/dropdown-export/dropdown-export.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    StockComponent


  ],
  imports: [
    CommonModule,
    SharedModule,
    GestionStockModule,
    StockRoutingModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    DropdownExportModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule




  ]
})



export class StockModule { }