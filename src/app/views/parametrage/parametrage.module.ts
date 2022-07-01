import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';
import { SharedModule } from '../components/shared.module';
import { GestionNotifsRulesModule } from './gestionNotifsRules/gestionnotifsrules.module';


@NgModule({
  declarations: [
    ParametrageComponent,
  ],
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    SharedModule,
    GestionNotifsRulesModule,
  ]
})
export class ParametrageModule { }
