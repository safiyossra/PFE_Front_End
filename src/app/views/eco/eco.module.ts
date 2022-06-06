import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcoRoutingModule } from './eco-routing.module';
import { RankComponent } from './rank/rank.component';
import { DetailsComponent } from './details/details.component';


@NgModule({
  declarations: [
    RankComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    EcoRoutingModule
  ]
})
export class EcoModule { }
