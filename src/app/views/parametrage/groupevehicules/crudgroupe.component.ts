import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Groupevehicules } from '../../../models/groupevehicules';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'crudgroupe.component.html',
})
export class CrudgroupeComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  constructor(private dataService: DataService, private router: Router) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  mode = "Ajouter"
  errorMsg: string;
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
    // console.log(this.selectedDevice?.join(" , ").trim());

    this.selectedGroupevehicules.vehiclues = selected;
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  loadData() {
    this.loading = true;

    var route = this.router
    this.dataService.getGroupeVehicules("").subscribe({
      next: (d: any) => {
        console.log(d);
        this.data = d;

        this.loading = false;
      }, error(err) {
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  loadModify(ev) {
    this.mode = "Modifier"
    this.selectedGroupevehicules = new Groupevehicules(ev[0], ev[1], ev[2]);
    if (ev) {
      var url = "?g=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getGroupeVehicules(url).subscribe({
        next: (d: any) => {
          console.log(d);
          this.selectedGroupevehicules.vehiclues = d.map(e => { return e.deviceID });
          this.selectedDevices = this.selectedGroupevehicules.vehiclues
          this.selectedDevice = this.selectedDevices
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })
    }
  }

  getDev() {
    var route = this.router
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        // console.log(res)
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getDeviceByName(e) {
    return this.devices.filter((v) => { return v.dID == e })[0].name
  }

  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    if (!this.selectedGroupevehicules.groupID || !this.selectedGroupevehicules.displayName) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addDevicesGroup(this.selectedGroupevehicules).subscribe({
        next: (res) => {
          console.log("add")
          this.loadData()
          this.primaryModal.hide()
          this.errorMsg = ""
        }
        , error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            this.errorMsg = "Erreur l'ajout est bloqué."
          }
        }
      })
    }
  }

  modifier() {
    var route = this.router
    if (!this.selectedGroupevehicules.groupID || !this.selectedGroupevehicules.displayName) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateDevicesGroup(this.selectedGroupevehicules).subscribe({
        next: (res) => {
          console.log("edit groupevehivule")
          this.loadData()
          this.primaryModal.hide()
          this.errorMsg = ""
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            this.errorMsg = "Erreur la modification est bloqué."
          }
        }
      })
    }
  }


  delete(group) {
    if (confirm("Are you sure to delete " + group)) {
      var route = this.router
      var g = "?g=" + group
      this.dataService.delDevicesGroup(g).subscribe({
        next: (res) => {
          this.loadData()
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            alert("Erreur, la suppression est bloqué")
          }
        }
      })

    }
  }

  showAddModal() {
    this.selectedGroupevehicules = new Groupevehicules();
    this.selectedDevice = []
    this.selectedDevices = []
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.primaryModal.show()
  }

  reset() {
    this.selectedDevice = []
    this.selectedDevices = []
  }

}


