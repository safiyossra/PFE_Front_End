// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CrudgroupeComponent} from './crudgroupe.component';

// Forms Component
import { MyGroupevehiculesTableComponent} from './my-groupevehicules-table/my-groupevehicules-table.component';

import { MaterialsModule } from '../../materials.module';
// Components Routing
import { GroupevehiculesRoutingModule } from './groupevehicules-routing.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    GroupevehiculesRoutingModule,
    FormsModule,
    MatSelectModule,
    ChartsModule,
    MaterialsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    CrudgroupeComponent,
    MyGroupevehiculesTableComponent
  ]
})
export class GroupevehiculesModule { }