import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudNotifsRulesComponent } from './gestionNotifsRules/crudnotifs.component';
import { ParametrageComponent } from './parametrage.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paramétrage'
    },
    children: [
      {
        path: '',
        component: ParametrageComponent,
        data: {
          title: ''
        }
      },
      {
        path: 'notif-rules',
        component: CrudNotifsRulesComponent,
        data: {
          title: 'Notifications Rules'
        }
      },
      // {
      //   path: 'gestiondriver',
      //   component: CruddriverComponent,
      //   data: {
      //     title: 'Zone'
      //   }
      // },
      // {
      //   path: 'carburant',
      //   component: VitesseNotifRulesComponent,
      //   data: {
      //     title: 'Carburant'
      //   }
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
