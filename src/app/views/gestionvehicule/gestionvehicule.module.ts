// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CrudvehiculeComponent } from './crudvehicule.component';

// Forms Component
import { MyGestionvehiculeTableComponent } from './my-gestionvehicule-table/my-gestionvehicule-table.component';

import { MaterialsModule } from '../../materials.module';
// Components Routing
import { GestionvehiculeRoutingModule } from './gestionvehicule-routing.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CommonModule,
    GestionvehiculeRoutingModule,
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
    CrudvehiculeComponent,
    MyGestionvehiculeTableComponent
  ]
})
export class GestionvehiculeModule { }
