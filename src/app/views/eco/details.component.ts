import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  templateUrl: 'details.component.html',
  providers: [DatePipe]
})
export class DetailsComponent {

  loading: boolean = false;

  constructor(private dataService: DataService, private datePipe: DatePipe) { }

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];
  public mainChartData4: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Vitesse'
    },
    {
      data: this.mainChartData2,
      label: 'Consommation'
    },
    // {
    //   data: this.mainChartData3,
    //   label: 'Max Vitesse'
    // },
    // {
    //   data: this.mainChartData4,
    //   label: 'Max Consommation'
    // }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    // scales: {
    // xAxes: [{
    //   gridLines: {
    //     drawOnChartArea: false,
    //   },
    // ticks: {
    //   callback: function (value: any) {
    //     return value.charAt(0);
    //   }
    // }
    // }],
    // yAxes: [{
    //   ticks: {
    //     beginAtZero: true,
    //     maxTicksLimit: 5,
    //     stepSize: Math.ceil(250 / 5),
    //     max: 250
    //   }
    // }]
    // },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: '#21c1ff7a',
      borderColor: '#4dcdffe3',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: '#ffc10763',
      borderColor: '#03ff48e3',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: 'blue',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [5, 2]
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: 'green',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  iconCollapseD: string = 'icon-arrow-up';
  reportData: any = [];
  reportDetails: any;
  displayedColumns: any = ["Depart", "Arrivé", "Km Parcourue", "Duree de conduite (min)", "Eco-Index", "Max Vitesse (km/h)", "# Arrets", "Duree arrets (min)", "Consom Fuel (L)", "Fuel moyenne (L)", "Max Temperature(°C)"]
  columns: any = ["timeStart", "timeEnd", "k", "dc", "eco", "v", "na", "da", "c", "cr", "t"];

  resume = [];
  urldetails = "";

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
  // barChart

  // public resumeColors: Array<any> = [
  //   "twitter", "google-plus", "gray", "green", "red", "purple", "yellow", "pink"
  // ];
  public resumeUnits: any = { "k": "KM", "da": "MIN", "dc": "MIN", "c": "L", "cr": "L", "v": "KM/H", "t": "°C", "na": " " };

  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  ngOnInit() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 10);
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
        from: yesterday,
        to: today
      }
    };
    this.getDev();
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  toggleCollapseData(): void {
    this.isCollapsedData = !this.isCollapsedData;
    this.iconCollapseD = this.isCollapsedData ? 'icon-arrow-down' : 'icon-arrow-up';

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

  //////////////////////
  submit() {
    this.resetValidator()
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      this.loading = true;
      this.resume = []
      var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.dateFrom.getTime() / 1000 + "&et=" + this.myDateRangePicker.dateTo.getTime() / 1000 + "&eco"
      this.dataService.getAllTrajets(urlParams).subscribe({
        next: (d: any) => {
          // console.log(d);
          this.reportData = d;
          this.reportData.forEach((e) => {
            e.timeStart = this.datePipe.transform(new Date(Number.parseInt(e.timeStart) * 1000), 'yyyy-MM-dd  h:mm:ss');
            e.timeEnd = this.datePipe.transform(new Date(Number.parseInt(e.timeEnd) * 1000), 'yyyy-MM-dd  h:mm:ss');
            if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
            if (e.dc) e.dc = Math.round(Number.parseInt(e.dc) / 60);
          })
          let resumetmp = [];
          let labels = this.reportData.map((l) => { return l.timeStart })
          this.columns.forEach((e, index) => {
            if (["v", "c"].includes(e))
              resumetmp.push({
                val: this.reduce(d, e).toString() + " " + this.resumeUnits[e],
                // label: this.displayedColumns[index],
                // labels: labels,
                data:
                {
                  data: d.map((l) => { return l[e] }),
                  label: this.displayedColumns[index]
                }
              })
          })
          // var y = this.getValue(resumetmp)
          this.resume = resumetmp
          this.mainChartData = [
            {
              data: resumetmp[0].data.data,
              label: 'Vitesse'
            },
            {
              data: resumetmp[1].data.data,
              label: 'Consommation'
            },
          ]
          this.mainChartLabels = labels
          this.loading = false;
        },
      })
    }
  };

  reduce(v, e) {
    if (v && v.length != 0) {
      if (v.length > 1) {
        return v.reduce((p, c) => {
          if (["da", "dc"].includes(e)) {
            var f = isNaN(p) ? p[e] + c[e] : p + c[e]
            return f
          } else
            if (["t", "v"].includes(e)) {
              if (isNaN(p)) return p[e] > c[e] ? p[e] : c[e]
              else return p > c[e] ? p : c[e]
            }
          return isNaN(p) ? Math.round(p[e] + c[e]) : Math.round(p + c[e])
        })
      }
      return v[0][e]
    }
    return 0
  }

  getValue(v) {
    return JSON.parse(JSON.stringify(v))
  }

  getDev() {
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        this.selectedDevices = this.devices[0].dID
        this.selectedDevice = this.devices[0].dID
        this.submit()

      },
      error: (errors) => {
        console.log(errors);

      }
    })
  }

  reset() {
    this.selectedDevices = [],
      this.selectedDevicesModal = [],
      this.selectedOperations = []
  }


  getParam(p: any) {
    return p == "t" ? "°C" : p == "v" ? "Km/h" : p == "da" || p == "dc" ? "H:min:s" : p == "c" || p == "cr" ? "L" : p == "k" ? "KM" : p == "na" ? "#" : ""
  }

}


