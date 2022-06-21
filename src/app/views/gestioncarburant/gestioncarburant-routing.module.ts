import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsommcarburantComponent } from './consommcarburant.component';


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
        component: ConsommcarburantComponent,
        data: {
          title: 'Consommation Carburant'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioncarburantRoutingModule { }
