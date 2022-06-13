import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import {ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'plan.component.html',
  providers: [DatePipe]
})
export class PlanComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('compt1') input1: ElementRef;
  @ViewChild('compt2') input2: ElementRef;
  @ViewChild('motif') motif: ElementRef;
  @ViewChild('type') type: ElementRef;
  @ViewChild('modele') modele: ElementRef;
  constructor(private dataService: DataService, private datePipe:DatePipe) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  public isnotNum: boolean = false
  displayedColumns: any= ["Sélectionner","Véhicule","Date de Création","Type Opération","Déclenchement", "Anticipant"]

  
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
        { alias: 'ln', text: 'Last 90 days', operation: '-90d' },
        { alias: 'l2m', text: 'Last 2 months', operation: '-2m' },

        { alias: 'pmt', text: 'Past Month from Today', operation: '-1mt' },
        { alias: 'pwt', text: 'Past Week from Today', operation: '-1wt' },
        { alias: 'pyt', text: 'Past Year from Today', operation: '-1yt' },
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
    // this.resetValidator()
    // if (this.selectedDevice.length == 0) {
    //   this.onValidateDevice()
    // } else {
      this.loading = true;
        var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.dateFrom.getTime() / 1000 + "&et=" + this.myDateRangePicker.dateTo.getTime() / 1000 
        this.dataService.getPlanEntretien(urlParams).subscribe({
          next: (d: any) => {          
            console.log(d);
            this.data = d;
            this.data.forEach((e) => {
              e.timeStart = this.datePipe.transform( new Date(Number.parseInt(e.timeStart) * 1000),'yyyy-MM-dd  h:mm:ss');
              e.timeEnd = this.datePipe.transform( new Date(Number.parseInt(e.timeEnd) * 1000),'yyyy-MM-dd  h:mm:ss');
             // e.timeStart = new Date(Number.parseInt(e.timeStart) * 1000).toLocaleDateString();
              //e.timeEnd = new Date(Number.parseInt(e.timeEnd) * 1000).toLocaleDateString();
              if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
              if (e.dc) e.dc = Math.round(Number.parseInt(e.dc) / 60);
            })      
           this.loading = false;
          },
        })
    //  }
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


  ajouter(){
    
   
    // console.log(this.input1.nativeElement.value);
    // console.log(this.input2.nativeElement.value);
    // console.log(this.motif.nativeElement.value);
    // console.log(this.type.nativeElement.value);
    // console.log(this.modele.nativeElement.value);
    
  }

 
  reset() {
    this.selectedDevices = [],
    this.selectedDevicesModal = [],
    this.selectedOperations = [],
    this.input1.nativeElement.value= ''
    this.input2.nativeElement.value= ''
    this.motif.nativeElement.value= ''
    this.type.nativeElement.value= ''
    this.modele.nativeElement.value= ''
  }


}


