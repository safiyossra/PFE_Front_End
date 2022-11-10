import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { SharedModule } from '../components/shared.module';
import { PlanentretienModule } from './planentretien/planentretien.module';
import { GestioncarburantModule } from './gestioncarburant/gestioncarburant.module';
import { PneuModule } from './pneu/pneu.module';
import { MenuCardComponent } from '../components/menu-card/menu-card.component';


@NgModule({
  declarations: [
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaintenanceRoutingModule,
    GestioncarburantModule,
    PlanentretienModule,
    PneuModule,
  ]
})
export class MaintenanceModule { }
