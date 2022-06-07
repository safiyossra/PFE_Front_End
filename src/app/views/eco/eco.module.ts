import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcoRoutingModule } from './eco-routing.module';
import { RankComponent } from './rank/rank.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
// import { MaterialsModule } from 'src/app/materials.module';
import { SharedModule } from '../components/shared.module';


@NgModule({
  declarations: [
    RankComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    EcoRoutingModule,
    ButtonsModule.forRoot(),
    // MaterialsModule,
    SharedModule,
  ]
})
export class EcoModule { }
