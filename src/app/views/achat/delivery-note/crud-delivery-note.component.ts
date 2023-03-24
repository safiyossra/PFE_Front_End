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
  selector: 'app-crud-delivery-note',
  templateUrl: './crud-delivery-note.component.html'
})
export class CrudDeliveryNoteComponent {

  loading: boolean = false;
  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  data = [];
  selectedOrders = [];
  mode = "List"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  modalLoading: boolean = false;
  columnNames: any = ["N BL ", "Date BL", "N commande fournisseur", "fournisseur", "Dépôt", "N facture", "N reglement"]
  displayedColumns: any =["deliveryNum", "createdAt", "orderNum", "supplier", "depot", "billNum", "settlementNum"];
  selectedDeliveryNote: DeliveryNote = new DeliveryNote();
  selectedOrder: any;

  payementOptions = [
    { label: 'Espece', value: 'cash' },
    { label: 'Par Chèque', value: 'byCheck' },
    { label: 'Carte Bancaire', value: 'creditCard' },
    { label: 'Virement', value: 'creditCard' }
  ];


  public devices: any = [];

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

    var route = this.router
    this.dataService.getDeliveryNotes("").subscribe({
      next: (d: any) => {
        this.data = d;
        // console.log(d);
        this.loading = false;
      }, error(err) {
        console.log(err);
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  loadModify(ev) {
    if (ev) {
      var url = "?id=" + ev[0]
      this.modalLoading = true;
      this.mode = "Modifier"
      var route = this.router
      this.dataService.getDeliveryNotes(url).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.selectedDeliveryNote = res
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      });
    }
  }



  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    console.log(this.selectedDeliveryNote)
    if (!this.selectedDeliveryNote.createdAt ) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {

      this.dataService.addDeliveryNote(this.selectedDeliveryNote)
        .pipe(
          catchError(err => {
            console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Un bon de Livraison avec cet numéro exist deja. Veuillez utiliser un autre numéro."
              console.log(this.errorMsg);
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res) => {
            // console.log("add")
            this.loadData()
            this.mode = "List"
            this.errorMsg = ""
          }
        })
    }
  }

  modifier() {
    var route = this.router
    console.log(this.selectedDeliveryNote)
    if (!this.selectedDeliveryNote.createdAt ) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateDeliveryNote(this.selectedDeliveryNote)
        .pipe(
          catchError(err => {
            console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Un bon de Livraison avec cet numéro exist deja. Veuillez utiliser un autre numéro."
              console.log(this.errorMsg);
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res) => {
            // console.log("edit order form")
            this.loadData()
            this.mode = "Modifier"
            this.errorMsg = ""
          }
        })
    }
  }


  delete(orderForm) {
    if (confirm("Are you sure to delete " + orderForm.orderNum)) {
      var route = this.router
      var ord = "?id=" + orderForm.orderNum
      this.dataService.delDeliveryNote(ord).subscribe({
        next: (res) => {
          this.loadData()
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            alert("Erreur, la suppression est bloqué")
          }
        }
      })

    }
  }

  newDeliveryNote() {
    this.selectedDeliveryNote = new DeliveryNote();
    this.errorMsg = ""
    this.mode = "Ajouter"
  }

  reset() {
    this.selectedOrder = []

  }


  exporter(type) {
    // to modify
    type == 1 ? this.exportingPdfTool.exportPdf_GroupeVehicules(this.data, "Rapport de Bons de commande" ) :
      this.exportingExcelTool.Export_GroupVehicules(this.data, "Rapport de Bons de commande ")
  }
  //******* Items order form treatment ***************

  getSelectedDepot(selected:any) {
    this.selectedDeliveryNote.depot = selected;
  }
  getSelectedSupplier(selected) {
    this.selectedDeliveryNote.supplier = selected;
  }

  getSelectedOrder(selected) {
    this.selectedOrder = selected;
    console.log(this.selectedOrder)
    console.log(this.selectedOrders)
  }
  calculate(){
    let totalHT=0.00
    let totalTva=0.00
    this.selectedDeliveryNote.deliveryItems.forEach(item=>{
      item.totalHT = item.price * item.qty * (1-item.tva/100)
      var tva = (item.tva*item.totalHT/100)
      item.totalTTC = item.totalHT + tva
      totalHT+=item.totalHT
      totalTva+=tva
    })
    this.selectedDeliveryNote.totalHT = totalHT
    this.selectedDeliveryNote.totalTVA= totalTva
    this.selectedDeliveryNote.totalTTC = totalHT + totalTva
}



  addDeliveryItem(){
    this.selectedDeliveryNote.deliveryItems.unshift(new DeliveryItem());

  }

  deleteItem(i){
    //api treatment
    if(this.selectedDeliveryNote.deliveryItems.length==1){
      this.selectedDeliveryNote.deliveryItems[i] = new DeliveryItem()
    }else{
      this.selectedDeliveryNote.deliveryItems = this.selectedDeliveryNote.deliveryItems.filter((e,j)=>{
        return j!=i
      })
    }

  }


}


