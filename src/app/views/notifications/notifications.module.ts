import { RapportModule } from './../rapports/rapport.module';
import { ModalMapComponent } from '../rapports/modal-map/map.component';
import { DropdownExportModule } from './../components/dropdown-export/dropdown-export.module';
// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Alert Component
import { AlertsComponent } from './alerts.component';

// Notifications Routing
import { NotificationsRoutingModule } from './notifications-routing.module';
import { MyDropdownModule } from '../components/my-dropdown/my-dropdown.module';
import { MyDateRangePickerModule } from '../components/my-date-range-picker/my-daterangepicker.module';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyNotificationTableComponent } from './my-notification-table/my- notification-table.component';
import { MaterialsModule } from 'src/app/materials.module';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationsRoutingModule,
    CollapseModule.forRoot(),
    MyDropdownModule,
    MyDateRangePickerModule,
    MaterialsModule,
    DropdownExportModule,
    TabsModule,
    RapportModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    AlertsComponent,
    MyNotificationTableComponent,
  ]
})
export class NotificationsModule { }
