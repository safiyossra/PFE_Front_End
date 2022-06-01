import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';

import { MapRoutingModule } from './map-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MyTableComponent } from './my-table/my-table.component';
import { MaterialsModule } from 'src/app/materials.module';
import { DetailsComponent } from './details/details.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownCheckboxComponent } from './../components/dropdown-checkbox/dropdown-checkbox.component'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EventsTableComponent } from './events-table/events-table.component';


@NgModule({
  declarations: [
    MapComponent,
    MyTableComponent,
    DetailsComponent,
    DropdownCheckboxComponent,
    EventsTableComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    HttpClientModule,
    MaterialsModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule
  ]
})
export class MapModule { }
