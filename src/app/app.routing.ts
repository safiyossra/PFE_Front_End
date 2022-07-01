import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { BasicGuard } from './guards/basic.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [BasicGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'rapports',
        loadChildren: () => import('./views/rapports/rapport.module').then(m => m.RapportModule)
      },
      {
        path: 'map',
        loadChildren: () => import('./views/map/map.module').then(m => m.MapModule)
      },
      {
        path: 'eco',
        loadChildren: () => import('./views/eco/eco.module').then(m => m.EcoModule)
      },
      {
        path: 'parametrage',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'notif-ruls',
        loadChildren: () => import('./views/notificationsRules/notif-rules.module').then(m => m.NotifRulesModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./views/maintenance/maintenance.module').then(m => m.MaintenanceModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'planentretien',
        loadChildren: () => import('./views/planentretien/planentretien.module').then(m => m.PlanentretienModule)
      },
      {
        path: 'gestionvehicule',
        loadChildren: () => import('./views/gestionvehicule/gestionvehicule.module').then(m => m.GestionvehiculeModule)
      },
      {
        path: 'gestiondriver',
        loadChildren: () => import('./views/gestiondriver/gestiondriver.module').then(m => m.GestiondriverModule)
      },
      {
        path: 'groupevehicules',
        loadChildren: () => import('./views/groupevehicules/groupevehicules.module').then(m => m.GroupevehiculesModule)
      },
      {
        path: 'gestioncarburant',
        loadChildren: () => import('./views/gestioncarburant/gestioncarburant.module').then(m => m.GestioncarburantModule)
      },
      {
        path: 'gestionusers',
        loadChildren: () => import('./views/gestionusers/gestionusers.module').then(m => m.GestionusersModule)
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
