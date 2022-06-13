import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import {ModalDirective} from 'ngx-bootstrap/modal';


@Component({
  templateUrl: 'alerts.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class AlertsComponent {

  loading: boolean = false;
 
  constructor(private dataService: DataService, private datePipe: DatePipe) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = true;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-down';
  reportData: any;
  data=[]
  // displayedColumns: any = ["Depart", "Arrivé", "Adresse Depart", "Adresse Arivée", "Km Parcourue", "Duree de conduite (min)", "Max Vitesse (km/h)", "# Arrets", "Consom Fuel (L)", "Fuel moyenne (L)"]
  // columns: any = ["timeStart", "timeEnd", "addi", "addf", "k", "dc", "v", "na", "c", "cr"];

  public devices: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
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
      labels: ['Start', 'End'],
      menu: [
        { alias: 'td', text: 'Today', operation: '0d' },
        { alias: 'tm', text: 'This Month', operation: '0m' },
        { alias: 'lm', text: 'Last Month', operation: '-1m' },
        { alias: 'tw', text: 'This Week', operation: '0w' },
        { alias: 'lw', text: 'Last Week', operation: '-1w' },
        { alias: 'ty', text: 'This Year', operation: '0y' },
        { alias: 'ly', text: 'Last Year', operation: '-1y' },
        { alias: 'ny', text: 'Next Year', operation: '+1y' },
        { alias: 'ln', text: 'Last 90 days', operation: '-90d' },
        { alias: 'l2m', text: 'Last 2 months', operation: '-2m' },

        { alias: 'pmt', text: 'Past Month from Today', operation: '-1mt' },
        { alias: 'nmt', text: 'Next Month from Today', operation: '1mt' },
        { alias: 'pwt', text: 'Past Week from Today', operation: '-1wt' },
        { alias: 'pyt', text: 'Past Year from Today', operation: '-1yt' },
        { alias: 'nyt', text: 'Next Year from Today', operation: '+2yt' },
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
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  getSelectedDevices(selected) {
    // console.log(selected);
    this.selectedDevice = selected;
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }
  //////////////////////
  submit() {
    this.resetValidator()
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      this.loading = true;
      var urlParams = "?d=" + this.selectedDevice + "&st=" + Math.round(this.myDateRangePicker.dateFrom.getTime() / 1000)  + "&et=" +  Math.round(this.myDateRangePicker.dateTo.getTime() / 1000)
      this.dataService.getAllTrajets(urlParams).subscribe({
        next: (d: any) => {

          console.log(d);
          this.reportData = d;
          this.reportData.forEach((e) => {
            e.timeStart = this.datePipe.transform(new Date(Number.parseInt(e.timeStart) * 1000), 'yyyy-MM-dd  h:mm:ss');
          })
          this.loading = false;
        },
      })

    }
  };


  getDev() {
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
      },
      error: (errors) => {

      }
    })
  }

  reset() {
    this.selectedDevices = []
  }
}
