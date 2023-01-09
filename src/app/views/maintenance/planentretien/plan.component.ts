import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { util } from '../../../tools/utils';
import { Router } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { PlanEntretien } from 'src/app/models/planEnretien';
import { Constant } from 'src/app/tools/constants';
import { ExportExcel } from 'src/app/tools/export-excel';

@Component({
  templateUrl: 'plan.component.html',
})
export class PlanComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  currentKM = 0;
  selectedPlan = new PlanEntretien();
  errorMsg: string;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, public cts: Constant, private router: Router,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }

  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  isEditPermission = false
  isAddPermission = false
  public isnotNum: boolean = false
  displayedColumns: any = ["Actions", "Véhicule", "Type d'Opération", "Déclenchement", "Valeur", "Status", "Date de Création"]


  public devices: any = [];
  selectedDevices = [];
  selectedDevice = this.selectedDevices;

  selectedDevicesModal = [];
  selectedDeviceModal = this.selectedDevicesModal;

  public operations: any = [];
  selectedOperations = [];
  selectedOperation = this.selectedOperations;

  getSelectedOperation(selected) {
    // console.log(selected);
    this.selectedPlan.operation = selected;
  }

  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Maintenance_PlanEntretien','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Maintenance_PlanEntretien','Ajouter')
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
    this.loadData(true)
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
    this.selectedPlan.deviceID = selected;
    this.currentKM = this.getVehiculeKMById(selected)

  }

  //////////////////////
  loadData(first = false) {
    var route = this.router
    this.loading = true;
    var urlParams = ""
    if (!first) {
      var d = this.selectedDevice == null ? "?" : "?d=" + this.selectedDevice + "&"
      urlParams = d + "st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    }
    this.dataService.getPlanEntretien(urlParams).subscribe({
      next: (d: any) => {
        this.loading = false;
        this.data = d;
        this.data.forEach((e) => {
          e.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(e.creationTime ?? 0) * 1000));
          e.decDateValueString = this.tools.formatDateForInput(new Date(Number.parseInt(e.decDateValue ?? 0) * 1000));
          // if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
        })

      }, error(err) {
        console.log(err);
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getVehiculeKMById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].km
    }
    return 0
  }

  modalAjoutr() {
    this.mode = "Ajouter"
    this.selectedPlan = new PlanEntretien();
    this.selectedDevicesModal = []
    this.selectedOperations = []
    this.currentKM = null
    this.primaryModal.show()
  }

  loadModify(ev) {
    if (ev) {
      this.mode = "Modifier"
      this.selectedPlan = this.getJsonValue(ev);
      this.selectedDevicesModal = this.selectedPlan.deviceID
      this.selectedOperations = this.selectedPlan.operation.toString()
      this.currentKM = this.getVehiculeKMById(this.selectedPlan.deviceID)
      this.primaryModal.show()
    }
  }

  submit() {
    this.selectedPlan.decDateValue = (new Date(this.selectedPlan.decDateValueString)).getTime() / 1000

    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    this.errorMsg = ""
    // this.this.selectedPlan.device = this.resultedRule
    if (!this.selectedPlan.deviceID || (!this.selectedPlan.decKmValue && !this.selectedPlan.decDateValue) || !this.selectedPlan.operation) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addPlanEntretien(this.selectedPlan).subscribe({
        next: (res) => {
          this.loadData(true)
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
    this.errorMsg = ""
    if (!this.selectedPlan.deviceID || (!this.selectedPlan.decKmValue && !this.selectedPlan.decDateValue) || !this.selectedPlan.operation) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updatePlanEntretien(this.selectedPlan).subscribe({
        next: (res) => {
          this.errorMsg = ""
          this.loadData(true)
          this.primaryModal.hide()
          this.errorMsg = ""
        }, error(err) {
          console.log("error", err)
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

  close(plan) {
    if (confirm("Are you sure you want to close " + plan)) {
      var route = this.router
      var u = "?id=" + plan + "&status=closed"
      this.dataService.updateStatusPlanEntretien(u).subscribe({
        next: (res) => {
          this.loadData(true)
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

  delete(plan) {
    if (confirm("Are you sure you want to delete " + plan)) {
      var route = this.router
      var u = "?id=" + plan
      this.dataService.delPlanEntretien(u).subscribe({
        next: (res) => {
          this.loadData(true)
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

  reset() {
    this.selectedDevices = []
    this.selectedDevice = null
  }

  exporter(type) {
    var v = this.getJsonValue(this.data);
    v.forEach(e => {
     e.value = e.typeDeclenchement == 1 ? e.decKmValue : e.decDateValueString
     e.status = this.getStatusName(e.status)
     e.typeDeclenchement = this.getTypeDeclenchement(e.typeDeclenchement)
     e.operation =  this.getOperationById(e.operation)
    });
    type == 1 ? this.exportingPdfTool.exportPdf_Entretien(v, "Rapport de Plan d'entretien " ) :
    this.exportingExcelTool.Export_Entretien(v, "Rapport de Plan d'entretien ")
  }

  getJsonValue(v) {
    return JSON.parse(JSON.stringify(v))
  }

  getBgColorForStatus(s) {
    return s == "closed" ? 'bg-success' : s == 'obsolete' ? 'bg-danger' : ''
  }

  getStatusName(s) {
    return s == "closed" ? 'Clôturée' : s == 'obsolete' ? 'Dépassé' : 'En Cours'
  }

  getTypeDeclenchement(t) {
    return t == 1 ? 'Par KM' : 'Par Date'
  }

  getOperationById(id) {
    for (let i = 0; i < this.cts.planOperations.length; i++) {
      if (this.cts.planOperations[i].id == id) return this.cts.planOperations[i].name
    }
    return 0
  }
}


