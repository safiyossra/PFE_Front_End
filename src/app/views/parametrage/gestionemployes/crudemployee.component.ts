import {Component, ViewChild} from '@angular/core';
import {Driver} from "../../../models/driver";
import {ModalDirective} from "ngx-bootstrap/modal";
import {DataService} from "../../../services/data.service";
import {util} from "../../../tools/utils";
import {Constant} from "../../../tools/constants";
import {Router} from "@angular/router";
import {ExportingTool} from "../../../tools/exporting_tool";
import {ExportExcel} from "../../../tools/export-excel";
import {Device} from "../../../models/device";
import {
  MyDateRangePickerComponent,
  MyDateRangePickerOptions
} from "../../components/my-date-range-picker/my-daterangepicker.component";
import {Groupevehicules} from "../../../models/groupevehicules";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Employee} from "../../../models/employee";

@Component({
  selector: 'app-crudemployee',
  templateUrl: './crudemployee.component.html',
  styleUrls: ['./crudemployee.component.scss']
})
export class CrudemployeeComponent {
  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  constructor(private dataService: DataService, private router: Router,public tools: util,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  mode = "Ajouter"
  isEditPermission = false
  isAddPermission = false
  errorMsg: string;
  public isnotNum: boolean = false
  // displayedColumns: any = ["Véhicule", "Device", "Num de Tel"]
  modalLoading: boolean = false;
  selectedEmployee: Employee = new Employee();

  // showErrorDevice = false;
  // errorMessageDevice = "";


  // resetValidator() {
  //   this.showErrorDevice = false;
  //   this.errorMessageDevice = "";
  // }
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Parametrage_GroupeVehicules','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_GroupeVehicules','Ajouter')
    // this.getDev();
    this.loadData();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

  }

  // getSelectedDevices(selected) {
  //   this.selectedDevice = selected;
  //   // console.log(this.selectedDevice?.join(" , ").trim());
  //
  //   this.selectedGroupevehicules.vehiclues = selected;
  // }

  // onValidateDevice() {
  //   this.showErrorDevice = !this.showErrorDevice;
  //   this.errorMessageDevice = "This field is required";
  // }

  loadData() {
    this.loading = true;

    var route = this.router
    this.dataService.getEmployees("").subscribe({
      next: (d: any) => {
        this.data = d;
        // console.log(d);
        this.loading = false;
      }, error(err) {
        console.log(err);
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  loadModify(ev) {
    this.mode = "Modifier"
    if (ev) {
      var url = "?id=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getEmployees(url).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.selectedEmployee = new Employee(res.employeeId,res.lastName,res.firstName, res.address, res.city, res.tel, res.email, res.fonction, res.login);

          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      });
    }
  }

  // getDev() {
  //   var route = this.router
  //   this.dataService.getVehicule().subscribe({
  //     next: (res) => {
  //       this.devices = res;
  //       // console.log(res)
  //     }, error(err) {
  //       if (err.status == 401) {
  //         route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //       }
  //     }
  //   })
  // }
  //
  // getDeviceByName(e) {
  //   return this.devices.filter((v) => { return v.dID == e })[0].name
  // }

  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    if (!this.selectedEmployee.firstName ||
      !this.selectedEmployee.lastName || !this.selectedEmployee.tel ) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addEmployee(this.selectedEmployee)
        .pipe(
          catchError(err => {
            console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Groupe avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
              console.log(this.errorMsg);
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res) => {
            // console.log("add")
            this.loadData()
            this.primaryModal.hide()
            this.errorMsg = ""
          }
        })
    }

  }

  modifier() {
    var route = this.router
    if (!this.selectedEmployee.employeeId || !this.selectedEmployee.firstName ||
      !this.selectedEmployee.lastName || !this.selectedEmployee.tel) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateEmployee(this.selectedEmployee)
        .pipe(
          catchError(err => {
            console.log("res", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur "+err
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }

            else if (err.status == 400) {
              console.log(err);
              this.errorMsg = "Employé avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
              console.log(this.errorMsg);
            }

            else if (err.status == 402) {
              this.errorMsg = "Erreur l'ajout est bloqué."
            }
            return throwError(err);
          })
        )
        .subscribe({
          next: (res) => {
            // console.log("edit groupevehivule")
            this.loadData()
            this.primaryModal.hide()
            this.errorMsg = ""
          }
        })
    }
  }


  delete(employee) {
    if (confirm("Are you sure to delete " + employee)) {
      var route = this.router
      var employ = "?employ=" + employee
      this.dataService.deleteEmployee(employee).subscribe({
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
    this.selectedEmployee = new Employee();
    // this.selectedDevice = []
    // this.selectedDevices = []
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.primaryModal.show()
  }

  reset() {
    // this.selectedDevice = []
    // this.selectedDevices = []
  }


  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_GroupeVehicules(this.data, "Rapport des Employés " ) :
      this.exportingExcelTool.Export_GroupVehicules(this.data, "Rapport des Employés ")
  }

}
