import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './menu-card/menu-card.component'
import { FileUploader } from './uplaod-file/upload-file.component'
import { ProgressComponent } from './progress/progress.component'
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DndDirective } from './uplaod-file/dnd.directive';
@NgModule({
  declarations: [
    MenuCardComponent,
    FileUploader,
    DndDirective, 
    ProgressComponent,
  ],
  imports: [
    CommonModule,
    TabsModule,
    AlertModule.forRoot()
  ],
  exports: [
    MenuCardComponent,
    FileUploader,
    ProgressComponent,
    TabsModule,
    AlertModule
  ]
})
export class SharedModule { }
