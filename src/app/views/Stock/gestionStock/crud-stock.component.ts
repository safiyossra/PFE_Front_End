import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Stock } from 'src/app/models/stock';
import { throwError } from 'rxjs';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import {catchError, first} from "rxjs/operators";
;


@Component({
  selector: 'app-crud-stock',
  templateUrl: './crud-stock.component.html',
 
})

export class CrudStockComponent implements OnInit,AfterViewInit {
  countries =[];
  suppliers = [];
  selectedOrders = [];
  loading: boolean = false;
  public devices: any = [];
  selectedDevicesModal = [];
  selectedDeviceModal = null;
  showTable: boolean = true;
  selectedDeviceModalOption = this.selectedDevicesModal;
  showErrorDeviceModal = false;
  errorMessageDeviceModal = "";
  showErrorDepot= false;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  errorMessageDepot = "";
  public Depot: any = [];
  selectedDepots = [];
  selectedDepot= this.selectedDepots;
  isEditPermission = false
  isAddPermission = false
  public operations: any = [];
  selectedOperations = [];
  selectedOperation = null;
  showErrorOperation = false;
  errorMessageOperation = "";
  showContent = false;
  selectedTab = 0
    
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  
  @ViewChild('calendar', { static: false }) myDateRangePicker: MyDateRangePickerComponent;

  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { 
  
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  
  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
 
  
  
  data :any [];
 
  mode = "List"
  stores = [];
  products = [];
  errorMsg: string;
  public isnotNum: boolean = false
  modalLoading: boolean = false;
  selectedStock: Stock[] = [new Stock()];
 
  

  ngOnInit() {
this.isEditPermission = this.tools.isAuthorized('Stock','Mettre a jour')
this.isAddPermission = this.tools.isAuthorized('Stock','Ajouter')
this.loadData(true);
 this.getDev();
 this.updateTypMvt();
this.loadStores() ; this.loadProducts();
  this.getDepot();
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
this.myDateRangePickerOptions = {
  theme: 'default',
  labels: ['Début', 'Fin'],
  menu: [
    { alias: 'td', text: 'Aujourd\'hui', operation: '0d' },
    { alias: 'tm', text: 'Ce mois-ci', operation: '0m' },
    { alias: 'lm', text: 'Le mois dernier', operation: '-1m' },
    { alias: 'tw', text: 'Cette semaine', operation: '0w' },
    { alias: 'lw', text: 'La semaine dernière', operation: '-1w' },
    { alias: 'ty', text: 'Cette année', operation: '0y' },
    { alias: 'ly', text: 'L\'année dernière', operation: '-1y' },
    { alias: 'ln', text: '90 derniers jours', operation: '-90d' },
    { alias: 'l2m', text: '2 derniers mois', operation: '-2m' },

    { alias: 'pmt', text: 'Mois passé à partir d\'aujourd\'hui', operation: '-1mt' },
    { alias: 'pwt', text: 'Semaine passée à partir d\'aujourd\'hui', operation: '-1wt' },
    { alias: 'pyt', text: 'Année passée à partir d\'aujourd\'hui', operation: '-1yt' },
    { alias: 'pdt', text: '90 derniers jours à partir d\'aujourd\'hui', operation: '-90dt' },
    { alias: 'pl2mt', text: '2 derniers mois à partir d\'aujourd\'hui', operation: '-2mt' }
  ],
  dateFormat: 'yyyy-MM-dd',
  outputFormat: 'yyyy-MM-dd',
  startOfWeek: 1,
  outputType: 'object',
  locale: 'fr-US',
  minDate: {
    day: null,
    month: null,
    year: null
  },
  maxDate: {
    day: null,
    month: null,
    year: null
  },
  date: {
    from: today,
    to: tomorrow
  }
};
} 
toggleCollapse(): void {
  this.isCollapsed = !this.isCollapsed;
  this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

}
toggleOption() {
  this.showContent = !this.showContent;
}
getSelectedDepots(selected) {
    this.selectedDepot= selected;
   
  }
  updateTypMvt() {
    if (this.showContent) {
     this.selectedStock[0].TypeMvt = 'S';
    } else {
      this.selectedStock[0].TypeMvt = 'E';
    }
  }

  reset() {
    this.selectedDepots = []
    this.selectedDepot = null
  
  }

 
  getDepot() {
      this.loading = true;
      var route = this.router
      this.dataService.getStock("?minimum=true").subscribe({
        next: (d: any) => {
          this.Depot = d;
          this.loading = false;
        }, error(err) {
          console.log(err);
          this.loading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })
    }
  
  
 
  getSelectedOperations(selected) {
    this.selectedOperation = selected;
  }
  getDev() {
    var route = this.router
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  loadProducts() {
    this.loading = true;
    var route = this.router
    this.dataService.getArticleData("?minimum=true").subscribe({
      next: (d: any) => {
        this.products = d;
        this.loading = false;
      }, error(err) {
        console.log(err);
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }
  selectTab(i) {
    this.selectedTab = i
  }
  productChange(v, i) {
    i.Reference = v;
    let product = this.getProductByRef(v);
    if (product) {
      console.log(product)
      i.Designation = product.Designation;
      i.Price = product.Prix_achat;
      i.TVA = product.Tva;
    
    }

  }

  getProductByRef(ref) {
    for (let index = 0; index < this.products.length; index++) {
      const element = this.products[index];
      if (element.Reference == ref) return element;
    }
    return null;
  }



  
  getIconCllapsed(c) {
    return c ? 'icon-arrow-down' : 'icon-arrow-up';
  }


getSelectedDepot(selected: any) {
  this.selectedStock[0].id_Store = selected;
}
loadStores() {
  var route = this.router
  this.loading = true
  this.dataService.loadParam("Store", "Min").subscribe({
    next:
      res => {
        this.loading = false;
        res.forEach(e => {
          e.id = e.id.toString()
        });
        this.stores = res 

      },
    error(err) {
      console.log("err ", err);
      if (err.status == 401) {
        route.navigate(['login']);
      }
      else
        alert("Erreur Serveur !")
    }
  })
}


  
  


  getSelectedDeviceModal(selected) {
    this.selectedStock[0].id_Vehicule= selected
  }


/*******************************charger Stock*************** */

loadData(first = false) {
var route = this.router
this.loading = true;
var urlParams = ""
if (!first) {
   var idStore = this.selectedDepot.length === 0 ? "" : "?id_Store=" + this.selectedDepot +"&";
   urlParams = idStore + "st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
 
 
}
  this.dataService.getStock(urlParams).subscribe({
    next: (d: any) => {
  
      this.loading = false;
      this.data = d;
      console.log("data", d);
      this.data.forEach((e) => {
        e.DateMvt = this.tools.formatDateForInput(new Date(parseInt(e.DateMvt ?? "0") * 1000));
        
      });
    },
    error: (err) => {
      console.log(err);
      this.loading = false;
      if (err.status == 401) {
        route.navigate(['login'], { queryParams: { returnUrl: route.url } });
      }
    }
  });
}


  submit() {

    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }


  ajouter() {
    console.log("stock", this.selectedStock);
    
    var route = this.router
    if (!this.selectedStock[0].id_Store 
    //   || !this.selectedStock[0].DateMvt
   || !this.selectedStock[0].Reference
    ) 
     
        
       {

      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.selectedStock[0].DateMvt= Math.round((new Date(this.selectedStock[0].DateMvtString).getTime())/1000);
      for (let index = 1; index < this.selectedStock.length; index++) {
        this.selectedStock[index].DateMvt=this.selectedStock[0].DateMvt 
        this.selectedStock[index].id_Store=this.selectedStock[0].id_Store 
        this.selectedStock[index].Reference=this.selectedStock[0].Reference
      }
      this.dataService.createStock(this.selectedStock)
        .pipe(
          catchError(err => {
            console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            console.log("err.status", err.status)
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res) => {
            console.log("add")
            this.loadData()
            this.mode = "List"
            this.errorMsg = ""
          }
        })
    }

  }


  
  delete(stock) {
    if (confirm("Are you sure to delete " +stock)) {
      var route = this.router
      var p = "?id=" + stock;
      this.dataService.deleteStock(p).subscribe({
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
    this.selectedStock= [new Stock()];
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.showTable = false;
    this.selectedTab = 0;
    
    
  
    
  }

  loadModify(ev) {
    this.mode = "Modifier"
    this.selectedStock[0] =new Stock();
  
      console.log(ev)
      if (ev) {
        var url = "?id=" + ev;
       console.log(url)
        this.modalLoading = true;
        this.primaryModal.show()
  
        var route = this.router
        this.dataService.getStock(url).subscribe({
          next: (res: any) => {
            if( res && res.length){
             this.selectedStock = res[0]
              //console.log(res);
            //console.log("hi");
  
            }
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

    modifier() {
      var route = this.router
      this.errorMsg=""
      if (
       !this.selectedStock[0].id_Store || !this.selectedStock[0].DateMvt
          || !this.selectedStock[0].Reference
           )  {
        this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
      } else {
        this.dataService.editStock(this.selectedStock[0])
          .pipe(
            catchError(err => {
             console.log("res", err)
              this.modalLoading = false;
              this.errorMsg = "Erreur "+err
              if (err.status == 401) {
                route.navigate(['login'], { queryParams: { returnUrl: route.url } });
              }
  
          
  
              else if (err.status == 402) {
                this.errorMsg = "Erreur l'ajout est bloqué."
              }
              return throwError(err);
            })
          )
          .subscribe({
            next: (res:any) => {
              
              this.loadData()
              this.primaryModal.hide()
              this.errorMsg = ""
            }
          })
      }
    }
  
  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Stock(this.data, "Rapport des Stocks" ) :
      this.exportingExcelTool.Export_Stock(this.data, "Rapport des Stocks")
  }

  addStockItem(){
    this.selectedStock.push(new Stock());
  }

  deleteItem(i){
    //api treatment
    if(this.selectedStock.length==1){
      this.selectedStock = [new Stock()]
    }else{
      this.selectedStock = this.selectedStock.filter((e,j)=>{
        return j!=i
      })
    }

  }

}









