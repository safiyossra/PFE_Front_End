// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ConsommcarburantComponent} from './consommcarburant.component';

// Forms Component
import { MyGestioncarburantTableComponent} from './my-gestioncarburant-table/my-gestioncarburant-table.component';
 import { MyCarburantmodalTableComponent} from './my-carburantmodal-table/my-carburantmodal-table.component';
import { MaterialsModule } from '../../materials.module';
// Components Routing
import { GestioncarburantRoutingModule } from './gestioncarburant-routing.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CommonModule,
    GestioncarburantRoutingModule,
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
    ConsommcarburantComponent,
    MyGestioncarburantTableComponent,
     MyCarburantmodalTableComponent
  ]
})
export class GestioncarburantModule { }
