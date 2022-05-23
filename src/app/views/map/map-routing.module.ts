import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { MapComponent } from './map.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Map'
    },
    children: [
      {
        path: '',
        redirectTo: 'vehicule',
        pathMatch: 'full',
      },
      {
        path: 'vehicule',
        children: [
          {
            path: '',
            children: [
              {
                path: '',
                component: MapComponent,
                data: {
                  title: 'Par Vehicule'
                },
              },
              {
                path: 'details',
                component: DetailsComponent,
                data: {
                  title: 'Details',
                },
              },
            ],

          },
        ],
        data: {
          title: 'Par Vehicule'
        },
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
