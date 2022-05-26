import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsComponent } from './cards.component';
// import { TablesComponent } from './tables.component';
import { TabsComponent } from './tabs.component';
// import { CollapsesComponent } from './collapses.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rapport'
    },
    children: [
      {
        path: '',
        redirectTo: 'detaille'
      },
      {
        path: 'detaille',
        component: CardsComponent,
        data: {
          title: 'Détaillés'
        }
      },
      {
        path: 'journalier',
        component: TabsComponent,
        data: {
          title: 'Journalier'
        }
      },
      {
        path: 'tabs',
        component: TabsComponent,
        data: {
          title: 'Tabs'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportRoutingModule { }
