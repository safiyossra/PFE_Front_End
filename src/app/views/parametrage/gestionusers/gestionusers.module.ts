// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CruduserComponent } from './cruduser.component';

// Forms Component
import { MyGestionusersTableComponent } from './my-gestionusers-table/my-gestionusers-table.component';

import { MaterialsModule } from '../../../materials.module';
// Components Routing
import { MyDropdownModule } from '../../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DropdownExportModule } from './../../components/dropdown-export/dropdown-export.module';
import { NgJsonEditorModule } from './jsoneditor/jsoneditor.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    NgJsonEditorModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule
  ],
  declarations: [
    CruduserComponent,
    MyGestionusersTableComponent
  ]
})
export class GestionusersModule { }
