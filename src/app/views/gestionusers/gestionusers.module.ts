// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CruduserComponent } from './cruduser.component';

// Forms Component
import { MyGestionusersTableComponent } from './my-gestionusers-table/my-gestionusers-table.component';

import { MaterialsModule } from '../../materials.module';
// Components Routing
import { GestionusersRoutingModule } from './gestionusers-routing.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CommonModule,
    GestionusersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    // MyDateRangePickerModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  declarations: [
    CruduserComponent,
    MyGestionusersTableComponent
  ]
})
export class GestionusersModule { }
