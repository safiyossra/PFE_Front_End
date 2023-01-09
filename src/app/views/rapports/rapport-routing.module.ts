import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';

import { DetailleComponent } from './detaille.component';
import { GestionRapportComponent } from './gestionrapport/gestionrapport.component';
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
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Rapports_RapportsDetailles',
          title: 'Détaillés'
        }
      },
      {
        path: 'journalier',
        component: JournalierComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Rapports_RapportsJournalier',
          title: 'Journalier'
        }
      },
      {
        path: 'synthetiques',
        component: SynthetiquesComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Rapports_RapportSynthetique',
          title: 'Synthétiques'
        }
      },
      {
        path: 'automatique',
        component: GestionRapportComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Rapports_RapportAutomatique',
          title: 'Automatique'
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
