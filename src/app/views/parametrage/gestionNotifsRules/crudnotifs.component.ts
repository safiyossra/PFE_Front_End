import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertRule } from '../../../models/alertRule';
import { Router } from '@angular/router';
import { util } from '../../../tools/utils'
import { ZoneService } from 'src/app/services/zone.service';
import { Constant } from 'src/app/tools/constants';

@Component({
  templateUrl: 'crudnotifs.component.html',
  styleUrls: ["./style.scss"]
})
export class CrudNotifsRulesComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedAlert = new AlertRule();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, public cnst: Constant, private zoneService: ZoneService, private router: Router) { }
  crons_rule = [{ name: "Non", val: "0" }, { name: "Oui", val: "1" }, { name: "Oui", val: "1" }, { name: "5 Minutes", val: "5min" },
  { name: "15 Minutes", val: "15min" }, { name: "30 Minute", val: "30min" }, { name: "Hourly", val: "hourly" },
  { name: "Daily", val: "daily" }, { name: "Weekly", val: "weekly" },]

  selectedCrons = '0';
  selectedCron = this.selectedCrons;
  data = [];
  POIs = []
  selectedPois1 = null
  selectedPois2 = null
  selectedPois3 = null
  selectedPoi1 = this.selectedPois1
  selectedPoi2 = this.selectedPois2
  selectedPoi3 = this.selectedPois3
  rules = [false, false, false, false, false, false]
  rulesValues = [20, 0]
  groups: any = [];
  selectedGs = '-';
  selectedG = this.selectedGs;
  devices: any = [];
  selectedVs = '-';
  selectedV = this.selectedVs;
  selectedSs = "0";
  selectedS = this.selectedSs;
  resultedRule = ""

  getSelectedGroup(selected) {
    this.selectedG = selected;
  }

  getSelectedV(selected) {
    this.selectedV = selected;
  }

  getSelectedS(selected) {
    this.selectedS = selected;
  }

  getSelectedCron(selected) {
    this.selectedCron = selected;
  }
  ngOnInit() {
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
        console.log(res)
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
        console.log(res);
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
    this.selectedAlert = new AlertRule();
    this.resetRulesAffectation()
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getNotifRules(url).subscribe({
        next: (d: any) => {
          console.log(d);
          d.rule.forEach(e => {
            e.creationTime = this.tools.formatDate(new Date(Number.parseInt(e.creationTime) * 1000));
          });
          if (d.rule && d.rule.length) {
            this.selectedAlert = d.rule[0]
            this.resultedRule = d.rule[0].selector
          }

          if (d.ruleList && d.ruleList.length) {
            this.selectedSs = d.ruleList[0].statusCode.toString();
            this.selectedS = this.selectedSs
            this.selectedGs = d.ruleList[0].groupID
            this.selectedG = this.selectedGs
            this.selectedVs = d.ruleList[0].deviceID
            this.selectedV = this.selectedVs
          }

          console.log(this.selectedSs,
            this.selectedS,
            this.selectedGs,
            this.selectedG,
            this.selectedVs,
            this.selectedV);

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

  ajouter() {

  }

  delete(ev) {

  }

  loadPOIs() {
    var route = this.router
    this.zoneService.getPoi().subscribe({
      next: (res: any) => {
        var POIs = []
        console.log(res);

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
    console.log(query);

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
    console.log("before InZone");
    if (this.cnst.RegExpInZone.test(query)) {
      console.log("InZone");

      this.rules[2] = true
      var element = query.match(this.cnst.RegExpInZone)[0]
      this.selectedPois1 = element
      this.selectedPoi1 = this.selectedPois1

      console.log(element);
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
    this.selectedPois1 = null
    this.selectedPois2 = null
    this.selectedPois3 = null
    this.selectedPoi1 = this.selectedPois1
    this.selectedPoi2 = this.selectedPois2
    this.selectedPoi3 = this.selectedPois3
    this.rules = [false, false, false, false, false, false]
    this.rulesValues = [20, 0]
  }

  resetRulesAffectation() {
    this.selectedSs = "0"
    this.selectedS = this.selectedSs
    this.selectedGs = '-'
    this.selectedG = this.selectedGs
    this.selectedVs = '-'
    this.selectedV = this.selectedVs
  }
}
