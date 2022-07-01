import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component'
import { PlanComponent } from './planentretien/plan.component';

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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
