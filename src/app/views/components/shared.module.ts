import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'
// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    MenuCardComponent,
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    MenuCardComponent, BsDropdownModule
  ]
})
export class SharedModule { }
