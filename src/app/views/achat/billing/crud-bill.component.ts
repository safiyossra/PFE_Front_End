import { Bill } from './../../../models/bill';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeliveryItem } from './../../../models/deliveryItem';
import { DeliveryNote } from './../../../models/deliveryNote';
import {Component} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {util} from "../../../tools/utils";
import {ExportingTool} from "../../../tools/exporting_tool";
import {ExportExcel} from "../../../tools/export-excel";
@Component({
  selector: 'app-crud-bill',
  templateUrl: './crud-bill.component.html'
})
export class CrudBillComponent{
  loading: boolean = false;
  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  data = [];
  selectedOrders = [];
  mode = "List"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  modalLoading: boolean = false;
  columnNames: any = ["N Facture", "Date Facture", "N Facture fournisseur", "fournisseur", "Total HT", "Total TVA", "Total TTC", "Déjà Reglé", "Reste à Reglé", "Mode de Reglement"];
  displayedColumns: any =["billNum", "createdAt", "supplierBillNum", "supplier", "totalHT", "totalTVA", "totalTTC", "doneWith", "toFix", "settlementMode"];
  selectedBill: Bill = new Bill()
  selectedOrder: any;

  payementOptions = [
    { label: 'Espece', value: 'cash' },
    { label: 'Par Chèque', value: 'byCheck' },
    { label: 'Carte Bancaire', value: 'creditCard' },
    { label: 'Virement', value: 'creditCard' }
  ];

  iconCollapse: string = 'icon-arrow-up';
  isCollapsed: boolean = false;




  showErrorOrder = false;
  errorMessageOrder = "";


  resetValidator() {
    this.showErrorOrder = false;
    this.errorMessageOrder = "";
  }


  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Parametrage_GroupeVehicules','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_GroupeVehicules','Ajouter')
    this.loadData();
  }






  loadData() {
    this.loading = true;

  //   var route = this.router
  //   this.dataService.getDeliveryNotes("").subscribe({
  //     next: (d: any) => {
  //       this.data = d;
  //       // console.log(d);
  //       this.loading = false;
  //     }, error(err) {
  //       console.log(err);
  //       this.loading = false;
  //       if (err.status == 401) {
  //         route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //       }
  //     }
  //   })
  };

  loadModify(ev) {
  //   if (ev) {
  //     var url = "?id=" + ev
  //     this.modalLoading = true;
  //     this.mode = "Modifier"
  //     var route = this.router
  //     this.dataService.getBills(url).subscribe({
  //       next: (res: any) => {
  //         // console.log(res);
  //         this.selectedBill = res
  //         this.modalLoading = false;
  //       }, error(err) {
  //         this.modalLoading = false;
  //         if (err.status == 401) {
  //           route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //         }
  //       }
  //     });
  //   }
  }



  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
  //   var route = this.router
  //   console.log(this.selectedBill)
  //   if (!this.selectedBill.createdAt ) {
  //     this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
  //   } else {

  //     this.dataService.addDeliveryNote(this.selectedBill)
  //       .pipe(
  //         catchError(err => {
  //           console.log("res", err)
  //           this.modalLoading = false;
  //           this.errorMsg = "Erreur "+err
  //           if (err.status == 401) {
  //             route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //           }

  //           else if (err.status == 400) {
  //             console.log(err);
  //             this.errorMsg = "Un bon de Livraison avec cet numéro exist deja. Veuillez utiliser un autre numéro."
  //             console.log(this.errorMsg);
  //           }

  //           else if (err.status == 402) {
  //             this.errorMsg = "Erreur l'ajout est bloqué."
  //           }
  //           return throwError(err);
  //         })
  //       )
  //       .subscribe({
  //         next: (res) => {
  //           // console.log("add")
  //           this.loadData()
  //           this.mode = "List"
  //           this.errorMsg = ""
  //         }
  //       })
  //   }
  }

  modifier() {
  //   var route = this.router
  //   console.log(this.selectedBill)
  //   if (!this.selectedBill.createdAt ) {
  //     this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
  //   } else {
  //     this.dataService.updateDeliveryNote(this.selectedBill)
  //       .pipe(
  //         catchError(err => {
  //           console.log("res", err)
  //           this.modalLoading = false;
  //           this.errorMsg = "Erreur "+err
  //           if (err.status == 401) {
  //             route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //           }

  //           else if (err.status == 400) {
  //             console.log(err);
  //             this.errorMsg = "Une facture avec cet numéro exist deja. Veuillez utiliser un autre numéro."
  //             console.log(this.errorMsg);
  //           }

  //           else if (err.status == 402) {
  //             this.errorMsg = "Erreur l'ajout est bloqué."
  //           }
  //           return throwError(err);
  //         })
  //       )
  //       .subscribe({
  //         next: (res) => {
  //           // console.log("edit bill")
  //           this.loadData()
  //           this.mode = "Modifier"
  //           this.errorMsg = ""
  //         }
  //       })
  //   }
  }


  delete(bill) {
  //   if (confirm("Are you sure to delete " + bill.billNum)) {
  //     var route = this.router
  //     var ord = "?id=" + bill.billNum
  //     this.dataService.delDeliveryNote(bill).subscribe({
  //       next: (res) => {
  //         this.loadData()
  //       }, error(err) {
  //         this.modalLoading = false;
  //         if (err.status == 401) {
  //           route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //         }
  //         else if (err.status == 402) {
  //           alert("Erreur, la suppression est bloqué")
  //         }
  //       }
  //     })

  //   }
  }

  newBill() {
    this.selectedBill = new Bill();
    this.errorMsg = ""
    this.mode = "Ajouter"
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }
  reset() {
    this.selectedOrder = []

  }


  exporter(type) {
    // to modify
    type == 1 ? this.exportingPdfTool.exportPdf_GroupeVehicules(this.data, "Rapport des Factures" ) :
      this.exportingExcelTool.Export_GroupVehicules(this.data, "Rapport des Factures")
  }

  getSelectedSupplier(selected) {
    this.selectedBill.supplier = selected;
  }

  getSelectedOrder(selected) {
    this.selectedOrder = selected;
  }
  calculate(){
    let totalHT=0.00
    let totalTva=0.00
    this.selectedBill.billItems.forEach(item=>{
      item.totalHT = item.price * item.quantity * (1-item.tva/100)
      var tva = (item.tva*item.totalHT/100)
      item.totalTTC = item.totalHT + tva
      totalHT+=item.totalHT
      totalTva+=tva
    })
    this.selectedBill.totalHT = totalHT
    this.selectedBill.totalTVA= totalTva
    this.selectedBill.totalTTC = totalHT + totalTva
}



  addDeliveryItem(){
    this.selectedBill.billItems.unshift(new DeliveryItem());

  }

  deleteItem(i){
    //api treatment
    if(this.selectedBill.billItems.length==1){
      this.selectedBill.billItems[i] = new DeliveryItem()
    }else{
      this.selectedBill.billItems = this.selectedBill.billItems.filter((e,j)=>{
        return j!=i
      })
    }

  }


}


