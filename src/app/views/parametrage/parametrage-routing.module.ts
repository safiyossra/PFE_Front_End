import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudNotifsRulesComponent } from './gestionNotifsRules/crudnotifs.component';
import { ParametrageComponent } from './parametrage.component'
import { CruddriverComponent } from './gestiondriver/cruddriver.component';
import { CruduserComponent } from './gestionusers/cruduser.component';
import { CrudvehiculeComponent } from './gestionvehicule/crudvehicule.component';
import { CrudgroupeComponent } from './groupevehicules/crudgroupe.component';
import {PermissionsGuard} from '../../guards/permissions.guard'
import {CrudemployeeComponent} from "./gestionemployes/crudemployee.component";
import {CrudorderFormComponent} from "./order-form/crudorder-form.component";

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
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Alertes',
          title: 'Alerts'
        }
      },
      {
        path: 'gestiondriver',
        component: CruddriverComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Conducteur',
          title: 'Conducteurs'
        }
      },
      {
        path: 'gestionvehicule',
        component: CrudvehiculeComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Vehicules',
          title: 'Vehicules'
        }
      },
      {
        path: 'groupevehicules',
        component: CrudgroupeComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_GroupeVehicules',
          title: 'Groupe Vehicules'
        }
      },
      {
        path: 'gestionusers',
        component: CruduserComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Utilisateur',
          title: 'Utilisateurs'
        }
      },
      {
        path: 'employees',
        component: CrudemployeeComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Utilisateur',
          title: 'Employés'
        }
      },
      {
        path: 'order-form',
        component: CrudorderFormComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Utilisateur',
          title: 'Bon de Commande'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
