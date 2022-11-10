import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PneuComponent } from './pneu.component'
import { MyPneuTableComponent } from './my-pneu-table/my-pneu-table.component'
import { SharedModule } from '../../components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DropdownExportModule } from '../../components/dropdown-export/dropdown-export.module';
import { MyDateRangePickerModule } from '../../components/my-date-range-picker/my-daterangepicker.module';
import { MaterialsModule } from 'src/app/materials.module';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    MatSelectModule,
    MaterialsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule
  ],
  declarations: [
    PneuComponent,
    MyPneuTableComponent
  ]
})
export class PneuModule { }
