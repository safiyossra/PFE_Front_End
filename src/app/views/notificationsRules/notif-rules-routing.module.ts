import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotifRulesComponent } from './notif-rules.component'
import { VitesseNotifRulesComponent } from './vitesse-notif-rules.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Notifications Rules'
    },
    children: [
      {
        path: '',
        component: NotifRulesComponent,
        data: {
          title: ''
        }
      },
      {
        path: 'vitesse',
        component: VitesseNotifRulesComponent,
        data: {
          title: 'Vitesse'
        }
      },
      {
        path: 'zone',
        component: VitesseNotifRulesComponent,
        data: {
          title: 'Zone'
        }
      },
      {
        path: 'carburant',
        component: VitesseNotifRulesComponent,
        data: {
          title: 'Carburant'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifRulesRoutingModule { }
