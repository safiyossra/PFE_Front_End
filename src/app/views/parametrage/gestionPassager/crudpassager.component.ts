

import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DataService} from "../../../services/data.service";
import {util} from "../../../tools/utils";
import {Router} from "@angular/router";
import {ExportingTool} from "../../../tools/exporting_tool";
import {ExportExcel} from "../../../tools/export-excel";
import { MyDateRangePickerComponent,MyDateRangePickerOptions} from "../../components/my-date-range-picker/my-daterangepicker.component";
import {catchError, first} from "rxjs/operators";
import {throwError} from "rxjs";
import {Passager} from "../../../models/passager";


@Component({
  selector: 'app-crudpassager',
  templateUrl: './crudpassager.component.html',

})
export class CrudpassagerComponent implements OnInit {
  countries =[];
  suppliers = [];
  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  public Clients: any = [];
  selectedClients = [];
  selectedClient= this.selectedClients;
  showErrorClient= false;
  errorMessageClient = "";
  showErrorCity= false;
  errorMessageCity = "";
  public City: any = [];
  selectedCitys = [];
  selectedCity= this.selectedCitys;


  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { 
   
  }


  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data :any [];
  mode = "Ajouter"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  public isnotNum: boolean = false
  modalLoading: boolean = false;
  selectedPassager: Passager = new Passager();

  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Parametrage_Passager','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_Passager','Ajouter')
     this.getDev();
    this.loadData(true);
    this.loadSuppliers();
    this.loadCountries();
     this.getCity();
  
    

  }
 
  reset() {
    this.selectedClients = []
    this.selectedCitys = []
    this.selectedClient = null
    this.selectedCity = null
  }
  resetClient() {
  this.selectedClients = []
  this.selectedClient = null
  this.loadData(true)
}
resetCity(){
this.selectedCitys = []
this.selectedCity = null
this.loadData(true)
}

getSelectedClients(selected) {
  this.selectedClient = selected;
  //console.log("client",this.selectedClient);

  }
  getSelectedCites(selected) {
    this.selectedCity = selected;
   
  
    }
  onValidateClient() {
    this.showErrorClient = !this.showErrorClient;
    this.errorMessageClient = "This field is required";
  }

  onValidateCity() {
    this.showErrorCity = !this.showErrorCity;
    this.errorMessageCity = "This field is required";
  }
 
  getDev() {

    var route = this.router
    this.dataService.getClient("").subscribe({
      next: (res) => {
        console.groupCollapsed('Clients')
        //console.log(res);
        console.groupEnd()
        this.Clients= res
     //Passager.cit = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
    //console.log("Clients",this.Clients);
  }
  getCity() {

    var route = this.router
    this.dataService.getCity("").subscribe({
      next: (res) => {
        console.groupCollapsed('City')
        //console.log(res);
        console.groupEnd()
        this.City= res
     //Passager.cit = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
    //console.log("Clients",this.Clients);
  }
  
  getSelectedCity(selected){
    this.countries
    this.selectedPassager.country = selected;
    console.log(selected)
    console.log(this.selectedPassager.country)
  }
loadCountries() {
    var route = this.router
      this.loading = true
      this.dataService.loadParam("Country","Min").subscribe({
        next:
          res => {
            // console.log("res", res)
            this.loading = false;
            res.forEach(e => {
              e.id = e.id.toString()
            });
            this.countries = res // [{id:"",description:""},{...}]
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
  loadSuppliers() {
    this.loading = true;
    var route = this.router
    this.dataService.getSuppliers("?Client=true").subscribe({
      next: (d: any) => {
        d.forEach(e => {
          e.id = e.id.toString()
        });
        console.log("suppliers",d)
        this.suppliers = d;
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

  getSelectedSupplier(selected) {
    this.selectedPassager.client = selected;
  }
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }


/*******************************charger les passagers*************** */

  loadData(first = false) {
    var route = this.router
    this.loading = true;
   var urlParams;
  
    var c = this.selectedCity.length == 0 ? "?" : "?city=" + this.selectedCity +"&";
    var client = this.selectedClient.length == 0 ? "?" : "client=" + this.selectedClient;
    urlParams = c + client
   
    

    this.dataService.getPassager(urlParams).subscribe({
      next: (d: any) => {
        this.loading = false;
        this.data = d;
        console.log("data",d)
        this.data.forEach((e) => {

        })

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
    this.selectedPassager =new Passager();

    console.log(ev)
    if (ev) {
      var url = "?c=" + ev;
     console.log(url)
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getPassager(url).subscribe({
        next: (res: any) => {
          if( res && res.length){
           this.selectedPassager = res[0]
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

       



  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    if (!this.selectedPassager.lastName || !this.selectedPassager.FirstName ||!this.selectedPassager.cin || !this.selectedPassager.tel || !this.selectedPassager.code) {

      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.createPassager(this.selectedPassager)
        .pipe(
          catchError(err => {
           // console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            console.log("err.status", err.status)
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Passager avec ce code exist deja. Veuillez utiliser un autre code."
              console.log(this.errorMsg);
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res:any) => {
            console.log("add")
            this.loadData(true)
            this.primaryModal.hide()
            this.errorMsg = ""
          }
        })
    }

  }

  modifier() {
    var route = this.router
    this.errorMsg=""
    if (
      !this.selectedPassager.lastName || !this.selectedPassager.FirstName ||!this.selectedPassager.cin || !this.selectedPassager.tel || !this.selectedPassager.code)  {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.editPassager(this.selectedPassager)
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
              this.errorMsg = "passager avec ce code exist deja. Veuillez utiliser un autre code."
              console.log(this.errorMsg);
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res:any) => {
            // console.log("edit groupevehivule")
            this.loadData(true)
            this.primaryModal.hide()
            this.errorMsg = ""
          }
        })
    }
  }

  delete(passager) {
    if (confirm("Are you sure to delete " + passager)) {
      var route = this.router
      var p = "?id=" + passager;
      this.dataService.deletepassager(p).subscribe({
        next: (res) => {
          this.loadData(true)
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
    this.selectedPassager = new Passager();
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.primaryModal.show()
  }




  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Passager(this.data, "Rapport des passagers " ) :
      this.exportingExcelTool.Export_Passager(this.data, "Rapport des passagers ")
  }



  
}






