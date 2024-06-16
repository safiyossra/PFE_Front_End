import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudStockComponent } from './gestionStock/crud-stock.component';
import { StockComponent } from './stock.component'
import {PermissionsGuard} from '../../guards/permissions.guard';
import { TabsModule } from 'ngx-bootstrap/tabs';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Stock'
    },
    children: [
      {
        path: '',
        component: StockComponent,
        data: {
          title: ''
        }
      },
      {
      path: 'gestionStock',
      component: CrudStockComponent ,
      canActivate: [PermissionsGuard],
      data: {
        permissionKey:'Stock',
        title: 'Stock',
      }
    },




    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }