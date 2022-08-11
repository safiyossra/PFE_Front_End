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
export class DetailleComponent implements AfterViewInit {
  sub: any
  vehiculeID: any
  loading: boolean = false
  isArret: boolean = false
  loadingcharts: boolean = false
  TrajetDetaillID = "TrajetDetaill"
  ParkingDetaillID = "ParkingDetaill"
  DetaillID = "Detaill"

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private tools: util, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel, private router: Router) {
  }
  ngAfterViewInit(): void {
    if (this.vehiculeID) {
      this.selectedTab = 3
      this.selectedDevices = this.vehiculeID;
      this.selectedDevice = this.selectedDevices;
      this.submit()
    }
  }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  iconCollapseD: string = 'icon-arrow-up';
  reportDataTrajet: any;
  reportData: any;
  reportDataArrets: any;
  reportDataCarburant: any;
  reportDataConsommation: any;
  reportDetails: any;
  displayedColumns: any = ["Depart", "Arrivé", "Adresse Depart", "Adresse Arivée", "Km Parcourue", "Durée de conduite (min)", "Max Vitesse (km/h)", "# Arrets", "Consom Fuel (L)", "Consom (%)", "Consom (MAD)", "Consom Théorique (L)"]
  columns: any = ["timeStart", "timeEnd", "addi", "addf", "k", "dc", "v", "na", "c", "cm", "cd", "ct"];

  displayedColumnsArrets: any = ["Début", "Fin", "Adresse", "Durée (min)"]
  columnsArrets: any = ["timeStart", "timeEnd", "addi", "da"];
  displayedColumnsCarburant: any = ["Date/Heure", "ID", "Vehicule", "Latitude/Longitude", "Carburant total (L)", "Carburant avant (L)", "Carburant après (L)", "Carburant diff (L)", "Odomètre", "Adresse"]
  columnsCarburant: any = ["timestamp", "deviceID", "device", "latlng", "fuelTotal", "fuelstart", "fuelLevel", "deltaFuelLevel", "odometerKM", "address"];

  dColumnsRealCarburant: any = [
    "Carburant consommation (L)",
    "Pose carburat (L)",
    "Difference",
    "Odometre Consommation",
    "Odometre GPS",
    "Date"
  ]
  columnsRealCarburant: any = [
    "Carburant consommation (L)",
    "Pose carburat (L)",
    "Difference",
    "Odometre Consommation",
    "Odometre GPS",
    "Date GPS"
  ];

  resume = [];
  exportEvts = null
  urldetails = "";
  urlEvolution = "";
  devices: any = [];
  selectedDevices = [];
  selectedDevice = null;
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
  showErrorDevice = false;
  errorMessageDevice = "";
  selectedTab = 0
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
      label: 'Vitesse (Km/h)'
    },
  ];
  public fuelChartData: Array<any> = [
    {
      data: [],
      label: 'Carburant (L)'
    },
  ];
  public tempChartData: Array<any> = [
    {
      data: [],
      label: 'Température °C'
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
  public resumeUnits: any = { "k": "KM", "da": "MIN", "dc": "MIN", "c": "L", "cd": "MAD", "ct": "L", "cm": "%", "v": "Km/h", "t": "°C", "na": " " };

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
    this.sub = this.activatedRoute.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.vehiculeID = params['id'] || null;
    });
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

  // generateAnalysisData(dateStart, dateEnd) {
  //   const date = new Date(dateStart * 1000);


  //   // const dates = [];
  //   const fromDb = undefined;
  //   var data = fromDb || {};;

  //   while (date <= new Date(dateEnd * 1000)) {
  //     data[`${this.tools.formatDateForInput(date)}`] = {
  //       "carburantConsom": 0,
  //       "carburantPose": 0,
  //       "odometreConsom": 0,
  //       "odometrePose": 0
  //     };

  //     date.setDate(date.getDate() + 1);
  //   }
  //   console.log(data);
  // }

  getConsommationAnalysis(urlParams) {
    this.dataService.getConsommation(urlParams + "&analysis=true").subscribe({
      next: (d: any[]) => {
        // if (d.length > 0)
        d.forEach(element => {
          element.ts = element.dateFill
        });

        this.reportDataConsommation = d;
        console.log("Consommations");
        console.log(this.reportDataConsommation);

        // concatinate the lists
        let concatLists = this.reportDataConsommation.concat(this.reportDataCarburant);

        // sort by timestamp
        (concatLists as any[]).sort(function (a, b) {
          return a - b;
        })

        console.log("Concatination of consommation and pose carburant");
        console.log(concatLists);

        // get minimum and maximum dates
        let dateMax = concatLists[0].ts;
        let dateMin = concatLists[(concatLists as any[]).length - 1].ts;

        console.log("date min: ", dateMin, " |    date max: ", dateMax);

        // console.log("Dates");
        // this.generateAnalysisData(dateMin, dateMax);

        const fromDb = undefined;
        var data = fromDb || {};

        (concatLists as any[]).forEach(element => {
          let date = this.tools.formatDateForInput(new Date(element.ts * 1000));
          if (!data.hasOwnProperty(date))
            data[`${date}`] = {
              "carburantConsom": 0,
              "carburantPose": 0,
              "odometreConsom": 0,
              "odometrePose": 0
            };
        });

        console.log(data);

        (concatLists as any[]).forEach(element => {
          let date = this.tools.formatDateForInput(new Date(element.ts * 1000));
          if (!data.hasOwnProperty(date))
            data[`${date}`] = {
              "carburantConsom": 0,
              "carburantPose": 0,
              "odometreConsom": 0,
              "odometrePose": 0
            };

          else {
            console.log(date);

            data[date]!.carburantConsom! += (element.qte ?? 0);
            data[date]!.carburantPose! += ((element.fuelLevel - element.fuelstart) ?? 0);
            data[date]!.odometreConsom! += (element.kmEncours ?? 0);
            data[date]!.odometrePose! += (element.odometerKM ?? 0);
          }
        });

        console.log(data);
      }
    });
  }

  //////////////////////
  submit() {
    this.resetValidator()
    if (this.selectedDevice == null) {
      this.onValidateDevice()
    } else {
      this.loading = true;
      this.selectedMapDevice = this.selectedDevice
      let extra = this.getVehiculeExtraById(this.selectedDevice)
      this.getdetails()
      if (this.selectedTab == 2) this.getEvolution(true)
      if (this.selectedTab == 4) this.showTrajet()
      // this.resume = []
      var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
      console.log(urlParams);

      var route = this.router
      this.dataService.getAllTrajets(urlParams).subscribe({
        next: (d: any) => {
          // console.log(d);
          d.forEach((e) => {
            e.st = e.timeStart;
            e.et = e.timeEnd;
            e.timeStart = this.tools.formatDate(new Date(Number.parseInt(e.timeStart) * 1000));
            e.timeEnd = this.tools.formatDate(new Date(Number.parseInt(e.timeEnd) * 1000));
            if (e.da) e.da = this.round2d(Number.parseInt(e.da) / 60);
            if (e.dc) e.dc = this.round2d(Number.parseInt(e.dc) / 60);
            e.cd = this.round2d(e.c * extra.fc);
            e.ct = extra.fe != 0 ? (e.k / (extra.fe != 0 ? extra.fe : 1)).toFixed(1) : "0";
            e.cm = (100 * (e.c / (e.k != 0 ? e.k : 1))).toFixed(1);
          })
          // if (!this.isArret)
          this.reportDataTrajet = d.filter((e) => { return e.trajet == 1 });
          // else
          this.reportData = d;
          this.reportDataArrets = d.filter((e) => { return e.trajet == 0 });
          this.reportDataArrets = this.reportDataArrets.map((e) => { return { "trajet": e.trajet, "st": e.st, "et": e.et, "timeStart": e.timeStart, "timeEnd": e.timeEnd, "addi": e.addi, "da": ((e.et - e.st) / 60).toFixed(2), } });
          this.selectedMapDevice = this.selectedDevice
          console.log("trajet et parking", this.reportData);
          console.log("parking", this.reportDataArrets);
          console.log("trajet", this.reportDataTrajet);

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
          resumetmp[length - 1].val = this.round2d(resumetmp[length - 3].val * extra.fc);
          resumetmp[length - 2].val = (100 * (resumetmp[length - 3].val / (resumetmp[0].val != 0 ? resumetmp[0].val : 1))).toFixed(1);
          this.resume = resumetmp
          this.loading = false;
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })

      // pose carburant data
      this.dataService.getPoseFuel(urlParams).subscribe({
        next: (d: any) => {
          console.log("Pose carburant data");
          console.log(d);
          d.forEach((e) => {
            e.timestamp = this.tools.formatDate(new Date(Number.parseInt(e.timestamp) * 1000));
            e.device = this.getVehiculeNameById(e.deviceID)
            var capacity = this.getVehiculeCapacityById(e.deviceID)
            e.fuelLevel = this.round2d(e.fuelLevel * capacity)
            e.deltaFuelLevel = this.round2d(e.deltaFuelLevel * capacity)
            e.fuelstart = this.round2d(e.fuelstart * capacity)
          })
          this.reportDataCarburant = d

          console.log(this.reportDataCarburant);
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })

      //Consommation
      this.getConsommationAnalysis(urlParams);
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
          return isNaN(p) ? this.round2d(p[e] + c[e]) : this.round2d(p + c[e])
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
    this.selectedTab = 2
    this.resetValidator()
    if (this.selectedDevice == null) {
      this.onValidateDevice()
    } else {
      let urlEvolution = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
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
        this.vitesseChartData = [
          {
            data: d.map((l) => { return l.v }),
            label: 'Vitesse (Km/h)'
          },
        ];
        this.fuelChartData = [
          {
            data: d.map((l) => { return l.f }),
            label: 'Carburant (L)'
          },
        ];
        this.tempChartData = [
          {
            data: d.map((l) => { return l.tmp }),
            label: 'Température °C'
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

  getdetails() {
    this.resetValidator()
    if (this.selectedDevice == null) {
      this.onValidateDevice()
    } else {
      this.selectedMapDevice = this.selectedDevice
      this.urldetails = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo + "&all"
    }
  }

  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        console.log("getDev",res);
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
    this.selectedDevice = null
  }

  openMap(v: any) {
    this.startTime = v.timeStart ? v.timeStart : "";
    this.endTime = v.timeEnd ? v.timeEnd : "";
    this.selectedMapDevice = v.selectedMapDevice ? v.selectedMapDevice : "";
    if (this.startTime != "" && this.selectedMapDevice != "") {
      this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
      this.interval = this.tools.formatDate(new Date(Number.parseInt(this.startTime) * 1000))
      if (this.endTime != "") {
        this.interval += " - " + this.tools.formatDate(new Date(Number.parseInt(this.endTime) * 1000))
      }
      this.primaryModal.show()
    }
  }

  showTrajet() {
    this.selectedTab = 4
    this.resetValidator()
    this.ToInvalidate = Math.random().toString();
    if (this.selectedDevice == null) {
      this.onValidateDevice()
    } else {
      this.trajetStartTime = this.myDateRangePicker.getDateFrom.toString();
      this.trajetEndTime = this.myDateRangePicker.getDateTo.toString();
      this.trajetSelectedDevice = this.selectedDevice;
    }
  }

  showArretChange(e) {
    this.isArret = e
  }

  openMapArrets(d: any) {
    // console.log(d);

    this.selectedMapDevice = d ? d : "";
    if (this.reportDataArrets?.length && this.selectedMapDevice != "") {
      this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
      this.interval = " Parkings"
      this.timestamps = this.reportDataArrets.map((e) => { return e.st })
      // console.log(this.timestamps);
      this.primaryModal.show()
    }
  }

  openMapPoints(d: any) {
    this.selectedMapDevice = d ? d : "";
    if (this.reportDataCarburant?.length && this.selectedMapDevice != "") {
      this.selectedMapDeviceName = this.getVehiculeNameById(this.selectedMapDevice)
      this.interval = " Carburant"
      this.timestamps = this.reportDataCarburant.map((e) => { return e.ts })
      this.primaryModal.show()
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

  getVehiculeCapacityById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].cp
    }
    return 0
  }

  exporter(type) {
    console.log(type);

    var title = " Entre " +
      this.tools.formatDate(new Date((this.myDateRangePicker.getDateFrom) * 1000)) + " et " +
      this.tools.formatDate(new Date((this.myDateRangePicker.getDateTo) * 1000))
    if (this.selectedTab == 1)
      type == 1 ? this.exportingPdfTool.exportPdf_Trajets(this.isArret ? this.reportData : this.reportDataTrajet, "Rapport des Trajets pour " + this.selectedDevice + " \n" + title) :
        this.exportingExcelTool.ExportTrajet(this.isArret ? this.reportData : this.reportDataTrajet, "Rapport des Trajets pour " + this.selectedDevice + " \n" + title)
    if (this.selectedTab == 3) {
      this.exportEvts = { type: type, force: Math.random() }
    }
    else if (this.selectedTab == 5)
      type == 1 ? this.exportingPdfTool.exportPdf_Parking(this.reportDataArrets, "Rapport de Parking pour " + this.selectedDevice + " \n" + title) :
        this.exportingExcelTool.ExportParking(this.reportDataArrets, "Rapport de Parking pour " + this.selectedDevice + " \n" + title)
    else if (this.selectedTab == 6)
      type == 1 ? this.exportingPdfTool.exportPdf_Parking(this.reportDataCarburant, "Rapport de Pose Carburant pour " + this.selectedDevice + " \n" + title) :
        this.exportingExcelTool.ExportParking(this.reportDataCarburant, "Rapport de Pose Carburant pour " + this.selectedDevice + " \n" + title)

  }

  exportEvents(v) {
    var title = " Entre " +
      this.tools.formatDate(new Date((this.myDateRangePicker.getDateFrom) * 1000)) + " et " +
      this.tools.formatDate(new Date((this.myDateRangePicker.getDateTo) * 1000))
    v.type == 1 ? this.exportingPdfTool.exportPdf_Events(v.data, "Rapport Détaillés pour " + this.selectedDevice + " \n" + title) :
      this.exportingExcelTool.ExportEvents(v.data, "Rapport Détaillés pour " + this.selectedDevice + " \n" + title)


  }

  round2d(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }
}


