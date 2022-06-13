import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudvehiculeComponent } from './crudvehicule.component';


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
        component: CrudvehiculeComponent,
        data: {
          title: 'List Vehicule'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionvehiculeRoutingModule { }
