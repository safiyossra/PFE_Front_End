import { util } from './../../../tools/utils';
import { routes } from './../../../app.routing';
import { Consommation } from './../../../models/Consommation';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

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

  constructor(private dataService: DataService, private router: Router, private tools: util, private dateAdapter: DateAdapter<Date>, private route: Router) {
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
    this.dateAdapter.setLocale('en-GB');

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

  getSelectedDevices(selected) {
    this.selectedDevice = selected;
  }

  // La list des vehicules
  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  // Modal functions

  editKmEncours = false;
  editKmPrecedent = false;

  // formatingDate() {
  //   // this.consommation.dateFill = formatDate(new Date(this.consommation.dateFill), 'dd/MM/yyyy HH:mm:ss', 'en');
  //   console.log(this.consommation.dateFill);
  // }

  dateToTimeStamp(date) {
    console.log(Date.parse(date) / 1000);
    return Date.parse(date) / 1000 as number;
  }

  timestampToDate(myTimestamp) {

    console.log(Date.parse(myTimestamp) / 1000);

    return Date.parse(myTimestamp) / 1000 as number;
  }

  // km_actuel
  getCurrentKm(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].km
    }
    return 0
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

  showArretcheckbox() {
    // console.log(this.consommation.pleinOn);
    // show ConsomMoy
  }

  // convert date + hour to timestamp
  // consomDate: any;
  // consomTime: any;
  // getConsomTime() {
  //   var time = this.consomDate + ' ' + this.consomTime;
  //   var consomTime: number = Date.parse(time) / 1000;
  //   return consomTime;
  // }


  getSelectedDevicesModal(selected) {
    this.consommation.deviceID = selected;
    this.consommation.kmEncours = this.getCurrentKm(selected);
  }

  getSelectedDriver(selected) {
    this.consommation.driverID = selected;
  }

  dateSelected() {
    this.consommation.dateFill = this.dateToTimeStamp(new Date(this.consommation.dateFillString));

    if (this.consommation.dateFill != '' && !isNaN(this.consommation.dateFill) && this.consommation.deviceID != '')
      this.getKmPrecedent(this.consommation.dateFill, this.consommation.deviceID);

  }

  // get km precedent
  getKmPrecedent(date, vehID) {
    this.dataService.getConsommation("?date=" + date + "&vehId=" + vehID).subscribe({
      next: (res) => {
        this.consommation.kmEncours = res.kmEncours ?? 0;
      }, error(err) {
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
      }
    });
  }

  getQte() {
    this.calculateQteMoy();
  }

  calculateQteMoy() {
    this.consommation.consoM = (this.consommation.kmEncours - this.consommation.kmPrecedent) / this.consommation.qte * 100;
  }

  errorMsg = "";

  verifyConsommationFields() {
    return (!this.consommation.deviceID &&
      !this.consommation.driverID &&
      !this.consommation.qte &&
      !this.consommation.montant &&
      !this.consommation.montantTTC &&
      !this.consommation.dateFill &&
      !this.consommation.dateFillString &&
      !this.consommation.kmPrecedent &&
      !this.consommation.kmEncours &&
      !this.consommation.pleinOn &&
      !this.consommation.consoM &&
      !this.consommation.fournisseur &&
      !this.consommation.numCarte &&
      !this.consommation.numBon)

  }

  // save button function
  ajouter() {
    console.log(this.consommation);

    var route = this.router
    this.errorMsg = ""
    // this.this.selectedPlan.device = this.resultedRule
    if (this.verifyConsommationFields()) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {

      this.dataService.addConsommation(this.consommation).subscribe({
        next: (res) => {
          console.log("added", res)
          this.loadData(true)
          this.primaryModal.hide()
          this.errorMsg = ""
        }
        , error(err) {
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

  loadData(first = false) {
    var route = this.router
    this.loading = true;
    var urlParams = ""
    // if (!first)
    //   urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    this.dataService.getConsommation(urlParams).subscribe({
      next: (d: any) => {
        console.log(d);
        this.data = d;
        this.data.forEach((e) => {
          e.dateFill = this.tools.formatDate(new Date(Number.parseInt(e.dateFill) * 1000));
        })
        this.loading = false;
      }, error(err) {
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  reset() {
    this.selectedDevices = []
    this.report.nativeElement.value = ''
    this.id.nativeElement.value = ''
    this.description.nativeElement.value = ''
    this.pushpin.nativeElement.value = ''

  }

}


