import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { util } from 'src/app/tools/utils';
import { Router } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';


@Component({
  templateUrl: 'alerts.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AlertsComponent {

  loading: boolean = false;
 
  constructor(private dataService: DataService, private tools: util, private exportingTool: ExportingTool, private router: Router) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-down';
  data: any;
  public devices: any = [];
  selectedDevices = [];
  selectedDevice = null;
  showErrorDevice = false;
  errorMessageDevice = "";

  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
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
    this.getDev();
    setTimeout(() => this.submit(), 100)
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

  //////////////////////
  submit() {
    this.loading = true;
    var urlNotif = "?st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    // console.log(this.selectedDevice);
    if (this.selectedDevice != null) {
      urlNotif += "&d=" + this.selectedDevice
    }
    // console.log(urlNotif);

    var route = this.router
    this.dataService.getNotifications(urlNotif).subscribe({
        next: (d: any) => {
        // console.log("data");
        //   console.log(d);
        d.forEach((e) => {
          e.timestamp = this.tools.formatDate(new Date(Number.parseInt(e.timestamp) * 1000));
          })
        this.data = d;
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

  reset() {
    this.selectedDevices = []
  }

  exporter(type) {
    // this.exportingTool.exportexcel("trajetTable", "Rapport Trajet")
  }
}
