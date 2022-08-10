// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CrudNotifsRulesComponent } from './crudnotifs.component';

// Forms Component
import { MyGestionNotifsRulesTableComponent } from './my-gestion-notifs-rules-table/my-gestion-notifs-rules-table.component';

import { MaterialsModule } from '../../../materials.module';
// Components Routing
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DropdownExportModule } from './../../components/dropdown-export/dropdown-export.module';

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
    DropdownExportModule
  ],
  declarations: [
    CrudNotifsRulesComponent,
    MyGestionNotifsRulesTableComponent
  ]
})
export class GestionNotifsRulesModule { }
