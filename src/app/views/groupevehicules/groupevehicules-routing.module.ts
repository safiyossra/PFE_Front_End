import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudgroupeComponent } from './crudgroupe.component';


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
        component: CrudgroupeComponent,
        data: {
          title: 'Groupe de vehicules'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupevehiculesRoutingModule { }
