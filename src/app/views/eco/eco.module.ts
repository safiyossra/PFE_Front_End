import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EcoRoutingModule } from './eco-routing.module';
import { RankComponent } from './rank.component';
import { DetailsComponent } from './details.component';
import { DetailleComponent } from './detaille.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MaterialsModule } from 'src/app/materials.module';
import { TabsModule } from 'ngx-bootstrap/tabs';



import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { MyDataTableComponent } from './my-data-table/my-data-table.component';
import { DropdownExportModule } from './../components/dropdown-export/dropdown-export.module';
import { ModalMapComponent } from './modal-map/map.component';

@NgModule({
  declarations: [
    RankComponent,
    DetailsComponent,
    DetailleComponent,
    MyDataTableComponent,
    ModalMapComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    EcoRoutingModule,
    ButtonsModule.forRoot(),
    MatSelectModule,
    ChartsModule,
    TabsModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),

    DropdownExportModule,
    MaterialsModule,
    MyDateRangePickerModule,
    MyDropdownModule,
    ReactiveFormsModule,
  ]
})
export class EcoModule { }
