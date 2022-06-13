import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  templateUrl: 'detaille.component.html',
  providers: [DatePipe]
})
export class DetailleComponent {

  loading: boolean = false;
  loadingcharts: boolean = false;

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private datePipe: DatePipe) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  iconCollapseD: string = 'icon-arrow-up';
  reportData: any;
  reportDetails: any;
  displayedColumns: any = ["Depart", "Arrivé", "Adresse Depart", "Adresse Arivée", "Km Parcourue", "Duree de conduite (min)", "Max Vitesse (km/h)", "# Arrets", "Consom Fuel (L)", "Consom (%)", "Consom (MAD)", "Consom Theorique (%)"]
  columns: any = ["timeStart", "timeEnd", "addi", "addf", "k", "dc", "v", "na", "c", "cm", "cd", "ct"];

  resume = [];

  urldetails = "";
  urlEvolution = "";
  public devices: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
  ToInvalidate = "0"
  interval = ""
  startTime = "";
  endTime = "";
  trajetStartTime = "";
  trajetEndTime = "";
  selectedMapDevice = ""
  selectedMapDeviceName = ""
  trajetSelectedDevice = ""
  showErrorDevice = false;
  errorMessageDevice = "";
  // barChart

  /////////////////////////////////////////////////////////////////
  public brandBoxChartOptions: any = {

    responsive: true,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
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
    },
    // plugins: {
    //   data: {
    //    color: "white",
    //    formatter: (value, ctx) => {
    //     var perc = ((value * 100)).toFixed(0) + "%";
    //     return perc;
    //    },
    //   },
    //  },
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];

  public vitesseChartData: Array<any> = [
    {
      data: [],
      label: 'Vitesse'
    },
  ];
  public fuelChartData: Array<any> = [
    {
      data: [],
      label: 'Carburant'
    },
  ];
  public tempChartData: Array<any> = [
    {
      data: [],
      label: 'Temperature'
    },
  ];
  /* tslint:disable:max-line-length */
  public chartLabels: Array<any> = [];
  /* tslint:enable:max-line-length */
  public chartOptions: any = {
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
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          // callback: function (value: any) {
          //   return value.substring(7);
          // },
          maxTicksLimit: 24,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          // maxTicksLimit: 5,
          // stepSize: Math.ceil(250 / 5),
          // max: 250
        }
      }]
    },
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
      display: true
    }
  };
  public vitesseChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: '#21c1ff',
      borderColor: '#4dcdff',
      pointHoverBackgroundColor: '#fff'
    },
  ];
  public fuelChartColours: Array<any> = [
    { // brandSuccess
      backgroundColor: '#ffc107',
      borderColor: '#03ff48',
      pointHoverBackgroundColor: '#fff'
    },
  ];
  public tempChartColours: Array<any> = [
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: 'blue',
      pointHoverBackgroundColor: '#fff',
    },
  ];
  public chartLegend = true;
  public resumeChartLegend = false;
  public chartType = 'line';


  ////////////////////////////////////////////////////////////////

  public resumeColors: Array<any> = [
    "twitter", "google-plus", "green", "purple", "yellow", "pink", "primary", "cyan"];
  public resumeUnits: any = { "k": "KM", "da": "MIN", "dc": "MIN", "c": "L", "cd": "MAD", "ct": "%", "cm": "%", "v": "Km/h", "t": "°C", "na": " " };

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
    for (let index = 4; index < 12; index++) {
      this.resume.push({
        val: 0,
        label: this.displayedColumns[index],
        labels: [],
        key: this.columns[index],
        data:
          [
            {
              data: [],
              label: this.displayedColumns[index]
            }
          ]
      })
    }
    this.getDev();
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
      this.selectedMapDevice = this.selectedDevice
      let extra = this.getVehiculeExtraById(this.selectedDevice)
      console.log(extra);
      this.getdetails()
      this.resume = []
      var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.dateFrom.getTime() / 1000 + "&et=" + this.myDateRangePicker.dateTo.getTime() / 1000
      this.dataService.getAllTrajets(urlParams).subscribe({
        next: (d: any) => {
          // console.log(d);
          this.reportData = d;
          this.reportData.forEach((e) => {
            e.st = e.timeStart;
            e.et = e.timeEnd;
            e.timeStart = this.formatDate(new Date(Number.parseInt(e.timeStart) * 1000));
            e.timeEnd = this.formatDate(new Date(Number.parseInt(e.timeEnd) * 1000));
            if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
            if (e.dc) e.dc = Math.round(Number.parseInt(e.dc) / 60);
            e.cd = Math.round(e.c * extra.fc);
            e.ct = extra.fe != 0 ? (e.k / (extra.fe != 0 ? extra.fe : 1)).toFixed(1) : "0";
            e.cm = (100 * (e.c / (e.k != 0 ? e.k : 1))).toFixed(1);

          })
          console.log("this.reportData");
          console.log(this.reportData);

          this.selectedMapDevice = this.selectedDevice
          let resumetmp = [];
          let labels = this.reportData.map((l) => { return l.timeStart })
          this.columns.forEach((e, index) => {
            if (!["timeStart", "timeEnd", "addi", "addf"].includes(e))
              resumetmp.push({
                val: !["cm", "cd", "ct"].includes(e) ? this.reduce(this.reportData, e) : 0,//.toString() + " " + this.resumeUnits[e]
                label: this.displayedColumns[index],
                labels: labels,
                key: e,
                data:
                  [
                    {
                      data: this.reportData.map((l) => { return l[e] }),
                      label: this.displayedColumns[index]
                    }
                  ]
              })
          });
          var length = resumetmp.length - 1;
          resumetmp[length].val = extra.fe != 0 ? (resumetmp[0].val / (extra.fe != 0 ? extra.fe : 1)).toFixed(1) : "0";
          resumetmp[length - 1].val = Math.round(resumetmp[length - 3].val * extra.fc);
          resumetmp[length - 2].val = (100 * (resumetmp[length - 3].val / (resumetmp[0].val != 0 ? resumetmp[0].val : 1))).toFixed(1);
          // console.log("resumetmp");
          // console.log(resumetmp);

          // var y = this.getValue(resumetmp)
          this.resume = resumetmp
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
            if (["v"].includes(e)) {
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

  getEvolution(force = false) {
    this.resetValidator()
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      let urlEvolution = "?d=" + this.selectedDevice + "&st=" + Math.round(this.myDateRangePicker.dateFrom.getTime() / 1000) + "&et=" + Math.round(this.myDateRangePicker.dateTo.getTime() / 1000)
      if (urlEvolution != this.urlEvolution || force) {
        this.urlEvolution = urlEvolution
        this.loadEvolution(urlEvolution)
      }

    }
  }

  loadEvolution(url) {
    this.loadingcharts = true;
    this.dataService.getEvolution(url).subscribe({
      next: (d: any) => {
        // console.log(d);
        this.chartLabels = d.map((l) => { return this.formatDate(new Date(l.t * 1000)) })
        this.vitesseChartData = [
          {
            data: d.map((l) => { return l.v }),
            label: 'Vitesse'
          },
        ];
        this.fuelChartData = [
          {
            data: d.map((l) => { return l.f }),
            label: 'Carburant'
          },
        ];
        this.tempChartData = [
          {
            data: d.map((l) => { return l.tmp }),
            label: 'Temperature'
          },
        ];
        this.loadingcharts = false;
      },
    })
  }

  getdetails() {
    this.resetValidator()
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      this.selectedMapDevice = this.selectedDevice
      this.urldetails = "?d=" + this.selectedDevice + "&st=" + Math.round(this.myDateRangePicker.dateFrom.getTime() / 1000) + "&et=" + Math.round(this.myDateRangePicker.dateTo.getTime() / 1000) + "&all"
    }
  }

  getDev() {
    this.dataService.getVehicule("?extra=true").subscribe({
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

  openMap(v: any) {
    // console.log("openMap");
    // console.log(v);
    this.startTime = v.timeStart ? v.timeStart : "";
    this.endTime = v.timeEnd ? v.timeEnd : "";
    this.selectedMapDevice = v.selectedMapDevice ? v.selectedMapDevice : "";
    // console.log(this.startTime, this.endTime);
    if (this.startTime != "" && this.selectedMapDevice != "") {

      // console.log(this.getVehiculeById(this.selectedMapDevice));
      this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
      this.interval = this.formatDate(new Date(Number.parseInt(this.startTime) * 1000))
      if (this.endTime != "") {
        this.interval += " - " + this.formatDate(new Date(Number.parseInt(this.endTime) * 1000))
      }
      this.primaryModal.show()
    }

  }

  showTrajet() {
    this.resetValidator()
    this.ToInvalidate = Math.random().toString();
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      this.trajetStartTime = Math.round(this.myDateRangePicker.dateFrom.getTime() / 1000).toString();
      this.trajetEndTime = Math.round(this.myDateRangePicker.dateTo.getTime() / 1000).toString();
      this.trajetSelectedDevice = this.selectedDevice;
    }
  }

  getVehiculeNameById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].name
    }
    return ""
  }

  getVehiculeExtraById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return { "fe": this.devices[i].fe, "fc": this.devices[i].fc }
    }
    return { "fe": 0, "fc": 0 }
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'MMM dd, HH:mm:ss');
  }
}


