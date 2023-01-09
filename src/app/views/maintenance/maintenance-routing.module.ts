import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component'
import { PlanComponent } from './planentretien/plan.component';
import { ConsommcarburantComponent } from './gestioncarburant/consommcarburant.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { PneuComponent } from './pneu/pneu.component';
import { AccidentsComponent } from './accidents/accidents.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maintenance'
    },
    children: [
      {
        path: '',
        component: MaintenanceComponent,
        data: {
          title: ''
        }
      },
      {
        path: 'planentretien',
        component: PlanComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Maintenance_PlanEntretien',
          title: 'Plan Entretien'
        }
      },
      {
        path: 'gestioncarburant',
        component: ConsommcarburantComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Maintenance_Consommation',
          title: 'Carte Carburant'
        }
      },
      {
        path: 'pneu',
        component: PneuComponent,
        data: {
          title: 'Pneu'
        }
      },
      {
        path: 'accidents',
        component: AccidentsComponent,
        data: {
          title: 'Accidents'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
