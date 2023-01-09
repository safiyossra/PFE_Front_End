import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { DetailleComponent } from './detaille.component';
import { RankComponent } from './rank.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Eco-Conduite'
    },
    children: [
      {
        path: '',
        redirectTo: 'rank'
      },
      {
        path: 'rank',
        component: RankComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Eco_EcoConduite',
          title: 'Ranking'
        }
      },
      {
        path: 'details',
        component: DetailleComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Eco_EcoDetailles',
          title: 'Details'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcoRoutingModule { }
