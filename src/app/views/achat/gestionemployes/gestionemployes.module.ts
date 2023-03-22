import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudemployeeComponent } from './crudemployee.component';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../../materials.module";
import {MyDropdownModule} from "../../components/my-dropdown/my-dropdown.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {DropdownExportModule} from "../../components/dropdown-export/dropdown-export.module";



@NgModule({
  declarations: [
    CrudemployeeComponent,
    EmployeesTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    MyDropdownModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    DropdownExportModule,
    ReactiveFormsModule
  ]
})
export class GestionemployesModule { }
