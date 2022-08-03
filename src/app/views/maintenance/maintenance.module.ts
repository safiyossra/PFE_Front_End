import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { SharedModule } from '../components/shared.module';
import { PlanentretienModule } from './planentretien/planentretien.module';
import { GestioncarburantModule } from './gestioncarburant/gestioncarburant.module';

@NgModule({
  declarations: [
    MaintenanceComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    GestioncarburantModule,
    PlanentretienModule,
    SharedModule
  ]
})
export class MaintenanceModule { }
