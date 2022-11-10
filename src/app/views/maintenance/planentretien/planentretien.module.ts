// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PlanComponent } from './plan.component';

// Forms Component
import { MyPlanentretienaTableComponent } from './my-planentretien-table/my-planentretien-table.component';

import { MaterialsModule } from '../../../materials.module';
// Components Routing
import { MyDateRangePickerModule } from '../../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DropdownExportModule } from './../../components/dropdown-export/dropdown-export.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    ChartsModule,
    MaterialsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule
  ],
  declarations: [
    PlanComponent,
    MyPlanentretienaTableComponent
  ]
})
export class PlanentretienModule { }
