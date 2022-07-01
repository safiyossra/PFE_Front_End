import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifRulesRoutingModule } from './notif-rules-routing.module';
import { NotifRulesComponent } from './notif-rules.component';
import { SharedModule } from '../components/shared.module';
// import { MenuCardComponent } from '../components/menu-card/menu-card.component';


@NgModule({
  declarations: [
    NotifRulesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NotifRulesRoutingModule,
    // MenuCardComponent
  ]
})
export class NotifRulesModule { }
