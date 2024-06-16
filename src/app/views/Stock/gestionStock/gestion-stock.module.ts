import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudStockComponent} from './crud-stock.component';
import { StockTableComponent} from './stock-table/stock-table.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../../materials.module";
import {MyDropdownModule} from "../../components/my-dropdown/my-dropdown.module";
import {ModalModule} from "ngx-bootstrap/modal";
import{BonCommandeComponent}from "./bon-commande/bon-Commande.component";
import { TabsModule } from 'ngx-bootstrap/tabs';
import {CollapseModule} from "ngx-bootstrap/collapse";
import { MyDateRangePickerModule } from "../../components/my-date-range-picker/my-daterangepicker.module";
import { EtatStockComponent } from './etat-stock/etat-stock.component';
import {DropdownExportModule} from "../../components/dropdown-export/dropdown-export.module";
@NgModule({
    declarations: [
        CrudStockComponent,
        StockTableComponent,
        BonCommandeComponent,
        EtatStockComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        ReactiveFormsModule,
        MaterialsModule,
        MyDropdownModule,
        MyDateRangePickerModule,
        DropdownExportModule,
        CollapseModule,
        ModalModule
    ]
})
export class GestionStockModule { }
