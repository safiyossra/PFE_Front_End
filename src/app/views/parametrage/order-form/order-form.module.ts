import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CrudorderFormComponent} from "./crudorder-form.component";
import {OrderFormTableComponent} from "./order-form-table/order-form-table.component";
import {DropdownExportModule} from "../../components/dropdown-export/dropdown-export.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../../materials.module";
import {MyDropdownModule} from "../../components/my-dropdown/my-dropdown.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {MatSelectModule} from "@angular/material/select";
import {ChartsModule} from "ng2-charts";
import {MyDateRangePickerModule} from "../../components/my-date-range-picker/my-daterangepicker.module";



@NgModule({
  declarations: [
    CrudorderFormComponent,
    OrderFormTableComponent,
  ],
    imports: [
      CommonModule,
      FormsModule,
      MatSelectModule,
      ChartsModule,
      MaterialsModule,
      MyDateRangePickerModule,
      MyDropdownModule,
      ReactiveFormsModule,
      ModalModule.forRoot(),
      CollapseModule.forRoot(),
      DropdownExportModule
    ]
})
export class OrderFormModule { }
