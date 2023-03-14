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
  selector: 'app-crudorder-form',
  templateUrl: './crudorder-form.component.html',
  styleUrls: ['./crudorder-form.component.scss']
})
export class CrudorderFormComponent{
  loading: boolean = false;
  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  myDateRangePickerOptions: MyDateRangePickerOptions;
  data = [];
  mode = "List"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  public isnotNum: boolean = false
  displayedColumns: any = ["orderNum ", "createdAt", "deleveryDate", "supplier",  "depot","quantity", "totalTTC"]
  modalLoading: boolean = false;
  //
  columnNames: any = ["N Commande ", "Date commande", "Date livraison", "Fornisseur",  "Dépôt","Quantité", "Total TTC"]
  selectedOrderForm: OrderForm = new OrderForm();
  payementOptions = [
    { label: 'Espece', value: 'cash' },
    { label: 'Par Chèque', value: 'byCheck' },
    { label: 'Carte Bancaire', value: 'creditCard' },
    { label: 'Virement', value: 'creditCard' }
  ];
  orderItems: OrderItem[] = [new OrderItem()];
  // suppliers: any=[];
  // selectedSupplier: any=[];
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
    if (!this.selectedOrderForm.createdAt || !this.selectedOrderForm.deliveryDate
      || !this.selectedOrderForm.depot || !this.selectedOrderForm.supplier
      ) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addOrderForm(this.selectedOrderForm)
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
    if (!this.selectedOrderForm.createdAt || !this.selectedOrderForm.deliveryDate
      || !this.selectedOrderForm.depot || !this.selectedOrderForm.supplier
      ) {
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

  newOrderForm() {
    this.selectedOrderForm = new OrderForm();
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

  addOrderItem(){
    this.orderItems.unshift(new OrderItem());

  }

  saveOrderItem(){
    
  }

  deleteItem(item){
    this.orderItems = this.orderItems.filter((e)=>{
      return e!=item
    })
  }


}


