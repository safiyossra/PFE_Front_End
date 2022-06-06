import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';
import { SharedModule } from '../components/shared.module';


@NgModule({
  declarations: [
    ParametrageComponent,
  ],
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    SharedModule
  ]
})
export class ParametrageModule { }
