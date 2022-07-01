import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudNotifsRulesComponent } from './crudnotifs.component';


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
        component: CrudNotifsRulesComponent,
        data: {
          title: 'List Notifications Rules'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionNotifsRulesRoutingModule { }
