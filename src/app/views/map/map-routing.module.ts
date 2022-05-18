import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Map'
    },
    component: MapComponent,
    children: [
      {
        path: '',
        redirectTo: 'vehicule',
        pathMatch: 'full'
      },
      {
        path: 'vehicule',
        component: MapComponent,
        data: {
          title: 'Par Vehicule'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
