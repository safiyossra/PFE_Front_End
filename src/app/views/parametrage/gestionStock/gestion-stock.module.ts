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
import {DropdownExportModule} from "../../components/dropdown-export/dropdown-export.module";
import { StoreProductComponent } from './store-product/store-product.component';
import { ProduitsComponent } from './produits/produits.component';
@NgModule({
    declarations: [
        CrudStockComponent,
        StockTableComponent,
        BonCommandeComponent,
        StoreProductComponent,
        ProduitsComponent
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
