import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component'
import { PlanComponent } from './planentretien/plan.component';
import { ConsommcarburantComponent } from './gestioncarburant/consommcarburant.component';

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
        data: {
          title: 'Plan Entretien'
        }
      },
      {
        path: 'gestioncarburant',
        component: ConsommcarburantComponent,
        data: {
          title: 'Carte Carburant'
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
