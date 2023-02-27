import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';
import { SharedModule } from '../components/shared.module';
import { GestionNotifsRulesModule } from './gestionNotifsRules/gestionnotifsrules.module';
import { GroupevehiculesModule } from './groupevehicules/groupevehicules.module';
import { GestiondriverModule } from './gestiondriver/gestiondriver.module';
import { GestionusersModule } from './gestionusers/gestionusers.module';
import { GestionvehiculeModule } from './gestionvehicule/gestionvehicule.module';
import {GestionemployesModule} from "./gestionemployes/gestionemployes.module";
import { CrudorderFormComponent } from './order-form/crudorder-form.component';
import { OrderFormTableComponent } from './order-form/order-form-table/order-form-table.component';
import {OrderFormModule} from "./order-form/order-form.module";

@NgModule({
  declarations: [
    ParametrageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParametrageRoutingModule,
    GestionNotifsRulesModule,
    GroupevehiculesModule,
    GestiondriverModule,
    GestionusersModule,
    GestionvehiculeModule,
    GestionemployesModule,
    OrderFormModule
  ]
})
export class ParametrageModule { }
