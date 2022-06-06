import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrageComponent } from './parametrage.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paramétrage'
    },
    component: ParametrageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
