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
import { ZoneComponent } from './zone/zone.component';
import { MatIconModule } from '@angular/material/icon';
import { PointFormComponent } from './zone/point-form/point-form.component';
import { AngularSplitModule } from "angular-split";
import { TabsModule } from 'ngx-bootstrap/tabs';

 
@NgModule({
  declarations: [
    MapComponent,
    MyTableComponent,
    DetailsComponent,
    DropdownCheckboxComponent,
    EventsTableComponent,
    ZoneComponent,
    PointFormComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    HttpClientModule,
    MaterialsModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    // BsDropdownModule,
    BsDropdownModule.forRoot(),
    MatIconModule,
    AngularSplitModule,
    TabsModule

  ]
})
export class MapModule { }
