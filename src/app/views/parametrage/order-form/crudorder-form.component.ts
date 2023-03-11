import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
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
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  tva: number = 0.2;
  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  mode = "Ajouter"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  public isnotNum: boolean = false
  displayedColumns: any = ["N Commande ",  "Fornisseur", "Liste produits", "Paiement", "Total TTC", "Date", "Observation" ]
  modalLoading: boolean = false;
  //
  columnNames =["Actions","N Commande ",  "Fornisseur", "Liste produits", "Paiement", "Date", "Observation"];
  selectedOrderForm: OrderForm = new OrderForm();
  payementOptions = [
    { label: 'Espece', value: 'cash' },
    { label: 'Par Chèque', value: 'byCheck' },
    { label: 'Carte Bancaire', value: 'creditCard' },
    { label: 'Virement', value: 'creditCard' }
  ];
  selectedProduct: OrderItem=new OrderItem();
  orderItems: OrderItem[] = [new OrderItem()];
  // emptyItem: OrderItem=new OrderItem();
  products: any =[];
  suppliers: any=[];
  selectedSupplier: any=[];
  itemsData=[]
  displayedOrderItemColumns=["Réf", "Produit", "Quantité", "Prix unitaire HT (MAD)", "% TVA", "Total TTC"]
  OrderItemColumns=[ "ref", "product", "quantity", "price", "tva", "total"]
  //
  selectedMode =''
  public devices: any = [];
  selectedDevices = [];
  selectedDevice = null;
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

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

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
    this.mode = "Modifier"
    if (ev) {
      var url = "?id=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getOrdersForm(url).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.selectedOrderForm = new OrderForm(res.orderNum,res.supplier,res.orderItems, res.payment, res.createdAt, res.desc);

          // this.selectedGroupevehicules.vehiclues = res.vehicules.map(e => { return e.deviceID });
          // this.selectedDevices = this.selectedGroupevehicules.vehiclues
          this.selectedDevice = this.selectedDevices

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

  getDev() {
    var route = this.router
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        // console.log(res)
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getDeviceByName(e) {
    return this.devices.filter((v) => { return v.dID == e })[0].name
  }

  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    if (!this.selectedOrderForm.supplier || !this.selectedOrderForm.orderItems
      || !this.selectedOrderForm.createdAt
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

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Un bon de Commande avec cet numéro exist deja. Veuillez utiliser un autre numéro."
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
            this.primaryModal.hide()
            this.errorMsg = ""
          }
        })
    }
  }

  modifier() {
    var route = this.router
    if (!this.selectedOrderForm.supplier || !this.selectedOrderForm.orderItems
      || !this.selectedOrderForm.createdAt
    )  {
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

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Un bon de Commande avec cet numéro exist deja. Veuillez utiliser un autre numéro."
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
            this.primaryModal.hide()
            this.errorMsg = ""
          }
        })
    }
  }


  delete(ordrForm) {
    if (confirm("Are you sure to delete " + ordrForm)) {
      var route = this.router
      var g = "?g=" + ordrForm
      this.dataService.delOrderForm(g).subscribe({
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

  showAddModal() {
    this.selectedOrderForm = new OrderForm();
    this.selectedDevice = []
    this.selectedDevices = []
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.primaryModal.show()
  }

  reset() {
    this.selectedDevice = []
    this.selectedDevices = []
  }


  exporter(type) {
    // to modify
    type == 1 ? this.exportingPdfTool.exportPdf_GroupeVehicules(this.data, "Rapport de Bons de commande" ) :
      this.exportingExcelTool.Export_GroupVehicules(this.data, "Rapport de Bons de commande ")
  }
  //******* Items order form treatment ***************

  addOrderItem(){
    this.orderItems.unshift(new OrderItem());

  }

  deleteItem(item){
    this.orderItems = this.orderItems.filter((e)=>{
      return e!=item
    })
  }


}


