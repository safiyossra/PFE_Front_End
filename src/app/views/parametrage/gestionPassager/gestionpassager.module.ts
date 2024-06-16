import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudpassagerComponent} from './crudpassager.component';
import { PassagerTableComponent} from './passager-table/passager-table.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../../materials.module";
import {MyDropdownModule} from "../../components/my-dropdown/my-dropdown.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {DropdownExportModule} from "../../components/dropdown-export/dropdown-export.module";



@NgModule({
  declarations: [
    CrudpassagerComponent,
    PassagerTableComponent

    
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
export class GestionpassagerModule { }
