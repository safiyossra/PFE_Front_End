// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DetailleComponent } from './detaille.component';

// Forms Component
import { FormsComponent } from './forms.component';

import { SwitchesComponent } from './switches.component';
import { TablesComponent } from './tables.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { JournalierComponent } from './journalier.component';


// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CollapsesComponent } from './collapses.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginationsComponent } from './paginations.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PopoversComponent } from './popovers.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ProgressComponent } from './progress.component';

import {MaterialsModule} from 'src/app/materials.module';
// Components Routing
import { RapportRoutingModule } from './rapport-routing.module';
import { DetailsTableComponent } from '../components/details-table/details-table.component';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { MyDataTableComponent } from './my-data-table/my-data-table.component';
import { MySynthetiquesTableComponent } from './my-synthetiques-table/my-synthetiques-table.component';
import { ModalMapComponent } from './modal-map/map.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SynthetiquesComponent } from './synthetiques.component';

@NgModule({
  imports: [
    CommonModule,
    RapportRoutingModule,
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule,
    FormsModule,
    MatSelectModule,
    ChartsModule,
    MaterialsModule,
    ReactiveFormsModule, 
    MyDateRangePickerModule,
    MyDropdownModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    DetailleComponent,
    FormsComponent,
    SwitchesComponent,
    TablesComponent,
    JournalierComponent,
    CollapsesComponent,
    PaginationsComponent,
    PopoversComponent,
    ProgressComponent,
    MyDataTableComponent,
    MySynthetiquesTableComponent,
    SynthetiquesComponent,
    DetailsTableComponent,
    ModalMapComponent
  ]
})
export class RapportModule { }
