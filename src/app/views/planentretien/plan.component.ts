import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import {ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
import { util } from 'src/app/tools/utils';

@Component({
  templateUrl: 'plan.component.html',
})
export class PlanComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('compt1') input1: ElementRef;
  @ViewChild('compt2') input2: ElementRef;
  @ViewChild('motif') motif: ElementRef;
  @ViewChild('type') type: ElementRef;
  @ViewChild('modele') modele: ElementRef;
  constructor(private dataService: DataService, private tools: util) { }

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
    // if (this.selectedDevice == null) {
    //   this.onValidateDevice()
    // } else {
      this.loading = true;
    var urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
        this.dataService.getPlanEntretien(urlParams).subscribe({
          next: (d: any) => {          
            // console.log(d);
            this.data = d;
            this.data.forEach((e) => {
              e.timeStart = this.tools.formatDate(new Date(Number.parseInt(e.timeStart) * 1000));
              e.timeEnd = this.tools.formatDate(new Date(Number.parseInt(e.timeEnd) * 1000));
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


