import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CruduserComponent } from './cruduser.component';


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
        component: CruduserComponent,
        data: {
          title: 'List Users'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionusersRoutingModule { }
