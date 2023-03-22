import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchatRoutingModule } from './achat-routing.module';
import { AchatComponent } from './achat.component';
import { SharedModule } from '../components/shared.module';
import { GestionemployesModule } from './gestionemployes/gestionemployes.module';
import { OrderFormModule } from './order-form/order-form.module';
import { DeliveryNoteModule } from './delivery-note/delivery-note.module';


@NgModule({
  declarations: [
    AchatComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AchatRoutingModule,
    GestionemployesModule,
    OrderFormModule,
    DeliveryNoteModule
  ]
})
export class AchatModule { }
