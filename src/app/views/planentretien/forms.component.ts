import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
@Component({
  templateUrl: 'forms.component.html'
})
export class FormsComponent {


  device = new FormControl('', [Validators.required]);

  getErrorMessage() {
    // if (this.device.hasError('required')) 
      return 'You must select a device';
    
  }

  
  constructor(private dataService: DataService) { }

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  public devices: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;
  showErrorDevice = false;
  errorMessageDevice = "";

  public operations: any = [];
  selectedOperations = null;
  selectedOperation = this.selectedOperations;
  showErrorOperation = false;
  errorMessageOperation = "";
  getSelectedDevices(selected) {
    // console.log(selected);
    this.selectedDevice = selected;
  }
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


  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  ngOnInit(){
    this.getDev();
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
    this.selectedDevices = [],
    this.selectedOperations = []
  }

}
