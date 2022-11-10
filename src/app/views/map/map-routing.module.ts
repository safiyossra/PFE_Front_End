import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { MapComponent } from './map.component';
import { ZoneComponent } from './zone/zone.component';
import { ClosestComponent } from './closest/closest.component';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { CompareComponent } from './compare/compare.component';

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
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Zones',
          title: 'Zones'
        }
      },
      {
        path: 'closest',
        component: ClosestComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'VehiculesPlusProches',
          title: 'Les vehicules les plus proches'
        }
      },
      {
        path: 'comparer',
        component: CompareComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Map_Comparaison',
          title: 'Comparer deux trajets'
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
            canActivate: [PermissionsGuard],
            data: {
              permissionKey:'Map_Vehicules',
              title: 'Par Vehicule'
            }
          },
          {
            path: 'details/:id',
            component: DetailsComponent,
            canActivate: [PermissionsGuard],
            data: {
              permissionKey:'Map_Vehicules',
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
