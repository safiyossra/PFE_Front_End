import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownExportComponent } from './dropdown-export.component';



@NgModule({
  declarations: [
    DropdownExportComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    DropdownExportComponent, BsDropdownModule
  ]
})
export class DropdownExportModule { }
