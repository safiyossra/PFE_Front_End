import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CruddriverComponent } from './cruddriver.component';


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
        component: CruddriverComponent,
        data: {
          title: 'List des Conducteurs'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestiondriverRoutingModule { }
