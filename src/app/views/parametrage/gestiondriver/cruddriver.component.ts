import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { util } from 'src/app/tools/utils';
import { Driver } from '../../../models/driver';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'cruddriver.component.html',
})
export class CruddriverComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  selectedDriver: Driver = new Driver();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, private router: Router) { }

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
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
  showErrorDevice = false;
  errorMessageDevice = "";

  selectedDevicesModal = null;
  selectedDeviceModal = this.selectedDevicesModal;
  showErrorDeviceModal = false;
  errorMessageDeviceModal = "";

  public operations: any = [];
  selectedOperations = null;
  selectedOperation = this.selectedOperations;
  showErrorOperation = false;
  errorMessageOperation = "";

  getSelectedOperations(selected) {
    // console.log(selected);
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
    // console.log(selected);
    this.selectedDevice = selected;
  }

  getSelectedDevicesModal(selected) {
    // console.log(selected);
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
        console.log(d);
        this.data = d;
        this.loading = false;
      }, error(err) {
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
          console.log(d);
          if (d && d.length) {
            d.forEach(e => {
              e.birthdate = this.tools.formatDateForInput(new Date(Number.parseInt(e.birthdate ?? 0) ?? 0 * 1000));
              e.licenseExpire = this.tools.formatDateForInput(new Date(Number.parseInt(e.licenseExpire ?? 0) ?? 0 * 1000));
              e.insuranceExpire = this.tools.formatDateForInput(new Date(Number.parseInt(e.insuranceExpire ?? 0) ?? 0 * 1000));
            });
            this.selectedDriver = d[0];
          }
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
  delete(ev) {

  }

  showAddModal() {
    this.selectedDriver = new Driver();
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
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  modifier() {

  }

  ajouter() {

    if (!this.selectedDriver.driverID || !this.selectedDriver.displayName || !this.selectedDriver.contactPhone || !this.selectedDriver.contactEmail) {
      console.log("test")
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {

    }

  }

  reset() {
    this.selectedDevices = [],
      this.selectedDevice = null
  }


}

