import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'
import { MaterialsModule } from 'src/app/materials.module';


@NgModule({
  declarations: [
    MenuCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuCardComponent, MaterialsModule
  ]
})
export class SharedModule { }
