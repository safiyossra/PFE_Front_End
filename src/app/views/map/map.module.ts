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
// import { TamSplitterComponent } from './../components/tam-splitter/tam-splitter.component';
// import { TamSplitterPanelComponent } from './../components/tam-splitter-panel/tam-splitter-panel.component';
// import { TamSplitterBarComponent } from './../components/tam-splitter-bar/tam-splitter-bar.component';
import { AngularSplitModule } from 'angular-split';


@NgModule({
  declarations: [
    MapComponent,
    MyTableComponent,
    DetailsComponent,
    DropdownCheckboxComponent,
    // TamSplitterComponent,
    // TamSplitterPanelComponent,
    // TamSplitterBarComponent,
    AngularSplitModule,
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
