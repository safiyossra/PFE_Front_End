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
// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [
    ParametrageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParametrageRoutingModule,
    GestionNotifsRulesModule,
    BsDropdownModule.forRoot(),
    GroupevehiculesModule,
    GestiondriverModule,
    GestionusersModule,
    GestionvehiculeModule,
  ]
})
export class ParametrageModule { }
