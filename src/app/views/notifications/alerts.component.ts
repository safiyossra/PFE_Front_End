import { ModalDirective } from 'ngx-bootstrap/modal';
import { Component, ViewChild, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { util } from 'src/app/tools/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';


@Component({
  templateUrl: 'alerts.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AlertsComponent {

  loading: boolean = false;

  constructor(private dataService: DataService, private activateRoute: ActivatedRoute, private tools: util, private router: Router, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-down';
  data = [];
  maintenanceData: any;

  vitessData = [];
  zoneData = [];
  demarrageData = [];
  autreData = [];

  notifregx = { v: /\$Speeding/i, z1: /InZone/i, z2: /\$DEPART/i, z3: /\$Arrive/i, f: /\$FuelDelta()/i, d: /demarrage/i }

  public devices: any = [];
  selectedDevices = [];
  selectedDevice = null;
  showErrorDevice = false;
  errorMessageDevice = "";

  selectedTab = 0;
  subActivateRoute: any
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;

  startTime:any;
  endTime:any;
  positionChanged:any;
  selectedMapDevice : any;
  interval : any;
  selectedMapDeviceName = "";
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  ngOnInit() {
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
      outputFormat: 'dd-MM-yyyy',
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

    this.subActivateRoute = this.activateRoute.queryParams.subscribe(params => {
      this.selectedTab = (params['tab'] != undefined) ? parseInt(params['tab']) : 5;
      this.getDev();
      setTimeout(() => this.submit(), 100)
    });

  }

  setTab(i) {
    this.router.navigateByUrl("/notifications/alerts");
    this.selectedTab = i;
  }

  toggleCollapse($event): void {
    // $event.preventDefault();
    // $event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  getSelectedDevices(selected) {
    // console.log(selected);
    this.selectedDevice = selected;
  }

  setData(data: any[]) {
    if (data) {//&& data.length
      let vitessData = [];
      let zoneData = [];
      let autreData = [];
      let demarrageData = [];

      data.forEach(e => {
        if (this.notifregx.v.test(e.selector)) {
          vitessData.push(e)
        }
        if (this.notifregx.z1.test(e.selector)) {
          zoneData.push(e)
        }
        if (this.notifregx.z2.test(e.selector)) {
          zoneData.push(e)
        }
        if (this.notifregx.z3.test(e.selector)) {
          zoneData.push(e)
        }
        if (this.notifregx.d.test(e.ruleID)) {
          demarrageData.push(e)
        }
        if (!this.notifregx.d.test(e.ruleID) && !this.notifregx.v.test(e.selector) && !this.notifregx.z1.test(e.selector) && !this.notifregx.z2.test(e.selector) && !this.notifregx.z3.test(e.selector)) {
          autreData.push(e)
        }
        this.vitessData = vitessData;
        this.zoneData = zoneData;
        this.autreData = autreData;
        this.demarrageData = demarrageData;
      });
    }
  }

  //////////////////////
  submit() {
    this.loading = true;
    var urlNotif = "?st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    if (this.selectedDevice != null) {
      urlNotif += "&d=" + this.selectedDevice
    }

    var route = this.router
    if (this.selectedTab != 1)
      this.dataService.getNotifications(urlNotif).subscribe({
        next: (d: any) => {
          d.forEach((e) => {
            e.creationTime = this.tools.formatDate(this.tools.timeStampToDate(e.creationTime));
          })
          this.data = d;
          this.setData(d);
          this.loading = false;

          this.dataService.getNotifications(urlNotif + "&maintenance=true").subscribe({
            next: (d: any) => {
              d.forEach((e) => {

                e.creationTime = this.tools.formatDate(this.tools.timeStampToDate(e.creationTime));
                e.maintenance = true
              });
              this.maintenanceData = d;
              this.data = this.data.concat(this.maintenanceData)

              this.data.sort(function (a, b) {
                return (new Date(b.creationTime)).getTime() - (new Date(a.creationTime)).getTime();
              });

              this.loading = false;
            }, error(err) {
              if (err.status == 401) {
                route.navigate(['login'], { queryParams: { returnUrl: route.url } });
              }
            }
          })
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })

    if (this.selectedTab == 1)
      this.dataService.getNotifications(urlNotif + "&maintenance=true").subscribe({
        next: (d: any) => {

          d.forEach((e) => {
            e.creationTime = this.tools.formatDate(this.tools.timeStampToDate(e.creationTime));
            e.maintenance = true
          })
          this.maintenanceData = d;
          this.data = this.data.concat(this.maintenanceData)

          this.data.sort(function (a, b) {
            return (new Date(b.creationTime)).getTime() - (new Date(a.creationTime)).getTime();
          });

          this.loading = false;
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })

  };


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

  selectTab(i) {
    this.router.navigateByUrl("/notifications/alerts?tab=" + i);
  }

  reset() {
    this.selectedDevices = []
  }

  getVehiculeNameById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].name
    }
    return ""
  }

  openPositionInMap(v:any){
    console.log(v);
    this.startTime = v.timestamp ? v.timestamp : "";
    this.endTime = v.timeEnd ? v.timeEnd : "";
    this.selectedMapDevice = v.deviceID ? v.deviceID : "";
    if (this.startTime != "" && this.selectedMapDevice != "") {
      this.positionChanged = Math.random();
      this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
      this.interval = this.tools.formatDate(new Date(Number.parseInt(this.startTime) * 1000))
      if (this.endTime != "") {
        this.interval += " - " + this.tools.formatDate(new Date(Number.parseInt(this.endTime) * 1000))
      }
      this.primaryModal.show();
    }
  }

  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Notifications(this.data, "Rapport de Notifications ") :
      this.exportingExcelTool.Export_Notification(this.data, "Rapport de Notifications ")
  }
}
