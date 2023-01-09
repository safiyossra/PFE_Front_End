import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ActivatedRoute, Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';

@Component({
  templateUrl: 'detaille.component.html',
  styleUrls: ['./style.scss'],
})
export class DetailleComponent {
  sub: any
  vehiculeID: any
  loading: boolean = false
  isArret: boolean = false
  showAllPoints: boolean = false
  loadingcharts: boolean = false
  TrajetDetaillID = "TrajetDetaill"

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel, private router: Router) {
  }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  iconCollapseD: string = 'icon-arrow-up';
  reportData: any;
  reportDataTrajet: any;
  reportDetails: any;
  displayedColumns: any = ["Depart", "Arrivé", "Adresse Depart", "Adresse Arivée", "Km Parcourue", "Conduite (min)", "Eco-Index", "Accélération", "Freinage", "Virage", "Max Vitesse (km/h)", "# Arrets", "Arret (min)", "Consom (L)", "Consom (%)", "Max Temp(°C)", "Vehicule"]
  columns: any = ["timeStart", "timeEnd", "addi", "addf", "k", "dc", "eco", "acc", "br", "cor", "v", "na", "da", "c", "cm", "t", "device"];

  resume = [];
  urldetails = "";
  urlEvolution = "";
  devices: any = [];
  drivers: any = [];
  selectedDrivers = [];
  selectedDriver = null;
  ToInvalidate = "0"
  interval = ""
  startTime = "";
  endTime = "";
  timestamps = "";
  trajetStartTime = "";
  trajetEndTime = "";
  selectedMapDevice = ""
  selectedMapDeviceName = ""
  trajetSelectedDevice = ""
  showErrorDriver = false;
  errorMessageDriver = "";
  selectedTab = 0
  positionChanged = 0;

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

  public chartData: Array<any> = [
    {
      data: [],
      label: 'Vitesse (Km/h)',
      // yAxisID: 'y',
    }, {
      data: [],
      label: 'Carburant (L)',
      // yAxisID: 'y1',
    }, {
      data: [],
      label: 'Température °C',
      // yAxisID: 'y2',
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
      // y: {
      //   type: 'linear',
      //   display: true,
      //   position: 'left',
      // },
      // y1: {
      //   type: 'linear',
      //   display: true,
      //   position: 'right',
      //   // grid line settings
      //   grid: {
      //     drawOnChartArea: false, // only want the grid lines for one axis to show up
      //   },
      // },
      // y2: {
      //   type: 'linear',
      //   display: true,
      //   position: 'left',
      //   // grid line settings
      //   grid: {
      //     drawOnChartArea: false, // only want the grid lines for one axis to show up
      //   },
      // },
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
      }],
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
  public chartColours: Array<any> = [
    { // brandInfo
      backgroundColor: '#21c1ff',
      borderColor: '#4dcdff',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: '#ffc107',
      borderColor: '#03ff48',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: 'blue',
      pointHoverBackgroundColor: '#fff',
    },
  ];
  public radarChartData: Array<any> = [
    {
      data: [0, 0, 0],
      label: 'Pénalités',
    }
  ];
  public radarChartLabels: Array<any> = ["Accélération", "Freinage", "Virage"];
  public radarChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true
    }, elements: {
      line: {
        borderWidth: 3
      }
    }
  };
  public radarChartColours: Array<any> = [
    { // brandDanger
      backgroundColor: '#ff20071f',
      borderColor: '#ff0000',
      pointHoverBackgroundColor: '#fff'
    },
  ];
  public chartLegend = true;
  public resumeChartLegend = false;
  public chartType = 'line';
  public radarChartType = 'radar';

  ////////////////////////////////////////////////////////////////

  public resumeColors: Array<any> = ["twitter", "google-plus", "green", "purple", "yellow"];
  public resumeUnits: any = { "k": "KM", "dc": "MIN", "c": "L", "cm": "%", "v": "Km/h" };
  resumeLabeles: any = ["Km Parcourue", "Duree de conduite (min)", "Max Vitesse (km/h)", "CONSOM (L)", "CONSOM (%)"]
  resumeKeys: any = ["k", "dc", "v", "c", "cm"]

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
    for (let index = 0; index < this.resumeLabeles.length; index++) {
      this.resume.push({
        val: 0,
        label: this.resumeLabeles[index],
        labels: [],
        key: this.resumeKeys[index],
        data:
          [
            {
              data: [],
              label: this.resumeLabeles[index]
            }
          ]
      })
    }
    this.getDev();
    this.getDrivers();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  toggleCollapseData(): void {
    this.isCollapsedData = !this.isCollapsedData;
    this.iconCollapseD = this.isCollapsedData ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  getSelectedDrivers(selected) {
    // console.log(selected);
    this.selectedDriver = selected;
  }

  onValidateDriver() {
    this.showErrorDriver = !this.showErrorDriver;
    this.errorMessageDriver = "This field is required";
  }

  resetValidator() {
    this.showErrorDriver = false;
    this.errorMessageDriver = "";
  }

  //////////////////////
  submit() {
    this.resetValidator()
    if (this.selectedDriver == null) {
      this.onValidateDriver()
    } else {
      this.loading = true;
      // this.selectedMapDevice = this.selectedDriver
      let extra = this.getVehiculeExtraById(this.selectedDriver)
      if (this.selectedTab == 3) this.getEvolution(true)
      // if (this.selectedTab == 4) this.showTrajet()
      // this.resume = []
      var urlParams = "?d=" + this.selectedDriver + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo + "&eco&forDriver"
      // console.log(urlParams);
      var route = this.router
      // "acc", "br", "cor", 
      var violations = { acc: 0, freinage: 0, virage: 0 };
      this.dataService.getAllTrajets(urlParams).subscribe({
        next: (d: any) => {
          d = d.trajets.filter((e) => { return e.driverID == this.selectedDriver });
          d.forEach((e) => {
            e.st = e.timeStart;
            e.et = e.timeEnd;
            e.timeStart = this.tools.formatDate(new Date(Number.parseInt(e.timeStart) * 1000));
            e.timeEnd = this.tools.formatDate(new Date(Number.parseInt(e.timeEnd) * 1000));
            if (e.da) e.da = this.round2d(Number.parseInt(e.da) / 60);
            if (e.dc) e.dc = this.round2d(Number.parseInt(e.dc) / 60);
            if (e.odo) e.odo = this.round2d(Number.parseInt(e.odo) + extra.offset);
            if (e.ft) e.ft = this.round2d(e.ft * extra.cp);
            e.cd = this.round2d(e.c * extra.fc);
            e.ct = extra.fe != 0 ? (e.k / (extra.fe != 0 ? extra.fe : 1)).toFixed(1) : "0";
            e.cm = (100 * (e.c / (e.k != 0 ? e.k : 1))).toFixed(1);
            e.device = this.getVehiculeNameById(e.deviceID);
            violations.acc += e.acc
            violations.freinage += e.br
            violations.virage += e.cor
          })
          this.reportData = d;
          // console.log(this.reportData);
          
          this.reportDataTrajet = d.filter((e) => { return e.trajet == 1 });
          this.selectedMapDevice = this.selectedDriver
          let resumetmp = [];
          let labels = this.reportData.map((l) => { return l.timeStart })
          this.columns.forEach((e, index) => {
            if (!["timeStart", "timeEnd", "addi", "addf", "eco", "acc", "br", "cor", "na", "da", "t", "device"].includes(e))
              resumetmp.push({
                val: !["cm", "cd", "ct", "odo", "ft"].includes(e) ? this.reduce(this.reportData, e) : 0,
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
          resumetmp[0].val = (resumetmp[0].val).toFixed(2);
          resumetmp[1].val = (resumetmp[1].val).toFixed(2);
          resumetmp[2].val = this.round2d(resumetmp[2].val);
          resumetmp[3].val = (resumetmp[3].val).toFixed(2);
          resumetmp[4].val = (100 * (resumetmp[3].val / (resumetmp[0].val != 0 ? resumetmp[0].val : 1))).toFixed(2);
          this.resume = resumetmp
          this.radarChartData = [
            {
              data: [violations.acc, violations.freinage, violations.virage],
              label: 'Pénalités',
            }
          ];
          this.loading = false;
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
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
          return isNaN(p) ? p[e] + c[e] : p + c[e]
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
    this.selectedTab = 3
    this.resetValidator()
    if (this.selectedDriver == null) {
      this.onValidateDriver()
    } else {
      let urlEvolution = "?d=" + this.selectedDriver + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo + "&forDriver"
      if (urlEvolution != this.urlEvolution || force) {
        this.urlEvolution = urlEvolution
        this.loadEvolution(urlEvolution)
      }
    }
  }

  loadEvolution(url) {
    this.loadingcharts = true;
    var route = this.router
    this.dataService.getEvolution(url).subscribe({
      next: (d: any) => {
        // console.log(d);
        this.chartLabels = d.map((l) => { return this.tools.formatDate(new Date(l.t * 1000)) })
        this.chartData = [
          {
            data: d.map((l) => { return l.v }),
            label: 'Vitesse (Km/h)',
            // yAxisID: 'y',
          }, {
            data: d.map((l) => { return l.f }),
            label: 'Carburant (L)',
            // yAxisID: 'y1',
          }, {
            data: d.map((l) => { return l.tmp }),
            label: 'Température °C',
            // yAxisID: 'y2',
          },
        ];
        this.loadingcharts = false;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  selectTab(i) {
    this.selectedTab = i
  }

  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        // console.log("getDev", res);
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getDrivers() {
    var route = this.router
    this.dataService.getDriverData("?minimum=true").subscribe({
      next: (res) => {
        // console.log(res)
        this.drivers = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  reset() {
    this.selectedDrivers = []
    this.selectedDriver = null
  }

  openMap(v: any) {
    this.startTime = v.timeStart ? v.timeStart : "";
    this.endTime = v.timeEnd ? v.timeEnd : "";
    this.selectedMapDevice = v.selectedMapDevice ? v.selectedMapDevice : "";
    if (this.startTime != "" && this.selectedMapDevice != "") {
      this.positionChanged = Math.random();
      // console.log("positionChanged -> 1 ",this.positionChanged)
      this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
      this.interval = this.tools.formatDate(new Date(Number.parseInt(this.startTime) * 1000))
      if (this.endTime != "") {
        this.interval += " - " + this.tools.formatDate(new Date(Number.parseInt(this.endTime) * 1000))
      }
      this.primaryModal.show();
    }
  }

  // showTrajet() {
  //   this.selectedTab = 4
  //   this.resetValidator()
  //   this.ToInvalidate = Math.random().toString();
  //   if (this.selectedDriver == null) {
  //     this.onValidateDriver()
  //   } else {
  //     this.trajetStartTime = this.myDateRangePicker.getDateFrom.toString();
  //     this.trajetEndTime = this.myDateRangePicker.getDateTo.toString();
  //     this.trajetSelectedDevice = this.selectedDriver;
  //   }
  // }

  showArretChange(e) {
    this.isArret = e
  }

  // openMapPoints(d: any) {
  //   this.selectedMapDevice = d ? d : "";
  //   if (this.reportDataCarburant?.length && this.selectedMapDevice != "") {
  //     this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
  //     this.interval = " Carburant"
  //     this.timestamps = this.reportDataCarburant.map((e) => { return e.ts })
  //     this.primaryModal.show()
  //   }
  // }

  getVehiculeNameById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].name
    }
    return ""
  }

  getVehiculeExtraById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return { "fe": this.devices[i].fe, "fc": this.devices[i].fc, "cp": this.devices[i].cp, "offset": this.devices[i].offset }
    }
    return { "fe": 0, "fc": 0, "cp": 0, "offset": 0 }
  }

  getVehiculeCapacityById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].cp
    }
    return 0
  }

  getVehiculeOffsetById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].offset
    }
    return 0
  }

  exporter(type) {
    var title = " Entre " +
      this.tools.formatDate(new Date((this.myDateRangePicker.getDateFrom) * 1000)) + " et " +
      this.tools.formatDate(new Date((this.myDateRangePicker.getDateTo) * 1000))
    if (this.selectedTab == 1)
      type == 1 ? this.exportingPdfTool.exportPdf_TrajetsEco(this.isArret ? this.reportData : this.reportDataTrajet, "Rapport des Trajets pour " + this.tools.getDriverName(this.drivers, this.selectedDriver) + " \n" + title) :
        this.exportingExcelTool.ExportTrajetEco(this.isArret ? this.reportData : this.reportDataTrajet, "Rapport des Trajets pour " + this.tools.getDriverName(this.drivers, this.selectedDriver) + " \n" + title)
    else if (this.selectedTab == 0)
      this.exportingPdfTool.convetToPDF("cardResume", "Rapport Resume pour " + this.tools.getDriverName(this.drivers, this.selectedDriver) + " \n" + title)
    else if (this.selectedTab == 2)
      this.exportingPdfTool.convetToPDF("cardAragner", "Rapport Pénalités de " + this.tools.getDriverName(this.drivers, this.selectedDriver) + " \n" + title)
    else if (this.selectedTab == 3)
      this.exportingPdfTool.convetToPDF("cardEvolution", "Rapport d'Evolution pour " + this.tools.getDriverName(this.drivers, this.selectedDriver) + " \n" + title)
    // else if (this.selectedTab == 4)
    //   this.exportingPdfTool.convetToPDF("trajetMap", "Trajet carte pour " + this.tools.getDriverName(this.drivers,this.selectedDriver) + " \n" + title)
  }

  round2d(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }
}


