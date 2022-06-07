import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'plan.component.html',
  providers: [DatePipe]
})
export class PlanComponent {

  loading: boolean = false;

  constructor(private dataService: DataService, private datePipe:DatePipe) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  iconCollapseD: string = 'icon-arrow-up';
  reportData: any;
  reportDetails: any;
  displayedColumns: any=["Depart","Arrivé","Km Parcourue","Duree de conduite (min)","Max Vitesse (km/h)", "# Arrets", "Duree arrets (min)", "Consom Fuel (L)", "Fuel moyenne (L)", "Max Temperature(°C)"]
  columns : any = ["timeStart","timeEnd","k","dc", "v", "na", "da", "c", "cr", "t"];

  resume = [];
  urldetails = "";
  
  public devices: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
  showErrorDevice = false;
  errorMessageDevice = "";
  // barChart

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [];
  
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
    "twitter", "google-plus", "gray" , "green" , "red","purple","yellow","pink"
  ];
  public resumeUnits: any = { "k": "KM", "da": "MIN", "dc": "MIN", "c": "L", "cr": "L", "v": "KM/H", "t": "°C", "na": " " };
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';


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
    // this.resetValidator()
    // if (this.selectedDevice.length == 0) {
    //   this.onValidateDevice()
    // } else {
      this.loading = true;
      this.resume = []
        var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.dateFrom.getTime() / 1000 + "&et=" + this.myDateRangePicker.dateTo.getTime() / 1000 
        this.dataService.getAllTrajets(urlParams).subscribe({
          next: (d: any) => {
          
            console.log(d);
            this.reportData = d;
            this.reportData.forEach((e) => {
              e.timeStart = this.datePipe.transform( new Date(Number.parseInt(e.timeStart) * 1000),'yyyy-MM-dd  h:mm:ss');
              e.timeEnd = this.datePipe.transform( new Date(Number.parseInt(e.timeEnd) * 1000),'yyyy-MM-dd  h:mm:ss');
             // e.timeStart = new Date(Number.parseInt(e.timeStart) * 1000).toLocaleDateString();
              //e.timeEnd = new Date(Number.parseInt(e.timeEnd) * 1000).toLocaleDateString();
              if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
              if (e.dc) e.dc = Math.round(Number.parseInt(e.dc) / 60);
            })
            let resumetmp = [];
            let labels = this.reportData.map((l) => { return l.timeStart })
            this.columns.forEach((e,index) => {
              if(!["timeStart","timeEnd"].includes(e))
              resumetmp.push({
                val: this.reduce(d, e).toString() + " " + this.resumeUnits[e],
                label: this.displayedColumns[index],
                labels: labels,
                data:
                  [
                    {
                      data: d.map((l) => { return l[e] }),
                      label: this.displayedColumns[index]
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
    //  }
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

  getdetails() {
    this.resetValidator()
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    } else {
      this.urldetails = "?d=" + this.selectedDevice + "&st=" + Math.round(this.myDateRangePicker.dateFrom.getTime() / 1000) + "&et=" + Math.round(this.myDateRangePicker.dateTo.getTime() / 1000) +"&all"
    }
    // this.dataService.getDetails(this.urldetails).subscribe({
    //   next: (d: any) => {
      
    //     console.log(d);
    //     this.reportDetails = d;
    //     this.reportDetails.forEach((e) => {
    //       e.timestamp = new Date(Number.parseInt(e.timestamp) * 1000).toDateString();
    //       e.odometerKM = Math.round(Number.parseInt(e.odometerKM));
    //       // if (e.dc) e.dc = Math.round(Number.parseInt(e.dc));
    //     })
    //    // this.loading = false;
    //   },
    // })
    
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
    this.selectedDevices = []
  }


  getParam(p: any) {
    return p == "t" ? "°C" : p == "v" ? "Km/h" : p == "da" || p == "dc" ? "H:min:s" : p == "c" || p == "cr" ? "L" : p == "k" ? "KM" : p == "na" ? "#" : ""
  }

}


