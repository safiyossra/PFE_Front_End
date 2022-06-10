// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CruddriverComponent} from './cruddriver.component';

// Forms Component
import { MyGestiondriverTableComponent} from './my-gestiondriver-table/my-gestiondriver-table.component';

import { MaterialsModule } from '../../materials.module';
// Components Routing
import { GestiondriverRoutingModule } from './gestiondriver-routing.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CommonModule,
    GestiondriverRoutingModule,
    FormsModule,
    MatSelectModule,
    ChartsModule,
    MaterialsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  declarations: [
    CruddriverComponent,
    MyGestiondriverTableComponent
  ]
})
export class GestiondriverModule { }
