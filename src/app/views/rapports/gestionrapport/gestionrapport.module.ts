// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { GestionRapportComponent } from './gestionrapport.component';

// Forms Component
import { MyGestionRapportTableComponent } from './my-gestionrapport-table/my-gestionrapport-table.component';

import { MaterialsModule } from '../../../materials.module';
// Components Routing
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DropdownExportModule } from '../../components/dropdown-export/dropdown-export.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule
  ],
  declarations: [
    GestionRapportComponent,
    MyGestionRapportTableComponent
  ]
})
export class GestionRapportModule { }
