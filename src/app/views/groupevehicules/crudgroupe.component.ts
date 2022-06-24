import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Groupevehicules } from '../../models/Groupevehicules';

@Component({
  templateUrl: 'crudgroupe.component.html',
  providers: [DatePipe]
})
export class CrudgroupeComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  constructor(private dataService: DataService, private datePipe: DatePipe) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  mode = "Ajouter"
  public isnotNum: boolean = false
  displayedColumns: any = ["Véhicule", "Device", "Num de Tel"]
  modalLoading: boolean = false;
  selectedGroupevehicules: Groupevehicules = new Groupevehicules();
  


  public devices: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
  showErrorDevice = false;
  errorMessageDevice = "";


  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  ngOnInit() {
    this.getDev();
    this.loadData();
  }


  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  getSelectedDevices(selected) {
    this.selectedDevice = selected;
    console.log(this.selectedDevice?.join(" , ").trim());

  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  loadData() {
    this.loading = true;
    this.dataService.getGroupeVehicules("").subscribe({
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
    this.mode ="Modifier"
    this.selectedGroupevehicules = new Groupevehicules(ev[0],ev[1],ev[2]);
    if (ev) {
      var url = "?g=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()
      this.dataService.getGroupeVehicules(url).subscribe({
        next: (d: any) => {
          console.log(d);
             this.selectedGroupevehicules.vehiclues = d.map(e=> {return e.deviceID});
             this.selectedDevices=this.selectedGroupevehicules.vehiclues
             this.selectedDevice=this.selectedDevices
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
        },
    })
    }
  }

  delete(ev){

  }

  showAddModal(){
    this.selectedGroupevehicules = new Groupevehicules();
    this.mode = "Ajouter"
    this.primaryModal.show()
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

  getDeviceByName(e) {
    return this.devices.filter((v) => { return v.dID == e })[0].name
  }

  ajouter() {
    this.mode ="Ajouter"
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  reset() {
    this.selectedDevice = []
    this.selectedDevices = []

  }

}


