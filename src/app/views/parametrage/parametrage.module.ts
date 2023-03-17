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
import {OrderFormModule} from "./order-form/order-form.module";
import { DeliveryNoteModule } from './delivery-note/delivery-note.module';


@NgModule({
  declarations: [
    ParametrageComponent,
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
    OrderFormModule,
    DeliveryNoteModule
  ]
})
export class ParametrageModule { }
