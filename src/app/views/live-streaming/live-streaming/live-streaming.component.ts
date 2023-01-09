import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit {

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-down';
  selectedDevices = [];
  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  myDateRangePicker: MyDateRangePickerComponent;
  errorMessageDevice = "";
  showErrorDevice = false;
  public devices: any = [];
  selectedDevice = null;
  loading: boolean = false
  selectedTab = 0;

  constructor(private dataService: DataService, private router: Router, private route: Router) { }

  ngOnInit(): void {
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
    this.getStream();
    this.getDevices();
  }

  toggleCollapse($event): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  getDevices() {
    var route = this.router
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        console.log("devices ", this.devices);
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getSelectedDevices(selected) {
    console.log(selected);
    this.selectedDevice = selected;
  }

  reset() {
    this.selectedDevices = []
  }

  submit() {
    this.loading = true;
    var urlNotif = "?st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    if (this.selectedDevice != null) {
      urlNotif += "&d=" + this.selectedDevice
    }
  }

  getStream() {
    this.dataService.getStream().subscribe({
      next:
        resp => {
          console.log("resp stream ", resp);
        },
      error(err) {
        console.log("errrrror ", err);

      }
    })
  }




}
