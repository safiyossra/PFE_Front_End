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
import { ClosestComponent } from './closest/closest.component';
import { PlannerComponent } from './trajetPlanner/planner.component';
import { TrackComponent } from './track/track.component';
import { CompareComponent } from './compare/compare.component';
import { MatIconModule } from '@angular/material/icon';
import { PointFormComponent } from './zone/point-form/point-form.component';
import { AngularSplitModule } from "angular-split";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MyPlacesDropdownModule } from './my-places-dropdown/my-places-dropdown.module';
import { ModalResizableModule } from './resizable-draggable/modal/modal-module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';
import { PopoverModule  } from 'ngx-bootstrap/popover';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { MapTimeLineComponent } from './maptimeline/mapTimeLine.component';

 
@NgModule({
  declarations: [
    MapComponent,
    MyTableComponent,
    DetailsComponent,
    DropdownCheckboxComponent,
    EventsTableComponent,
    ZoneComponent,
    TrackComponent,
    CompareComponent,
    ClosestComponent,
    PlannerComponent,
    PointFormComponent,
    MapTimeLineComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    HttpClientModule,
    MaterialsModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MyDropdownModule,
    // BsDropdownModule,
    BsDropdownModule.forRoot(),
    MyDateRangePickerModule,
    MatIconModule,
    AngularSplitModule,
    TabsModule,
    MyPlacesDropdownModule,
    ModalModule.forRoot(), 
    PopoverModule.forRoot(),
    ModalResizableModule,
    SortableModule.forRoot(),
  ]
})
export class MapModule { }
