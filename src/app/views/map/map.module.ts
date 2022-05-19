import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';

import { MapRoutingModule } from './map-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MyTableComponent } from '../components/my-table/my-table.component';
import { MaterialsModule } from 'src/app/materials.module';


@NgModule({
  declarations: [
    MapComponent,
    MyTableComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    HttpClientModule,
    MaterialsModule,
  ]
})
export class MapModule { }
