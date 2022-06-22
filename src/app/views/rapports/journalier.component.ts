import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';

@Component({
  templateUrl: 'journalier.component.html',
})
export class JournalierComponent {
  loading: boolean = false;

  constructor(private dataService: DataService) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  selectedType = ["0", "0", "0", "0"]
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  iconCollapseD: string = 'icon-arrow-up';
  reportData: any;
  displayedColumns = ["Date",]
  columns = ["timestamp",];
  reportDetails: any;
  paramstab = [];
  resume = [];
  urldetails = "";


  public chartColours: Array<any> = [//primary,warning,danger,dark
    { // grey['#12ff00de', '#00daffcc', '#ff0056de', '#006fffde' ]
      backgroundColor: '#0077c2',
      borderColor: '#0077c2',
      pointBackgroundColor: '#0077c2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: '#ffc107',
      borderColor: '#ffc107',
      pointBackgroundColor: '#ffc107',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: '#f86c6b',
      borderColor: '#f86c6b',
      pointBackgroundColor: '#f86c6b',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,0,0,0.8)'
    },
    { // grey
      backgroundColor: '#2f353a',
      borderColor: '#2f353a',
      pointBackgroundColor: '#2f353a',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,0,0,0.8)'
    }
  ];

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
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }
  toggleCollapseData(): void {
    this.isCollapsedData = !this.isCollapsedData;
    this.iconCollapseD = this.isCollapsedData ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  public devices: any = [];

  public kmConditions = [
    {
      label: ">=50",
      data: "50"
    },
    {
      label: ">=100",
      data: "100"
    },
    {
      label: ">=150",
      data: "150"
    },
    {
      label: ">=200",
      data: "200"
    },
    {
      label: ">=300",
      data: "300"
    },
    {
      label: ">=400",
      data: "400"
    },
    {
      label: ">=600",
      data: "600"
    }
  ];

  public params = [
    {
      label: "Kilometrage parcourue (km)",
      data: "k"
    },
    {
      label: "Duree de conduite (min)",
      data: "dc"
    },
    {
      label: "Duree d'arrets (min)",
      data: "da"
    },
    {
      label: "Nbr d'arrets",
      data: "na"
    },
    {
      label: "Consom Fuel (L)",
      data: "c"
    },
    {
      label: "Fuel moyenne (%)",
      data: "cr"
    },
    {
      label: "Vitesse maximale(km/h)",
      data: "v"
    },
    {
      label: "Temperature maximale(°C)",
      data: "t"
    },
  ];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
  selectedkmConditions = [];
  selectedkm = this.selectedkmConditions;

  selectedparams = [[], [], [], []]

  showErrorDevice = false;
  errorMessageDevice = "";

  showErrorparams = false;
  errorMessageparams = "";


  getSelectedDevices(selected) {
    // console.log(selected);
    this.selectedDevice = selected;
  }

  getSelectedkmConditions(selected) {
    // console.log(selected);
    this.selectedkm = selected;
  }

  getSelectedparams(selected, i) {
    this.selectedparams[i] = selected;
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  onValidateParam() {
    this.showErrorparams = !this.showErrorparams;
    this.errorMessageparams = "required";
  }

  resetValidator() {
    this.showErrorparams = false;
    this.errorMessageparams = "";
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }
  // barChart

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [];
  //////////////////////

  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }
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
  public resumeColors: Array<any> = [
    "twitter", "yellow", "google-plus", "facebook"
  ];
  public resumeUnits: any = { "k": "KM", "da": "MIN", "dc": "MIN", "c": "L", "cr": "L", "v": "KM/H", "t": "°C", "na": " " };
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  submit() {
    this.resetValidator()
    if (this.selectedDevice == null) {
      this.onValidateDevice()
    } else {
      this.loading = true;
      var paramstabtmp = []
      var iskm = ""
      if (this.selectedkm.length != 0)
        iskm = '&kilom=' + this.selectedkm
      if (this.selectedparams[0].length != 0)
        paramstabtmp.push(this.selectedparams[0])
      if (this.selectedparams[1].length != 0)
        paramstabtmp.push(this.selectedparams[1])
      if (this.selectedparams[2].length != 0)
        paramstabtmp.push(this.selectedparams[2])
      if (this.selectedparams[3].length != 0)
        paramstabtmp.push(this.selectedparams[3])

      this.paramstab = []
      this.resume = []
      this.paramstab = Array.from(new Set(paramstabtmp))
      var requestparams = this.paramstab.join("&")
      if (requestparams != "") {
        var urlParams = "?d=" + this.selectedDevice + "&st=" + Math.round(this.myDateRangePicker.dateFrom.getTime() / 1000) + "&et=" + Math.round(this.myDateRangePicker.dateTo.getTime() / 1000) + "&" + requestparams + iskm
        this.dataService.getStatistique(urlParams).subscribe({
          next: (d: any) => {
            this.displayedColumns = ["Date", ...this.getColumnsNames(this.paramstab)]
            this.columns = ["timestamp", ...this.paramstab]
            this.reportData = d;
            this.reportData.forEach((e) => {
              e.timestamp = new Date(Number.parseInt(e.timestamp) * 1000).toLocaleDateString();
              if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
              if (e.dc) e.dc = Math.round(Number.parseInt(e.dc) / 60);
            })
            // if (e.da) e.da = new Date(Number.parseInt(e.da) * 1000).toLocaleTimeString();
            // if (e.dc) e.dc = new Date(Number.parseInt(e.dc) * 1000).toLocaleTimeString();
            let resumetmp = [];
            let labels = this.reportData.map((l) => { return l.timestamp })
            this.paramstab.forEach((e) => {
              resumetmp.push({
                val: this.reduce(d, e).toString() + " " + this.resumeUnits[e],
                label: this.getColNames(e),
                labels: labels,
                data:
                  [
                    {
                      data: d.map((l) => { return l[e] }),
                      label: this.getColNames(e)
                    }
                  ]
              })
            })
            var y = this.getValue(resumetmp)
            this.resume = resumetmp
            this.barChartLabels = labels
            this.barChartData = y.map((l) => { return l.data[0] });
            this.loading = false;
          },
        })
      } else {
        this.loading = false;
        this.onValidateParam()
      }
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

  getColumnsNames(p) {
    var clmns = []
    p.forEach((e) => {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].data == e) {
          clmns.push(this.params[i].label);
          break;
        }
      }
    })
    return clmns
  }

  getColNames(p) {
    var clmns;

    for (let i = 0; i < this.params.length; i++) {
      if (this.params[i].data == p) {
        clmns = this.params[i].label;
        break;
      }
    }

    return clmns
  }

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
    this.selectedDevices = [],
      this.selectedkmConditions = [],
      this.selectedparams = [[], [], [], []]
  }

  resetkm() {
    this.selectedkmConditions = []
  }
  resetparam(i) {
    this.selectedparams[i] = []
  }

  getParam(p: any) {
    return p == "t" ? "°C" : p == "v" ? "Km/h" : p == "da" || p == "dc" ? "H:min:s" : p == "c" || p == "cr" ? "L" : p == "k" ? "KM" : p == "na" ? "#" : ""
  }

}


