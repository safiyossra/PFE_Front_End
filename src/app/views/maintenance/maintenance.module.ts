import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { SharedModule } from '../components/shared.module';

@NgModule({
  declarations: [
    MaintenanceComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    SharedModule
  ]
})
export class MaintenanceModule { }
