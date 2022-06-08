// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PlanComponent } from './plan.component';

// Forms Component
import { FormsComponent } from './forms.component';

import {MaterialsModule} from '../../materials.module';
// Components Routing
import { PlanentretienRoutingModule } from './planentretien-routing.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    PlanentretienRoutingModule,
    FormsModule,
    MatSelectModule,
    ChartsModule,
    MaterialsModule, MaterialsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  declarations: [
    PlanComponent,
    FormsComponent,
  ]
})
export class PlanentretienModule { }
