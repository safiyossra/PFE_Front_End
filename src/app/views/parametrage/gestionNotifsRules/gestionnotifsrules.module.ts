// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CrudNotifsRulesComponent } from './crudnotifs.component';

// Forms Component
import { MyGestionusersTableComponent } from './my-gestionusers-table/my-gestionusers-table.component';

import { MaterialsModule } from '../../../materials.module';
// Components Routing
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

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
  ],
  declarations: [
    CrudNotifsRulesComponent,
    MyGestionusersTableComponent
  ]
})
export class GestionNotifsRulesModule { }
