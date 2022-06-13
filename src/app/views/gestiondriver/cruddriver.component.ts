import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import {ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'cruddriver.component.html',
  providers: [DatePipe]
})
export class CruddriverComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('dateexp') dateexp: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('dayexp') dayexp: ElementRef;
  @ViewChild('note') note: ElementRef;
  @ViewChild('restriction') restriction: ElementRef;
  @ViewChild('vehiculeid') vehiculeid: ElementRef;
  @ViewChild('matricul') matricul: ElementRef;
  @ViewChild('description') description: ElementRef;
  @ViewChild('num') num: ElementRef;
  @ViewChild('titlevehicule') titlevehicule: ElementRef;
  @ViewChild('explic') explic: ElementRef;
  @ViewChild('dateexplic') dateexplic: ElementRef;
  @ViewChild('numlic') numlic: ElementRef;
  @ViewChild('typelic') typelic: ElementRef;
  @ViewChild('naissance') naissance: ElementRef;
  @ViewChild('numtel') numtel: ElementRef;
  @ViewChild('nom') nom: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('iddriver') iddriver: ElementRef;
  @ViewChild('idbadge') idbadge: ElementRef;
  constructor(private dataService: DataService, private datePipe:DatePipe) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  public isnotNum: boolean = false
  displayedColumns: any= ["Véhicule","Device","Num de Tel"]

  
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
        this.dataService.getPlanEntretien(urlParams).subscribe({ // modifier============================
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
    this.address.nativeElement.value= ''
    this.dayexp.nativeElement.value= ''
    this.note.nativeElement.value= ''
    this.restriction.nativeElement.value= ''
    this.vehiculeid.nativeElement.value= ''
    this.dateexp.nativeElement.value= ''
    this.matricul.nativeElement.value= ''
    this.description.nativeElement.value= ''
    this.num.nativeElement.value= ''
    this.titlevehicule.nativeElement.value= ''
    this.explic.nativeElement.value= ''
    this.dateexplic.nativeElement.value= ''
    this.numlic.nativeElement.value= ''
    this.typelic.nativeElement.value= ''
    this.naissance.nativeElement.value= ''
    this.numtel.nativeElement.value= ''
    this.email.nativeElement.value= ''
    this.iddriver.nativeElement.value= ''
    this.nom.nativeElement.value= ''
    this.idbadge.nativeElement.value= ''
    
    
  }


}


