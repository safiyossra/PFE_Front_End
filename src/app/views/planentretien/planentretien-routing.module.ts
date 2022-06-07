import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanComponent } from './plan.component';
import { FormsComponent } from './forms.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Plan-Entretien'
    },
    children: [
      {
        path: '',
        redirectTo: 'alert'
      },
      {
        path: 'alert',
        component: PlanComponent,
        data: {
          title: 'Alert'
        }
      },
      {
        path: 'form',
        component: FormsComponent,
        data: {
          title: 'AddPlanEntretien'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanentretienRoutingModule { }
