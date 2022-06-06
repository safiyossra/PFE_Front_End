import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcoRoutingModule } from './eco-routing.module';
import { RankComponent } from './rank/rank.component';
import { DetailsComponent } from './details/details.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MaterialsModule } from 'src/app/materials.module';
import { DetailsTableComponent } from '../components/details-table/details-table.component';


@NgModule({
  declarations: [
    RankComponent,
    DetailsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    EcoRoutingModule,
    ButtonsModule.forRoot(),
    MaterialsModule,
  ]
})
export class EcoModule { }
