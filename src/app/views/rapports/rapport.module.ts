import { DropdownExportModule } from './../components/dropdown-export/dropdown-export.module';
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DetailleComponent } from './detaille.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { JournalierComponent } from './journalier.component';


// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';


import {MaterialsModule} from 'src/app/materials.module';
// Components Routing
import { RapportRoutingModule } from './rapport-routing.module';
import { DetailsTableComponent } from '../components/details-table/details-table.component';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { MyDataTableComponent } from './my-data-table/my-data-table.component';
import { MyCarburantDataTableComponent } from './my-carburant-data-table/my-carburant-data-table.component';
import { MySynthetiquesTableComponent } from './my-synthetiques-table/my-synthetiques-table.component';
import { ModalMapComponent } from './modal-map/map.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SynthetiquesComponent } from './synthetiques.component';
import { GestionRapportModule } from './gestionrapport/gestionrapport.module';

@NgModule({
  imports: [
    CommonModule,
    RapportRoutingModule,
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    // BsDropdownModule.forRoot(),
    DropdownExportModule,
    TabsModule,
    FormsModule,
    MatSelectModule,
    ChartsModule,
    MaterialsModule,
    ReactiveFormsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    GestionRapportModule,
  ],
  declarations: [
    DetailleComponent,
    JournalierComponent,
    MyDataTableComponent,
    MyCarburantDataTableComponent,
    MySynthetiquesTableComponent,
    SynthetiquesComponent,
    DetailsTableComponent,
    ModalMapComponent
  ],
  exports:[
    ModalMapComponent
  ]
})
export class RapportModule { }
