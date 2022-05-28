import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';


@Component({
  templateUrl: 'tabs.component.html',
})
export class TabsComponent {

  constructor(private dataService: DataService) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  selectedType1: string = "0";
  selectedType2: string = "0";
  selectedType3: string = "0";
  selectedType4: string = "0";
  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  reportData: any;
  displayedColumns: any[];
  columns: any[];
  reportDetails: any;

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
      label: "Km parcourue",
      data: "k"
    },
    {
      label: "Duree de conduite",
      data: "dc"
    },
    {
      label: "Duree d'arrets",
      data: "da"
    },
    {
      label: "Nbr d'arrets",
      data: "na"
    },
    {
      label: "Consom Fuel",
      data: "c"
    },
    {
      label: "Fuel moyenne",
      data: "cr"
    },
    {
      label: "Vitesse",
      data: "v"
    },
    {
      label: "Temperature",
      data: "t"
    },
  ];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;

  selectedkmConditions = [];
  selectedkm = this.selectedkmConditions;

  selectedparams1 = [];
  selectedparam1 = this.selectedparams1;

  selectedparams2 = [];
  selectedparam2 = this.selectedparams2;

  selectedparams3 = [];
  selectedparam3 = this.selectedparams3;

  selectedparams4 = [];
  selectedparam4 = this.selectedparams4;

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

  getSelectedparams1(selected) {
    // console.log(selected);
    this.selectedparam1 = selected;
  }

  getSelectedparams2(selected) {
    // console.log(selected);
    this.selectedparam2 = selected;
  }
  getSelectedparams3(selected) {
    // console.log(selected);
    this.selectedparam3 = selected;
  }
  getSelectedparams4(selected) {
    // console.log(selected);
    this.selectedparam4 = selected;
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
  public barChartLabels: string[] = Array.from({ length: 15 }, (x, i) => "Feb " + i);
  public barChartType = 'bar';
  public barChartLegend = true;

  public xVal: Number[] = Array.from({ length: 20 }, () => Math.floor(Math.random() * 40))
  public yVal: Number[] = Array.from({ length: 20 }, () => Math.floor(Math.random() * 40))
  public barChartData: any[] = [
    { data: this.xVal, label: 'Series A' },
    { data: this.xVal, label: 'Series B' },
    { data: this.xVal, label: 'Series c' },
    { data: this.xVal, label: 'Series d' }
  ];


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  submit() {
    this.resetValidator()
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      var paramstab = [];
      var iskm = ""
      if (this.selectedkm.length != 0)
        iskm = '&kilom=' + this.selectedkm
      if (this.selectedparam1.length != 0)
        paramstab.push(this.selectedparam1)
      if (this.selectedparam2.length != 0)
        paramstab.push(this.selectedparam2)
      if (this.selectedparam3.length != 0)
        paramstab.push(this.selectedparam3)
      if (this.selectedparam4.length != 0)
        paramstab.push(this.selectedparam4)

      paramstab = Array.from(new Set(paramstab))
      var requestparams = paramstab.join("&")
      if (requestparams != "") {
        var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.dateFrom.getTime() / 1000 + "&et=" + this.myDateRangePicker.dateTo.getTime() / 1000 + "&" + requestparams + iskm

        console.log(urlParams);
        this.dataService.getStatistique(urlParams).subscribe({
          next: (d: any) => {
            this.displayedColumns = ["Date", ...this.getColumnsNames(paramstab)]
            this.columns = ["timestamp", ...paramstab]
            d.forEach((e) => { e.timestamp = new Date(Number.parseInt(e.timestamp) * 1000).toDateString() })
            console.log(d);

            this.reportData = d;
          },
        })
      } else {
        this.onValidateParam()
      }
    }
  };

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

  getdetails() {
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      var urldetails = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.dateFrom.getTime() / 1000 + "&et=" + this.myDateRangePicker.dateTo.getTime() / 1000
      this.dataService.getDetails(urldetails).subscribe({
        next: (d) => {
          this.reportDetails = d;
          // console.log("data");
          // console.log(d);          
        },
      })
    }
  }

  getDev() {
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        // console.log(this.devices);
      },
      error: (errors) => {

      }
    })
  }

  reset() {
    this.selectedDevices = [],
      this.selectedkmConditions = [],
      this.selectedparams1 = [],
      this.selectedparams2 = [],
      this.selectedparams3 = [],
      this.selectedparams4 = []
  }

  resetkm() {
    this.selectedkmConditions = []
  }
  resetparam1() {
    this.selectedparams1 = []
  }
  resetparam2() {
    this.selectedparams2 = []
  }
  resetparam3() {
    this.selectedparams3 = []
  }
  resetparam4() {
    this.selectedparams4 = []
  }

  getParam(p: any) {
    return p == "t" ? "°C" : p == "v" ? "Km/h" : p == "da" || p == "dc" ? "H:min:s" : p == "c" || p == "cr" ? "L" : p == "k" ? "KM" : p == "na" ? "#" : ""
  }

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';
}


