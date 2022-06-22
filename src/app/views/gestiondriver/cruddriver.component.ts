import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import {ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
import { Driver } from '../../models/driver';

@Component({
  templateUrl: 'cruddriver.component.html',
  providers: [DatePipe]
})
export class CruddriverComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  selectedDriver: Driver = new Driver();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  // @ViewChild('dateexp') dateexp: ElementRef;
  // @ViewChild('address') address: ElementRef;
  // @ViewChild('dayexp') dayexp: ElementRef;
  // @ViewChild('note') note: ElementRef;
  // @ViewChild('restriction') restriction: ElementRef;
  // @ViewChild('vehiculeid') vehiculeid: ElementRef;
  // @ViewChild('matricul') matricul: ElementRef;
  // @ViewChild('description') description: ElementRef;
  // @ViewChild('num') num: ElementRef;
  // @ViewChild('titlevehicule') titlevehicule: ElementRef;
  // @ViewChild('explic') explic: ElementRef;
  // @ViewChild('dateexplic') dateexplic: ElementRef;
  // @ViewChild('numlic') numlic: ElementRef;
  // @ViewChild('typelic') typelic: ElementRef;
  // @ViewChild('naissance') naissance: ElementRef;
  // @ViewChild('numtel') numtel: ElementRef;
  // @ViewChild('nom') nom: ElementRef;
  // @ViewChild('email') email: ElementRef;
  // @ViewChild('iddriver') iddriver: ElementRef;
  // @ViewChild('idbadge') idbadge: ElementRef;
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
    this.loadData();

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
  // submit() {
  //   // this.resetValidator()
  //   // if (this.selectedDevice == null) {
  //   //   this.onValidateDevice()
  //   // } else {
  //     this.loading = true;
  //   var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
  //       this.dataService.getPlanEntretien(urlParams).subscribe({ // modifier============================
  //         next: (d: any) => {          
  //           console.log(d);
  //           this.data = d;
  //           this.data.forEach((e) => {
  //             e.timeStart = this.datePipe.transform( new Date(Number.parseInt(e.timeStart) * 1000),'yyyy-MM-dd  h:mm:ss');
  //             e.timeEnd = this.datePipe.transform( new Date(Number.parseInt(e.timeEnd) * 1000),'yyyy-MM-dd  h:mm:ss');
  //            // e.timeStart = new Date(Number.parseInt(e.timeStart) * 1000).toLocaleDateString();
  //             //e.timeEnd = new Date(Number.parseInt(e.timeEnd) * 1000).toLocaleDateString();
  //             if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
  //             if (e.dc) e.dc = Math.round(Number.parseInt(e.dc) / 60);
  //           })      
  //          this.loading = false;
  //         },
  //       })
  //   //  }
  // };

  loadData() {
    this.loading = true;
    var urlParams = "";
    if (this.selectedDevice != null) {
      urlParams += "?device=" + this.selectedDevice
    }
    this.dataService.getDriverData(urlParams).subscribe({
      next: (d: any) => {          
        console.log(d);
        this.data = d;     
       this.loading = false;
      }, error(err) {
        this.loading = false;
      },
    })
  };

  loadModify(ev) {
    this.selectedDriver = new Driver();
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()
      this.dataService.getDriverData(url).subscribe({
        next: (d: any) => {
          console.log(d);
          
          if (d && d.length) {
            d.forEach(e => {
              e.birthdate = this.formatDate(new Date(Number.parseInt(e.birthdate) * 1000));
              e.licenseExpire = this.formatDate(new Date(Number.parseInt(e.licenseExpire) * 1000));
              e.insuranceExpire = this.formatDate(new Date(Number.parseInt(e.insuranceExpire) * 1000));
            });
            this.selectedDriver = d[0];
          }
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
        },
    })
    }
  }
  delete(ev){

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
  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
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
    this.selectedDevice = []
  }


}


