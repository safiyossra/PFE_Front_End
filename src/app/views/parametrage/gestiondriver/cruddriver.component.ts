import { catchError } from 'rxjs/operators';
import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { util } from 'src/app/tools/utils';
import { Driver } from '../../../models/driver';
import { Router } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { throwError } from 'rxjs/internal/observable/throwError';
import { DriverDocument } from './../../../models/DriverDocument';
import { Constant } from 'src/app/tools/constants';

@Component({
  templateUrl: 'cruddriver.component.html',
  styleUrls: ['./cruddriver.component.scss']
})
export class CruddriverComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  selectedDriver: Driver = new Driver();
  isEditPermission = false
  isAddPermission = false
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, public cts: Constant, private router: Router, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel,) { }

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
  selectedDeviceModalOption = this.selectedDevicesModal;
  showErrorDeviceModal = false;
  errorMessageDeviceModal = "";

  public operations: any = [];
  selectedOperations = [];
  selectedOperation = null;
  showErrorOperation = false;
  errorMessageOperation = "";

  /////////////
  selectedTab = 0
  typeSelected = []
  openAlert: boolean = false
  driverDocument: DriverDocument = new DriverDocument();
  selectTab(i) {
    this.selectedTab = i
  }
  //////////////////////////////

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
    this.isEditPermission = this.tools.isAuthorized('Parametrage_Conducteur', 'Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_Conducteur', 'Ajouter')
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
    this.selectedTab = 0
    this.selectedDriver = new Driver();
    this.selectedDeviceModalOption = [];
    this.errorMsg = ""
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()
      var route = this.router
      this.dataService.getDriverData(url).subscribe({
        next: (d: any) => {
          if (d && d.length) {
            d.forEach(e => {
              e.birthdateString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.birthdate ?? 0));
              e.licenseExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.licenseExpire ?? 0));
              e.insuranceExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.insuranceExpire ?? 0));
            });
            this.selectedDriver = d[0];
            this.selectedDeviceModalOption = this.selectedDriver.deviceID;
          }
          // console.log("d", d);

          //this added line 
          this.getDriverDocument(this.selectedDriver.driverID)

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
    //added line 
    this.driverDocument = new DriverDocument();
    this.selectedTab = 0
    this.typeSelected = []
    //////
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

  getSelectedDeviceModal(selected) {
    this.selectedDriver.deviceID = selected
  }

  submit() {
    this.selectedDriver.birthdate = Math.round((new Date(this.selectedDriver.birthdateString).getTime()) / 1000);
    this.selectedDriver.licenseExpire = Math.round((new Date(this.selectedDriver.licenseExpireString).getTime()) / 1000);
    this.selectedDriver.insuranceExpire = Math.round((new Date(this.selectedDriver.insuranceExpireString).getTime()) / 1000);
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
    // this.saveDriverocument();
  }

  convertDatesToTimestamp() {
    this.selectedDriver.birthdateString = this.tools.dateToTimestamp(this.selectedDriver.birthdate);
    this.selectedDriver.licenseExpireString = this.tools.dateToTimestamp(this.selectedDriver.licenseExpire);
    this.selectedDriver.insuranceExpireString = this.tools.dateToTimestamp(this.selectedDriver.insuranceExpire);
  }

  ajouter() {
    var route = this.router
    this.errorMsg = ""
    if (!this.selectedDriver.displayName) {//!this.selectedDriver.driverID ||  || !this.selectedDriver.contactPhone || !this.selectedDriver.contactEmail
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (this.selectedDriver.contactEmail && !this.tools.ValidateEmail(this.selectedDriver.contactEmail)) {
        this.errorMsg = "Vous avez saisi un email de contact invalid."
      } else if (this.selectedDriver.contactPhone && !this.tools.ValidatePhone(this.selectedDriver.contactPhone)) {
        this.errorMsg = "Vous avez saisi un telephone de contact invalid."
      } else {
        this.dataService.addDriver(this.selectedDriver)
          .pipe(
            catchError(err => {
              // console.log("res", err)
              this.modalLoading = false;
              if (err.status == 401) {
                route.navigate(['login'], { queryParams: { returnUrl: route.url } });
              }

              else if (err.status == 400) {
                console.log(err);
                this.errorMsg = "Conducteur avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
                console.log(this.errorMsg);
              }

              else if (err.status == 402) {
                this.errorMsg = "Erreur l'ajout est bloqué."
              }
              return throwError(err);
            })
          )
          .subscribe({
            next: (res: any) => {
              // console.log("res", res)
              this.loadData()
              this.primaryModal.hide()
              this.errorMsg = ""
              this.saveDriverocument()
            }
          })
      }
    }
  }

  modifier() {
    var route = this.router
    this.openAlert = false
    this.errorMsg = ""
    // console.log("selectedDriver", this.selectedDriver)
    if (!this.selectedDriver.displayName) {//|| !this.selectedDriver.contactPhone || !this.selectedDriver.contactEmail
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (this.selectedDriver.contactEmail && !this.tools.ValidateEmail(this.selectedDriver.contactEmail)) {
        this.errorMsg = "Vous avez saisi un email de contact invalid."
      } else if (this.selectedDriver.contactPhone && !this.tools.ValidatePhone(this.selectedDriver.contactPhone)) {
        this.errorMsg = "Vous avez saisi un telephone de contact invalid."
      } else {
        this.dataService.updateDriver(this.selectedDriver)
          .pipe(
            catchError(err => {
              console.log("res", err)
              this.modalLoading = false;
              if (err.status == 401) {
                route.navigate(['login'], { queryParams: { returnUrl: route.url } });
              }

              else if (err.status == 400) {
                console.log(err);
                this.errorMsg = "Conducteur avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
                console.log(this.errorMsg);
              }

              else if (err.status == 402) {
                this.errorMsg = "Erreur l'ajout est bloqué."
              }
              return throwError(err);
            })
          )
          .subscribe({
            next: (res: any) => {
              // console.log("res", res)
              this.loadData()
              // this.primaryModal.hide()
              this.saveDriverocument()
              this.errorMsg = ""
              this.openAlert = true
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

  activeStatechange() {
    if (!this.selectedDriver.dutyStatus)
      this.selectedDriver.badgeID = ""
  }

  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Conducteurs(this.data, "Rapport de List Conducteures ") :
      this.exportingExcelTool.ExportConducteurs(this.data, "Rapport de List Conducteures ")
  }

  /////////////////
  /******************* Driver Document Tab *************** */
  getTypePermis(event) {
    // console.log("event ", event);
    this.driverDocument.typePermis = event.toString();
    // console.log("this.driverDocument.typePermis ", this.driverDocument.typePermis);
  }

  saveDriverocument() {

    // console.log("1----driverdocument ", this.driverDocument);
    this.driverDocument.driverID = this.selectedDriver.driverID

    if (this.driverDocument.dateDelivrancePermis)
      this.driverDocument.dateDelivrancePermis = this.tools.dateToTimestamp(this.driverDocument.dateDelivrancePermis)

    if (this.driverDocument.dateValiditePermis)
      this.driverDocument.dateValiditePermis = this.tools.dateToTimestamp(this.driverDocument.dateValiditePermis)

    if (this.driverDocument.dateValiditeAdr)
      this.driverDocument.dateValiditeAdr = this.tools.dateToTimestamp(this.driverDocument.dateValiditeAdr)

    if (this.driverDocument.dateValiditePassport)
      this.driverDocument.dateValiditePassport = this.tools.dateToTimestamp(this.driverDocument.dateValiditePassport)

    if (this.driverDocument.dateValiditeVisa)
      this.driverDocument.dateValiditeVisa = this.tools.dateToTimestamp(this.driverDocument.dateValiditeVisa)

    if (this.driverDocument.dateValiditeVisit)
      this.driverDocument.dateValiditeVisit = this.tools.dateToTimestamp(this.driverDocument.dateValiditeVisit)

    if (this.driverDocument.dateValiditeAssurance)
      this.driverDocument.dateValiditeAssurance = this.tools.dateToTimestamp(this.driverDocument.dateValiditeAssurance)
    // console.log("2----driverdocument ", this.driverDocument);

    this.dataService.addDriverDocument(this.driverDocument).subscribe({
      next:
        resp => {
          // console.log("resp driver document ", resp)
          this.formatData(resp)

          // this.primaryModal.hide()
        },
      error(err) {
        console.log("erooooooooor ", err);

      }

    })
  }

  getDriverDocument(driverID) {
    // console.log("driverID ", driverID);

    let url = "?driverID=" + driverID
    this.dataService.getDriverDocument(url).subscribe({
      next:
        resp => {
          // console.log("resp ", resp);

          this.formatData(resp)
          // console.log("  this.driverDocument ", this.driverDocument);

        },
      error(err) {
        console.log("error ", err);

      }
    })

  }

  formatData(resp) {
    if ([].concat(resp).length > 0) {
      this.driverDocument = resp[0];
      if (this.driverDocument.dateDelivrancePermis)
        this.driverDocument.dateDelivrancePermis = this.tools.formatDateForInput(new Date(this.driverDocument.dateDelivrancePermis * 1000))

      if (this.driverDocument.dateValiditePermis)
        this.driverDocument.dateValiditePermis = this.tools.formatDateForInput(new Date(this.driverDocument.dateValiditePermis * 1000))

      if (this.driverDocument.dateValiditeAdr)
        this.driverDocument.dateValiditeAdr = this.tools.formatDateForInput(new Date(this.driverDocument.dateValiditeAdr * 1000))

      if (this.driverDocument.dateValiditePassport)
        this.driverDocument.dateValiditePassport = this.tools.formatDateForInput(new Date(this.driverDocument.dateValiditePassport * 1000))

      if (this.driverDocument.dateValiditeVisa)
        this.driverDocument.dateValiditeVisa = this.tools.formatDateForInput(new Date(this.driverDocument.dateValiditeVisa * 1000))

      if (this.driverDocument.dateValiditeVisit)
        this.driverDocument.dateValiditeVisit = this.tools.formatDateForInput(new Date(this.driverDocument.dateValiditeVisit * 1000))

      if (this.driverDocument.dateValiditeAssurance)
        this.driverDocument.dateValiditeAssurance = this.tools.formatDateForInput(new Date(this.driverDocument.dateValiditeAssurance * 1000))

      if (this.driverDocument.typePermis)
        this.typeSelected = Array.from(this.driverDocument.typePermis.split(','));
    } else {
      this.driverDocument = new DriverDocument()
    }

  }
}


