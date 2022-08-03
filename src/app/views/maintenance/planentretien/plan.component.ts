import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { util } from '../../../tools/utils';
import { Router } from '@angular/router';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { PlanEntretien } from 'src/app/models/planEnretien';

@Component({
  templateUrl: 'plan.component.html',
})
export class PlanComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedPlan = new PlanEntretien();
  errorMsg: string;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, private exportingTool: ExportingTool, private router: Router) { }

  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  public isnotNum: boolean = false
  displayedColumns: any = ["Actions", "Véhicule", "Date de Création", "Type d'Opération", "Déclenchement", "Anticipant"]


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

  getSelectedOperation(selected) {
    // console.log(selected);
    this.selectedPlan.operation = selected;
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
    // this.loadData(true)
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
    this.selectedPlan.device = selected;
  }

  //////////////////////
  loadData(first = false) {
    var route = this.router
    this.loading = true;
    var urlParams = ""
    if (!first)
      urlParams = "?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    this.dataService.getPlanEntretien(urlParams).subscribe({
      next: (d: any) => {
        console.log(d);
        this.data = d;
        this.data.forEach((e) => {
          e.DateCreation = this.tools.formatDate(new Date(Number.parseInt(e.DateCreation) * 1000));
          e.DateSaisie = this.tools.formatDate(new Date(Number.parseInt(e.DateSaisie) * 1000));
          // if (e.da) e.da = Math.round(Number.parseInt(e.da) / 60);
        })
        this.loading = false;
      }, error(err) {
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  getDev() {
    var route = this.router
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  loadModify(ev) {
    this.mode = "Modifier"
    this.selectedPlan = new PlanEntretien();
    // this.resetRulesAffectation()
    if (ev) {
      // this.selectedPlan...
      this.primaryModal.show()
    }
  }

  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    this.errorMsg = ""
    // this.this.selectedPlan.device = this.resultedRule
    if (!this.selectedPlan.device || (!this.selectedPlan.decDate && !this.selectedPlan.decKm) || (!this.selectedPlan.decKmValue && !this.selectedPlan.decDateValue) || !this.selectedPlan.operation) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addRule(this.selectedPlan).subscribe({
        next: (res) => {
          console.log("added", res)
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
    if (!this.selectedPlan.device || (!this.selectedPlan.decDate && !this.selectedPlan.decKm) || (!this.selectedPlan.decKmValue && !this.selectedPlan.decDateValue) || !this.selectedPlan.operation) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateRule(this.selectedPlan).subscribe({
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

  delete(plan) {
    if (confirm("Are you sure you want to delete " + plan)) {
      var route = this.router
      var u = "?id=" + plan
      this.dataService.delRule(u).subscribe({
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

  reset() {
    this.selectedDevices = null
    this.selectedDevice = null
  }

  exporter() {
    this.exportingTool.exportexcel("trajetTable", "Rapport Trajet")
  }

}


