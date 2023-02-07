import { catchError } from 'rxjs/operators';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Groupevehicules } from '../../../models/groupevehicules';
import { Router } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { throwError } from 'rxjs';
import { util } from 'src/app/tools/utils';

@Component({
  templateUrl: 'crudgroupe.component.html',
})
export class CrudgroupeComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }

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
  displayedColumns: any = ["Véhicule", "Device", "Num de Tel"]
  modalLoading: boolean = false;
  selectedGroupevehicules: Groupevehicules = new Groupevehicules();
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
    this.getDev();
    this.loadData();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  getSelectedDevices(selected) {
    this.selectedDevice = selected;
    // console.log(this.selectedDevice?.join(" , ").trim());

    this.selectedGroupevehicules.vehiclues = selected;
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  loadData() {
    this.loading = true;

    var route = this.router
    this.dataService.getGroupeVehicules("").subscribe({
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
      this.dataService.getGroupeVehicules(url).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.selectedGroupevehicules = new Groupevehicules(res.group.groupID,res.group.description,res.group.displayName);

          this.selectedGroupevehicules.vehiclues = res.vehicules.map(e => { return e.deviceID });
          this.selectedDevices = this.selectedGroupevehicules.vehiclues
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
    if (!this.selectedGroupevehicules.displayName) {//!this.selectedGroupevehicules.groupID || 
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addDevicesGroup(this.selectedGroupevehicules)
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
            this.errorMsg = "Groupe avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
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
    if (!this.selectedGroupevehicules.groupID || !this.selectedGroupevehicules.displayName) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateDevicesGroup(this.selectedGroupevehicules)
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
            this.errorMsg = "Groupe avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
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
          // console.log("edit groupevehivule")
          this.loadData()
          this.primaryModal.hide()
          this.errorMsg = ""
        }
      })
    }
  }


  delete(group) {
    if (confirm("Are you sure to delete " + group)) {
      var route = this.router
      var g = "?g=" + group
      this.dataService.delDevicesGroup(g).subscribe({
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
    this.selectedGroupevehicules = new Groupevehicules();
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
    type == 1 ? this.exportingPdfTool.exportPdf_GroupeVehicules(this.data, "Rapport de Groupes des Vehicules " ) :
      this.exportingExcelTool.Export_GroupVehicules(this.data, "Rapport de Groupes des Vehicules ")
}

}


