import { DeliveryItem } from './../../../models/deliveryItem';
import { DeliveryNote } from './../../../models/deliveryNote';
import {Component, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";
import {util} from "../../../tools/utils";
import {ExportingTool} from "../../../tools/exporting_tool";
import {ExportExcel} from "../../../tools/export-excel";
import {
  MyDateRangePickerComponent,
  MyDateRangePickerOptions
} from "../../components/my-date-range-picker/my-daterangepicker.component";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {OrderForm} from "../../../models/orderForm";
import {OrderItem} from "../../../models/orderItem";


@Component({
  selector: 'app-crud-delivery-note',
  templateUrl: './crud-delivery-note.component.html',
  styleUrls: ['./crud-delivery-note.component.scss']
})
export class CrudDeliveryNoteComponent {

  loading: boolean = false;
  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  myDateRangePickerOptions: MyDateRangePickerOptions;
  data = [];
  mode = "List"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  modalLoading: boolean = false;
  //
  columnNames: any = ["N BL ", "Date BL", "N BL", "N commande fournisseur", "fournisseur", "N facture", "N reglement"]
  selectedDeliveryNote: DeliveryNote = new DeliveryNote();
  selectedOrderForm: OrderForm= new OrderForm()
  payementOptions = [
    { label: 'Espece', value: 'cash' },
    { label: 'Par Chèque', value: 'byCheck' },
    { label: 'Carte Bancaire', value: 'creditCard' },
    { label: 'Virement', value: 'creditCard' }
  ];
  orderItems: OrderItem[] = [new OrderItem()];
  ordersDelivery: DeliveryItem[]= [new DeliveryItem];
  // suppliers: any=[];
  selectedSupplier: any;
  //
  public devices: any = [];
  // selectedDevices = [];
  // selectedDevice = null;
  showErrorDevice = false;
  errorMessageDevice = "";


  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;


  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Parametrage_GroupeVehicules','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_GroupeVehicules','Ajouter')
    // this.getDev();
    this.loadData();
  }




  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  loadData() {
    this.loading = true;

    var route = this.router
    this.dataService.getOrdersForm("").subscribe({
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
      this.dataService.getOrdersForm(url).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.selectedOrderForm = new OrderForm(res.orderNum,res.createdAt,res.deliveryDate, res.depot, res.supplier, res.supplierAdress, res.deliveryAdress, res.orderItems, res.totalHT, res.totalHT, res.totalTVA);
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

  

  // getDeviceByName(e) {
  //   return this.devices.filter((v) => { return v.dID == e })[0].name
  // }

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
      this.mode = "Modifier" //test mode Modifier 
      // this.dataService.addOrderForm(this.selectedOrderForm)
      //   .pipe(
      //     catchError(err => {
      //       console.log("res", err)
      //       this.modalLoading = false;
      //       this.errorMsg = "Erreur "+err
      //       if (err.status == 401) {
      //         route.navigate(['login'], { queryParams: { returnUrl: route.url } });
      //       }

      //       // else if (err.status == 400) {
      //       //   console.log(err);
      //       //   this.errorMsg = "Un bon de Commande avec cet numéro exist deja. Veuillez utiliser un autre numéro."
      //       //   console.log(this.errorMsg);
      //       // }

      //       else if (err.status == 402) {
      //         this.errorMsg = "Erreur l'ajout est bloqué."
      //       }
      //       return throwError(err);
      //     })
      //   )
      //   .subscribe({
      //     next: (res) => {
      //       // console.log("add")
      //       this.loadData()
      //       this.mode = "List"
      //       this.errorMsg = ""
      //     }
      //   })
    }
  }

  modifier() {
    var route = this.router
    console.log(this.selectedDeliveryNote)
    if (!this.selectedDeliveryNote.createdAt ) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateOrderForm(this.selectedOrderForm)
        .pipe(
          catchError(err => {
            console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            // else if (err.status == 400) {
            //   console.log(err);
            //   this.errorMsg = "Un bon de Commande avec cet numéro exist deja. Veuillez utiliser un autre numéro."
            //   console.log(this.errorMsg);
            // }

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
    if (confirm("Are you sure to delete " + orderForm)) {
      var route = this.router
      var ord = "?orderForm=" + orderForm
      this.dataService.delOrderForm(ord).subscribe({
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
    this.selectedDeliveryNote.deliveryItems = [new DeliveryItem()];
    this.errorMsg = ""
    this.mode = "Ajouter"
  }

  // reset() {
  //   this.selectedDevice = []
  //   this.selectedDevices = []
  // }


  exporter(type) {
    // to modify
    type == 1 ? this.exportingPdfTool.exportPdf_GroupeVehicules(this.data, "Rapport de Bons de commande" ) :
      this.exportingExcelTool.Export_GroupVehicules(this.data, "Rapport de Bons de commande ")
  }
  //******* Items order form treatment ***************

  getSelectedDepot(selected) {
    this.selectedOrderForm.depot = selected;
  }
  getSelectedSupplier(selected) {
    this.selectedOrderForm.supplier = selected;
  }

  
  calculate(item: OrderItem=null){
    if(item!=null){
      item.totalHT = item.price * item.quantity
      item.totalTTC= item.totalHT + item.tva * item.quantity
    }
    else{
      let sum=0.00
      let tva=0.00
      this.selectedOrderForm.orderItems.forEach(item=>{
      sum+=item.totalHT
      tva+=item.totalHT
      })
      this.selectedOrderForm.totalHT = sum
      this.selectedOrderForm.totalTVA= tva
      this.selectedOrderForm.totalTTC = sum + tva
    }
  }

  totalHT(item: OrderItem){
    console.log("totalHT used")
    item.totalHT = item.price * item.quantity
  }
  totalTTC(item: OrderItem){

    item.totalTTC= item.totalHT + item.tva * item.quantity
    console.log("totalTTC used")
  }

  totHT(){
    let sum=0.00;
    this.selectedOrderForm.orderItems.forEach(item=>{
      sum+=item.totalHT
    })
    this.selectedOrderForm.totalHT = sum
  }
  
  totalTVA(){
    let tva=0.00;
    this.selectedOrderForm.orderItems.forEach(item=>{
      tva+=item.totalHT
    })
    this.selectedOrderForm.totalTVA= tva
  }

  totTTC(){
    this.selectedOrderForm.totalTTC = this.selectedOrderForm.totalHT + this.selectedOrderForm.totalTVA
  }
  

  addOrderItem(){
    this.selectedDeliveryNote.deliveryItems.unshift(new DeliveryItem());

  }

  saveOrderItem(orderNum){
    
  }

  deleteItem(item){
    this.selectedDeliveryNote.deliveryItems = this.selectedDeliveryNote.deliveryItems.filter((e)=>{
      return e!=item
    })
  }


}


