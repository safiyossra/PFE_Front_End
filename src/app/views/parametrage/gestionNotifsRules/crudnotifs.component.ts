import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertRule } from '../../../models/alertRule';
import { Router } from '@angular/router';
import { util } from '../../../tools/utils'
import { ZoneService } from 'src/app/services/zone.service';
import { Constant } from 'src/app/tools/constants';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';

@Component({
  templateUrl: 'crudnotifs.component.html',
  styleUrls: ["./style.scss"]
})
export class CrudNotifsRulesComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedAlert = new AlertRule();
  errorMsg: string;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, public cnst: Constant, private zoneService: ZoneService, private router: Router, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  crons_rule = [{ name: "Non", val: "0" }, { name: "Oui", val: "1" }, { name: "5 Minutes", val: "5min" },
  { name: "15 Minutes", val: "15min" }, { name: "30 Minute", val: "30min" }, { name: "Hourly", val: "hourly" },
  { name: "Daily", val: "daily" }, { name: "Weekly", val: "weekly" },]

  isEditPermission = false
  isAddPermission = false

  selectedCrons = '0';
  data = [];
  POIs = []
  selectedPois1 = []
  selectedPois2 = []
  selectedPois3 = []
  selectedPoi1 = null
  selectedPoi2 = null
  selectedPoi3 = null
  rules = [false, false, false, false, false, false]
  disabledOptions = [false, false, true]
  rulesValues = [20, 0]
  groups: any = [];
  devices: any = [];
  selectedVs = '-';
  selectedGs = '-';
  selectedSs = '0';
  resultedRule = ""

  getSelectedGroup(selected) {
    this.selectedAlert.g = selected;
    var isNotGroup = (this.selectedAlert.g == null || this.selectedAlert.g == '-')
    var isNotV = (this.selectedAlert.v == null || this.selectedAlert.v == '-')
    this.disabledOptions[0] = !isNotGroup
    if (isNotGroup && isNotV) {
      this.disabledOptions[2] = true
      this.selectedSs = '0'
      this.selectedAlert.s = '0'
    }
  }

  getSelectedV(selected) {
    this.selectedAlert.v = selected;
    var isNotGroup = (this.selectedAlert.g == null || this.selectedAlert.g == '-')
    var isNotV = (this.selectedAlert.v == null || this.selectedAlert.v == '-')
    this.disabledOptions[0] = !isNotGroup
    if (isNotGroup && isNotV) {
      this.disabledOptions[2] = true
      this.selectedSs = '0'
      this.selectedAlert.s = '0'
    }
  }

  getSelectedS(selected) {
    this.selectedAlert.s = selected;
  }

  getSelectedCron(selected) {
    this.selectedAlert.ruleTag = selected;
  }

  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Parametrage_Alertes', 'Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_Alertes', 'Ajouter')
    this.loadData();
    this.loadPOIs();
    this.getGroup();
    this.getDev();
  }

  getGroup() {
    var route = this.router
    this.dataService.getGroupeVehicules("").subscribe({
      next: (res) => {
        this.groups = res;
        this.groups.unshift({ groupID: '*', description: 'Tout sélectionner' })
        this.groups.unshift({ groupID: '-', description: 'No Group (sélectionner par véhicule)' })
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getDev() {
    var route = this.router
    this.dataService.getVehicule().subscribe({
      next: (res) => {
        this.devices = res;
        this.devices.unshift({ dID: '*', name: 'Tout sélectionner' })
        this.devices.unshift({ dID: '-', name: 'No Véhicules (sélectionner par Groupe de véhicules)' })
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  loadData() {
    this.loading = true;
    var route = this.router
    this.dataService.getNotifRules("").subscribe({
      next: (d: any) => {
        // d.forEach(e => {
        //   e.lastLoginTime = this.tools.formatDate(new Date(Number.parseInt(e.lastLoginTime) * 1000));
        // });
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
    this.selectedAlert = new AlertRule();
    this.resetRulesAffectation()
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getNotifRules(url).subscribe({
        next: (d: any) => {
          d.rule.forEach(e => {
            e.creationTime = this.tools.formatDate(new Date(Number.parseInt(e.creationTime) * 1000));
          });
          if (d.rule && d.rule.length) {
            var tmp = d.rule[0]
            this.selectedAlert = new AlertRule(tmp.isActive, tmp.ruleID, tmp.creationTime, tmp.description, tmp.notifyEmail, tmp.ruleTag, tmp.minNotifyAge, "", '-', '0', '-')
            this.resultedRule = tmp.selector
          }

          if (d.ruleList && d.ruleList.length) {
            this.selectedSs = d.ruleList[0].statusCode.toString();
            this.selectedAlert.s = this.selectedSs
            this.selectedGs = d.ruleList[0].groupID
            this.selectedAlert.g = this.selectedGs
            this.selectedVs = d.ruleList[0].deviceID
            this.selectedAlert.v = this.selectedVs
          }
          this.reverse_operation(this.resultedRule)
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

  submit() {
    if (this.mode == "Ajouter") this.ajouter()
    if (this.mode == "Modifier") this.modifier()
  }

  ajouter() {
    var route = this.router
    this.errorMsg = ""
    this.selectedAlert.selector = this.resultedRule
    if (!this.selectedAlert.description || !this.selectedAlert.selector) {//!this.selectedAlert.ruleID || 
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (this.selectedAlert.selector == "") this.errorMsg = "Veuillez saisir un selector ."
      else {
        if (this.selectedAlert.notifyEmail && !this.tools.ValidateEmail(this.selectedAlert.notifyEmail)) this.errorMsg = "Vous avez saisi un email de notification invalid."
        else {
          this.dataService.addRule(this.selectedAlert).subscribe({
            next: (res) => {
              // console.log("added", res)
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
    }
  }

  modifier() {
    var route = this.router
    this.errorMsg = ""
    this.selectedAlert.selector = this.resultedRule
    if (!this.selectedAlert.description || !this.selectedAlert.selector) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (this.selectedAlert.notifyEmail && !this.tools.ValidateEmail(this.selectedAlert.notifyEmail)) this.errorMsg = "Vous avez saisi un email de notification invalid."
      else if (this.selectedAlert.selector == "") this.errorMsg = "Veuillez saisir un selector."
      else {
        this.dataService.updateRule(this.selectedAlert).subscribe({
          next: (res) => {
            this.errorMsg = ""
            this.loadData()
            this.primaryModal.hide()
            this.errorMsg = ""
          }, error(err) {
            console.log("error", err)
            this.modalLoading = false;
            this.errorMsg = "Erreur " + err
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
  }

  delete(rule) {
    if (confirm("Are you sure to delete " + rule)) {
      var route = this.router
      var u = "?id=" + rule
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

  loadPOIs() {
    var route = this.router
    this.zoneService.getData("?min").subscribe({
      next: (res: any) => {
        var POIs = []
        res.map((e: any) => {
          var poi = { name: e.description, val: e.geozoneID }
          POIs.push(poi)
        });
        this.POIs = POIs
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })

  }

  onPoiChange1(ev: any) {
    this.selectedPoi1 = ev
    this.interpret()
  }

  onPoiChange2(ev: any) {
    this.selectedPoi2 = ev
    this.interpret()
  }

  onPoiChange3(ev: any) {
    this.selectedPoi3 = ev
    this.interpret()
  }

  showAddModal() {
    this.resetRulesAffectation();
    this.resultedRule = "";
    this.resetRules();
    this.selectedAlert = new AlertRule();
    this.mode = "Ajouter"
    this.primaryModal.show()
  }

  interpret() {
    var text = ""
    // demarrage
    if (this.rules[0]) {
      text = "(true)"
    }
    // Speed
    if (this.rules[1]) {
      if (text != "") { text += "&&" }
      text += "$Speeding(" + this.rulesValues[0] + ")"
    }
    // DEPART
    if (this.rules[3]) {
      if (text != "") { text += "&&" };
      text += '$DEPART("' + this.selectedPoi2 + '")'
    }
    // Fuel
    if (this.rules[4]) {
      if (text != "") { text += "&&" };
      text += "($FuelDelta()<=" + this.rulesValues[1] / 100 + ")"
    }
    // InZone
    if (this.rules[2]) {
      if (text != "") { text += "&&" };
      text += '$InZone("' + this.selectedPoi1 + '")'
    }
    // Arrive
    if (this.rules[5]) {
      if (text != "") { text += "&&" };
      text += '$ARRIVE("' + this.selectedPoi3 + '")'
    }
    this.resultedRule = text
  }

  reverse_operation(query) {
    this.resetRules()
    //test demarrage
    if (this.cnst.regExpDemarrage.test(query)) {
      this.rules[0] = true
    }
    //test maximum vitesse
    if (this.cnst.RegExpSpeed.test(query)) {
      this.rules[1] = true
      var element = query.match(this.cnst.RegExpSpeed)[0]
      this.rulesValues[0] = Number.parseInt(element)
    }
    //test InZone
    if (this.cnst.RegExpInZone.test(query)) {
      this.rules[2] = true
      var element = query.match(this.cnst.RegExpInZone)[0]
      this.selectedPois1 = element
      this.selectedPoi1 = this.selectedPois1
    }
    //test depart
    if (this.cnst.RegExpDepart.test(query)) {
      this.rules[3] = true
      var element = query.match(this.cnst.RegExpDepart)[0]
      this.selectedPois2 = element
      this.selectedPoi2 = this.selectedPois2
    }
    //test fuel
    if (this.cnst.RegExpFuel.test(query)) {
      this.rules[4] = true
      var element = query.match(this.cnst.RegExpFuel)[0]
      this.rulesValues[1] = Number.parseInt(element) * 100
    }
    //test arrive
    if (this.cnst.RegExpArrive.test(query)) {
      this.rules[5] = true
      var element = query.match(this.cnst.RegExpArrive)[0]
      this.selectedPois3 = element
      this.selectedPoi3 = this.selectedPois3
    }
  }

  resetRules() {
    this.selectedPois1 = []
    this.selectedPois2 = []
    this.selectedPois3 = []
    this.selectedPoi1 = null
    this.selectedPoi2 = null
    this.selectedPoi3 = null
    this.rules = [false, false, false, false, false, false]
    this.rulesValues = [20, 0]
  }

  resetRulesAffectation() {
    this.selectedSs = "0"
    this.selectedAlert.s = this.selectedSs
    this.selectedGs = '-'
    this.selectedAlert.g = this.selectedGs
    this.selectedVs = '-'
    this.selectedAlert.v = this.selectedVs
  }


  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Alerts(this.data, "Rapport de Notifications Rules ") :
      this.exportingExcelTool.Export_Alerts(this.data, "Rapport de Notifications Rules ")
  }
}
