import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanComponent } from './plan.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: PlanComponent,
        data: {
          title: 'List Plan Entretien'
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
