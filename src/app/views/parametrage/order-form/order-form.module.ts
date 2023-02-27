import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CrudorderFormComponent} from "./crudorder-form.component";
import {OrderFormTableComponent} from "./order-form-table/order-form-table.component";
import {DropdownExportModule} from "../../components/dropdown-export/dropdown-export.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../../materials.module";
import {NgJsonEditorModule} from "../gestionusers/jsoneditor/jsoneditor.module";
import {MyDropdownModule} from "../../components/my-dropdown/my-dropdown.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {CollapseModule} from "ngx-bootstrap/collapse";



@NgModule({
  declarations: [
    CrudorderFormComponent,
    OrderFormTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    NgJsonEditorModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule,
    ReactiveFormsModule
  ]
})
export class OrderFormModule { }
