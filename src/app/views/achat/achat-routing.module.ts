import { AchatComponent } from './achat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { CrudemployeeComponent } from './gestionemployes/crudemployee.component';
import { CrudorderFormComponent } from './order-form/crudorder-form.component';
import { CrudDeliveryNoteComponent } from './delivery-note/crud-delivery-note.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Achat'
    },
    children: [
      {
        path: '',
        component: AchatComponent,
        data: {
          title: ''
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
      },
      {
        path: 'delivery-note',
        component: CrudDeliveryNoteComponent,
        canActivate: [PermissionsGuard],
        data: {
          permissionKey:'Parametrage_Utilisateur',
          title: 'Bon de livraison'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchatRoutingModule { }
