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
    redirectTo: 'parametrage',
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
        path: 'map',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'rapports',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'eco',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'parametrage',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./views/maintenance/maintenance.module').then(m => m.MaintenanceModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'live-streaming',
        loadChildren: () => import('./views/parametrage/parametrage.module').then(m => m.ParametrageModule)
      },
      {
        path: 'achat',
        loadChildren: () => import('./views/achat/achat.module').then(m => m.AchatModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
