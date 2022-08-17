import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { util } from 'src/app/tools/utils';
import { Driver } from '../../../models/driver';
import { Router } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';

@Component({
  templateUrl: 'cruddriver.component.html',
})
export class CruddriverComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  selectedDriver: Driver = new Driver();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, private router: Router,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel,) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  errorMsg: string;
  mode = "Ajouter"
  public isnotNum: boolean = false
  displayedColumns: any = ["Véhicule", "Device", "Num de Tel"]


  public devices: any = [];
  selectedDevices = [];
  selectedDevice = null;
  showErrorDevice = false;
  errorMessageDevice = "";

  selectedDevicesModal = [];
  selectedDeviceModal = null;
  showErrorDeviceModal = false;
  errorMessageDeviceModal = "";

  public operations: any = [];
  selectedOperations = [];
  selectedOperation = null;
  showErrorOperation = false;
  errorMessageOperation = "";

  getSelectedOperations(selected) {
    this.selectedOperation = selected;
  }
  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
    this.showErrorOperation = false;
    this.errorMessageOperation = "";
  }


  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  ngOnInit() {
    this.getDev();
    this.loadData();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  getSelectedDevices(selected) {
    this.selectedDevice = selected;
  }

  getSelectedDevicesModal(selected) {
    this.selectedDeviceModal = selected;
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  loadData() {
    this.loading = true;
    var urlParams = "";
    if (this.selectedDevice != null) {
      urlParams += "?device=" + this.selectedDevice
    }
    var route = this.router
    this.dataService.getDriverData(urlParams).subscribe({
      next: (d: any) => {
        this.data = d;
        console.log(d);
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
    this.selectedDriver = new Driver();
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()
      var route = this.router
      this.dataService.getDriverData(url).subscribe({
        next: (d: any) => {
          if (d && d.length) {
            d.forEach(e => {
              e.birthdateString = this.tools.formatDateForInput(new Date(Number.parseInt(e.birthdate ?? 0) * 1000));
              e.licenseExpireString = this.tools.formatDateForInput(new Date(Number.parseInt(e.licenseExpire ?? 0) * 1000));
              e.insuranceExpireString = this.tools.formatDateForInput(new Date(Number.parseInt(e.insuranceExpire ?? 0) * 1000));
            });
            this.selectedDriver = d[0];
          }
          console.log("d", d);

          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })
    }
  }

  showAddModal() {
    this.selectedDriver = new Driver();
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.primaryModal.show()
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
  submit() {
    this.selectedDriver.birthdate = Math.round((new Date(this.selectedDriver.birthdateString).getTime()) / 1000);
    this.selectedDriver.licenseExpire = Math.round((new Date(this.selectedDriver.licenseExpireString).getTime()) / 1000);
    this.selectedDriver.insuranceExpire = Math.round((new Date(this.selectedDriver.insuranceExpireString).getTime()) / 1000);
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    this.errorMsg = ""
    if (!this.selectedDriver.driverID || !this.selectedDriver.displayName || !this.selectedDriver.contactPhone || !this.selectedDriver.contactEmail) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (!this.tools.ValidateEmail(this.selectedDriver.contactEmail)) {
        this.errorMsg = "Vous avez saisi un email de contact invalid."
      } else if (!this.tools.ValidatePhone(this.selectedDriver.contactPhone)) {
        this.errorMsg = "Vous avez saisi un telephone de contact invalid."
      } else {
        this.dataService.addDriver(this.selectedDriver).subscribe({
          next: (res: any) => {
            console.log("res", res)
            this.loadData()
            this.primaryModal.hide()
            this.errorMsg = ""
          }
          , error(err) {
            console.log("res", err)
            this.modalLoading = false;
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }
            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
          }
        })
      }
    }
  }

  modifier() {
    var route = this.router
    this.errorMsg = ""
    console.log("selectedDriver", this.selectedDriver)
    if (!this.selectedDriver.displayName || !this.selectedDriver.contactPhone || !this.selectedDriver.contactEmail) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (!this.tools.ValidateEmail(this.selectedDriver.contactEmail)) {
        this.errorMsg = "Vous avez saisi un email de contact invalid."
      } else if (!this.tools.ValidatePhone(this.selectedDriver.contactPhone)) {
        this.errorMsg = "Vous avez saisi un telephone de contact invalid."
      } else {
      this.dataService.updateDriver(this.selectedDriver).subscribe({
        next: (res:any) => {
          console.log("res", res)
          this.loadData()
          this.primaryModal.hide()
          this.errorMsg = ""
        } , error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            this.errorMsg = "Erreur la modification est bloqué."
          }
        }
      })
      }
    }
  }

  delete(driver) {
    if (confirm("Are you sure to delete " + driver)) {
      var route = this.router
      var d = "?d=" + driver
      this.dataService.delDriver(d).subscribe({
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

  reset() {
    this.selectedDevices = [],
      this.selectedDevice = null
  }

  exporter(type) {
      type == 1 ? this.exportingPdfTool.exportPdf_Conducteurs(this.data, "Rapport de List Conducteures " ) :
        this.exportingExcelTool.ExportConducteurs(this.data,  "Rapport de List Conducteures " )
  }
}


