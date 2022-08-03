import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudNotifsRulesComponent } from './gestionNotifsRules/crudnotifs.component';
import { ParametrageComponent } from './parametrage.component'
import { CruddriverComponent } from './gestiondriver/cruddriver.component';
import { CruduserComponent } from './gestionusers/cruduser.component';
import { CrudvehiculeComponent } from './gestionvehicule/crudvehicule.component';
import { CrudgroupeComponent } from './groupevehicules/crudgroupe.component';

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
          title: 'Alerts'
        }
      },
      {
        path: 'gestiondriver',
        component: CruddriverComponent,
        data: {
          title: 'Conducteurs'
        }
      },
      {
        path: 'gestionvehicule',
        component: CrudvehiculeComponent,
        data: {
          title: 'Vehicules'
        }
      },
      {
        path: 'groupevehicules',
        component: CrudgroupeComponent,
        data: {
          title: 'Groupe Vehicules'
        }
      },
      {
        path: 'gestionusers',
        component: CruduserComponent,
        data: {
          title: 'Utilisateurs'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
