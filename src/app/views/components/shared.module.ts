import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'
import { TabsModule } from 'ngx-bootstrap/tabs';
@NgModule({
  declarations: [
    MenuCardComponent,
  ],
  imports: [
    CommonModule,
    TabsModule
  ],
  exports: [
    MenuCardComponent,
    TabsModule

  ]
})
export class SharedModule { }
