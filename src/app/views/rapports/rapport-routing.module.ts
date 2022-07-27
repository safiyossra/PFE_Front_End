import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailleComponent } from './detaille.component';
import { JournalierComponent } from './journalier.component';
import { SynthetiquesComponent } from './synthetiques.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rapport'
    },
    children: [
      {
        path: '',
        redirectTo: 'detaille',
        pathMatch: 'full'
      },
      {
        path: 'detaille',
        component: DetailleComponent,
        data: {
          title: 'Détaillés'
        }
      },
      {
        path: 'journalier',
        component: JournalierComponent,
        data: {
          title: 'Journalier'
        }
      },
      {
        path: 'synthetiques',
        component: SynthetiquesComponent,
        data: {
          title: 'Synthétiques'
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
