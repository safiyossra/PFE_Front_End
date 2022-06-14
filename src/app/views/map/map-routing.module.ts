import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { MapComponent } from './map.component';
import { ZoneComponent } from './zone/zone.component';
import { ClosestComponent } from './closest/closest.component';

const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    // redirectTo: 'vehicule',
    data: {
      title: 'Map'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'vehicule',
        data: {
          title: 'Par Vehicule'
        },
      },
      {
        path: 'zones',
        component: ZoneComponent,
        data: {
          title: 'Zones'
        }
      },
      {
        path: 'closest',
        component: ClosestComponent,
        data: {
          title: 'Les vehicules les plus proches'
        }
      },
      {
        path: 'vehicule',
        data: {
          title: 'Par Vehicule'
        },
        children: [
          {
            path: '',
            component: MapComponent,
            data: {
              title: 'Par Vehicule'
            }
          },
          {
            path: 'details/:id',
            component: DetailsComponent,
            data: {
              title: 'Details'
            }
          },
        ],
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
