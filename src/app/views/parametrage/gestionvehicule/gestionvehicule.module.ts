import { RouterModule } from '@angular/router';
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CrudvehiculeComponent } from './crudvehicule.component';

// Forms Component
import { MyGestionvehiculeTableComponent } from './my-gestionvehicule-table/my-gestionvehicule-table.component';

import { MaterialsModule } from '../../../materials.module';
// Components Routing
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DropdownExportModule } from '../../components/dropdown-export/dropdown-export.module';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    // MyDateRangePickerModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CrudvehiculeComponent,
    MyGestionvehiculeTableComponent
  ]
})
export class GestionvehiculeModule { }
