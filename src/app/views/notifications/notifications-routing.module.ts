import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertsComponent } from './alerts.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Notifications'
    },
    children: [
      {
        path: '',
        redirectTo: 'alerts'
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        data: {
          title: 'Alerts'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {}
