import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';
import { SharedModule } from '../components/shared.module';
import { GestionNotifsRulesModule } from './gestionNotifsRules/gestionnotifsrules.module';
import { GroupevehiculesModule } from './groupevehicules/groupevehicules.module';
import { GestioncarburantModule } from './gestioncarburant/gestioncarburant.module';
import { GestiondriverModule } from './gestiondriver/gestiondriver.module';
import { GestionusersModule } from './gestionusers/gestionusers.module';
import { GestionvehiculeModule } from './gestionvehicule/gestionvehicule.module';


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
    GestioncarburantModule,
    GestiondriverModule,
    GestionusersModule,
    GestionvehiculeModule,
  ]
})
export class ParametrageModule { }
