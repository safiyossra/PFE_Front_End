import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'crudgroupe.component.html',
  providers: [DatePipe]
})
export class CrudgroupeComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('id') id: ElementRef;
  @ViewChild('pushpin') pushpin: ElementRef;
  @ViewChild('report') report: ElementRef;
  @ViewChild('description') description: ElementRef;

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


  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }

  dropdownList = [];
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

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }


  getDev() {
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        console.log(res)
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

    this.report.nativeElement.value= ''
    this.id.nativeElement.value= ''
    this.description.nativeElement.value= ''
    this.pushpin.nativeElement.value= '' 
    
  }

onItemSelect(item: any) {
    console.log('onItemSelect', item);
}
onItemDeSelect(item: any) {
    console.log('onItemDeSelect', item);
}
onSelectAll(items: any) {
    console.log('onSelectAll', items);
}
onUnSelectAll() {
    console.log('onUnSelectAll fires');
}

}


