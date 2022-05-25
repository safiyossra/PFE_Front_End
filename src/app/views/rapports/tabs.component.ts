import { Component, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';

import { DataService } from '../../services/data.service';
import { ConditionalExpr } from '@angular/compiler';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  templateUrl: 'tabs.component.html',
  styles: [
    `
  ::ng-deep .mat-select-arrow {
    color: white;
}
`
  ]
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
  displayColumns:any;

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
      data: "1"
    },
    {
      label: ">=100",
      data: "2"
    },
    {
      label: ">=150",
      data: "3"
    },
    {
      label: ">=200",
      data: "4"
    },
    {
      label: ">=300",
      data: "5"
    },
    {
      label: ">=400",
      data: "6"
    },
    {
      label: ">=600",
      data: "7"
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
    // {
    //   label: "Vitesse max",
    //   data: "v"
    // },
    // {
    //   label: "Vitesse min",
    //   data: "v"
    // },
    // {
    //   label: "Vitesse moy",
    //   data: "v"
    // },
    // {
    //   label: "Temperature max",
    //   data: "t"
    // },
    // {
    //   label: "Temperature min",
    //   data: "t"
    // },
    // {
    //   label: "Temperature moy",
    //   data: "t"
    // }
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

  // onToggleDropdown() {
  //   this.myDropdown.toggleDropdown();
  // }

  // resetAll() {
  //   this.selectedOptions = [];
  // }

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




  /// 
  toggle(column: string) {
    console.log('toggle');
    
   // this.displayColumns= [, 'DureeAr'];

    // let old = []
    // this.dataService.resultList$
    //   .subscribe(resultList => old = resultList);


    // let index = old.indexOf(column)
    // console.log('index : ' + index);

    // if (index > -1) {
    //   old.forEach((element, i) => {
    //     if (element == column) old.splice(i, 1);
    //   });
    //   console.log('new : ' + old);

    // } else {
    //   old.push(column)
    // }

    // this.dataService.updateResultList(old)
  }

  submit() {
   this.resetValidator()
    //console.log(this.myDateRangePicker.dateFrom, this.myDateRangePicker.dateTo.getTime()/1000, this.selectedDevice, this.selectedkm, this.selectedparam1, this.selectedparam2, this.selectedparam3, this.selectedparam4);
    if (this.selectedDevice.length == 0) {
      this.onValidateDevice()
    }
   
    var paramstab = [];
    if (this.selectedparam1.length != 0)
      paramstab.push(this.selectedparam1)
    if (this.selectedparam2.length != 0)
      paramstab.push(this.selectedparam2)
    if (this.selectedparam3.length != 0)
      paramstab.push(this.selectedparam3)
    if (this.selectedparam4.length != 0)
      paramstab.push(this.selectedparam4)

    var requestparams = Array.from(new Set(paramstab)).join("&")
    if (requestparams != "") {
      var urlParams = "?d=" + this.selectedDevice + "&st="+this.myDateRangePicker.dateFrom.getTime()/1000+"et="+this.myDateRangePicker.dateTo.getTime()/1000+"&" + requestparams
      console.log(urlParams);
      this.dataService.getStatistique().subscribe({
        next: (d) => {
          this.reportData = d;
        },

      })
    } else {
      this.onValidateParam()
    }

  };

  getDev() {
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        console.log(this.devices);
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

}


