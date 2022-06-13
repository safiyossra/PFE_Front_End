import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details.component';
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
        data: {
          title: 'Ranking'
        }
      },
      {
        path: 'details',
        component: DetailsComponent,
        data: {
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
