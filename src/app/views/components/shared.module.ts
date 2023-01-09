import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
@NgModule({
  declarations: [
    MenuCardComponent,
  ],
  imports: [
    CommonModule,
    TabsModule,
    AlertModule.forRoot()
  ],
  exports: [
    MenuCardComponent,
    TabsModule,
    AlertModule
  ]
})
export class SharedModule { }
