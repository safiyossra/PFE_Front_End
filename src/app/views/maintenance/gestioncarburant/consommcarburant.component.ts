import { Consommation } from './../../../models/Consommation';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'consommcarburant.component.html',
})
export class ConsommcarburantComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('id') id: ElementRef;
  @ViewChild('pushpin') pushpin: ElementRef;
  @ViewChild('report') report: ElementRef;
  @ViewChild('description') description: ElementRef;

  constructor(private dataService: DataService, private router: Router) {
  }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  datatrajet = [];
  public isnotNum: boolean = false

  public devices: any = [];
  public drivers: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;

  selectedDrivers = null;
  selectedDriver = this.selectedDrivers;

  showErrorDevice = false;
  errorMessageDevice = "";

  selectedDevicesModal = null;
  selectedDeviceModal = this.selectedDevicesModal;
  showErrorDeviceModal = false;
  errorMessageDeviceModal = "";

  selectedCiternes = null;
  selectedCiterne = this.selectedCiternes;

  consommation: Consommation = new Consommation();

  getSelectedDevicesModal(selected) {
    this.selectedDeviceModal = selected;
  }

  getSelectedCiternes(selected) {
    this.selectedCiterne = selected;
  }

  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;

  ngOnInit() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.myDateRangePickerOptions = {
      theme: 'default',
      labels: ['Start', 'End'],
      menu: [
        { alias: 'td', text: 'Today', operation: '0d' },
        { alias: 'tm', text: 'This Month', operation: '0m' },
        { alias: 'lm', text: 'Last Month', operation: '-1m' },
        { alias: 'tw', text: 'This Week', operation: '0w' },
        { alias: 'lw', text: 'Last Week', operation: '-1w' },
        { alias: 'ty', text: 'This Year', operation: '0y' },
        { alias: 'ly', text: 'Last Year', operation: '-1y' },
        { alias: 'ln', text: 'Last 90 days', operation: '-90d' },
        { alias: 'l2m', text: 'Last 2 months', operation: '-2m' },

        { alias: 'pmt', text: 'Past Month from Today', operation: '-1mt' },
        { alias: 'pwt', text: 'Past Week from Today', operation: '-1wt' },
        { alias: 'pyt', text: 'Past Year from Today', operation: '-1yt' },
        { alias: 'pdt', text: 'Past 90 days from Today', operation: '-90dt' },
        { alias: 'pl2mt', text: 'Past 2 months from Today', operation: '-2mt' }
      ],
      dateFormat: 'yyyy-MM-dd',
      outputFormat: 'dd-MM-yyyy',
      startOfWeek: 1,
      outputType: 'object',
      locale: 'en-US',
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

    this.getDev();

    this.getDriver();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
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

  getDriver() {
    var route = this.router
    this.dataService.getDriverData("?minimum=true").subscribe({
      next: (res) => {
        console.log(res)
        this.drivers = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getSelectedDevices(selected) {
    this.consommation.deviceID = selected;
  }

  getSelectedDriver(selected) {
    this.consommation.driverID = selected;
  }

  showArretcheckbox() {
    // console.log(this.consommation.pleinOn);
    // show ConsomMoy
  }

  consomDate: any;
  consomTime: any;

  getConsomTime() {
    var time = this.consomDate + ' ' + this.consomTime;
    var consomTime: number = Date.parse(time) / 1000;
    // console.log(consomTime);
    return consomTime;
  }

  // save button function
  ajouter() {
    this.consommation.dateFill = this.getConsomTime();
    console.log(this.consommation);

    // var route = this.router
    // if (!this.selectedGroupevehicules.groupID || !this.selectedGroupevehicules.displayName) {
    //   this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    // } else {
    //   this.dataService.addDevicesGroup(this.selectedGroupevehicules).subscribe({
    //     next: (res) => {
    //       console.log("add")
    //       this.loadData()
    //       this.primaryModal.hide()
    //       this.errorMsg = ""
    //     }
    //     , error(err) {
    //       this.modalLoading = false;
    //       if (err.status == 401) {
    //         route.navigate(['login'], { queryParams: { returnUrl: route.url } });
    //       }
    //       else if (err.status == 402) {
    //         this.errorMsg = "Erreur l'ajout est bloqué."
    //       }
    //     }
    //   })
    // }
  }

  reset() {
    this.selectedDevices = []
    this.report.nativeElement.value = ''
    this.id.nativeElement.value = ''
    this.description.nativeElement.value = ''
    this.pushpin.nativeElement.value = ''

  }

}


