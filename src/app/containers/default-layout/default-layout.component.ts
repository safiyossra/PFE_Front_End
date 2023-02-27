import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Constant } from 'src/app/tools/constants';
import { util } from 'src/app/tools/utils';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements AfterViewInit, OnInit, OnDestroy {
  public sidebarMinimized = true;
  public navItems = [];
  notifs = { v: 0, z: 0, d: 0, f: 0, other: 0, total: 0, maintenance: 0 }
  notifregx = { v: /\$Speeding/i, z1: /InZone/i, z2: /\$DEPART/i, z3: /\$Arrive/i, f: /\$FuelDelta()/i, d: /demarrage/i }
  username: String
  compte: String
  Dashboard = false
  Parametrage_Vehicules = false
  Parametrage_Alertes = false
  Parametrage_GroupeVehicules = false
  Parametrage_CarteCarburant = false
  Parametrage_Utilisateur = false
  Parametrage_Conducteur = false
  Maintenance_PlanEntretien = false
  Maintenance_Pneu = false
  Maintenance_Accidents = false
  Maintenance_Consommation = false
  Map_Vehicules = false
  Map_Comparaison = false
  Zones = false
  VehiculesPlusProches = false
  Rapports_RapportsDetailles = false
  Rapports_RapportsJournalier = false
  Rapports_RapportSynthetique = false
  Rapports_RapportAutomatique = false
  Eco_EcoConduite = false
  Eco_EcoDetailles = false
  Notifications = false
  TrajetPlanner = false
  inter: any
  constructor(private route: Router, private dataService: DataService, public tools: util, public cst: Constant) {
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username')
    this.compte = localStorage.getItem('compte')
    this.loadMenuBasedOnPermissions()
    this.loadGroupedUnseenNotifs()
  }

  ngAfterViewInit() {
    this.inter = setInterval(() => {
      this.loadGroupedUnseenNotifs()
    }, 20000)
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  loadMenuBasedOnPermissions() {
    var tmpNav = [...navItems]
    this.Dashboard = this.tools.isAuthorized('Dashboard', 'Afficher')
    this.Map_Vehicules = this.tools.isAuthorized('Map_Vehicules', 'Afficher')
    this.Map_Comparaison = this.tools.isAuthorized('Map_Comparaison', 'Afficher')
    this.Zones = this.tools.isAuthorized('Zones', 'Afficher')
    this.VehiculesPlusProches = this.tools.isAuthorized('VehiculesPlusProches', 'Afficher')
    this.Rapports_RapportsDetailles = this.tools.isAuthorized('Rapports_RapportsDetailles', 'Afficher')
    this.Rapports_RapportsJournalier = this.tools.isAuthorized('Rapports_RapportsJournalier', 'Afficher')
    this.Rapports_RapportSynthetique = this.tools.isAuthorized('Rapports_RapportSynthetique', 'Afficher')
    this.Rapports_RapportAutomatique = this.tools.isAuthorized('Rapports_RapportAutomatique', 'Afficher')
    this.Eco_EcoConduite = this.tools.isAuthorized('Eco_EcoConduite', 'Afficher')
    this.Eco_EcoDetailles = this.tools.isAuthorized('Eco_EcoDetailles', 'Afficher')
    this.Notifications = this.tools.isAuthorized('Notifications', 'Afficher')
    this.Parametrage_Vehicules = this.tools.isAuthorized('Parametrage_Vehicules', 'Afficher')
    this.Parametrage_Conducteur = this.tools.isAuthorized('Parametrage_Conducteur', 'Afficher')
    this.Parametrage_Utilisateur = this.tools.isAuthorized('Parametrage_Utilisateur', 'Afficher')
    this.Parametrage_CarteCarburant = this.tools.isAuthorized('Parametrage_CarteCarburant', 'Afficher')
    this.Parametrage_GroupeVehicules = this.tools.isAuthorized('Parametrage_GroupeVehicules', 'Afficher')
    this.Parametrage_Alertes = this.tools.isAuthorized('Parametrage_Alertes', 'Afficher')
    this.Maintenance_Consommation = this.tools.isAuthorized('Maintenance_Consommation', 'Afficher')
    this.Maintenance_Accidents = this.tools.isAuthorized('Maintenance_Accidents', 'Afficher')
    this.Maintenance_Pneu = this.tools.isAuthorized('Maintenance_Pneu', 'Afficher')
    this.Maintenance_PlanEntretien = this.tools.isAuthorized('Maintenance_PlanEntretien', 'Afficher')
    this.TrajetPlanner = this.tools.isAuthorized('TrajetPlanner', 'Afficher')
    if (!this.Dashboard) { delete tmpNav[0] }
    if (!this.Map_Vehicules && !this.Map_Comparaison) {
      delete tmpNav[1]
    } else {
      if (!this.Map_Vehicules) { delete tmpNav[1]['children'][0] }
      if (!this.Map_Comparaison) { delete tmpNav[1]['children'][1] }
      tmpNav[1]['children'] = tmpNav[1]['children'].filter(function () { return true; });
    }
    if (!this.Zones) { delete tmpNav[2] }
    if (!this.VehiculesPlusProches) { delete tmpNav[3] }
    if (!this.Rapports_RapportsDetailles && !this.Rapports_RapportsDetailles && !this.Rapports_RapportSynthetique && !this.Rapports_RapportAutomatique) {
      delete tmpNav[4]
    } else {
      if (!this.Rapports_RapportsDetailles) { delete tmpNav[4]['children'][0] }
      if (!this.Rapports_RapportsJournalier) { delete tmpNav[4]['children'][1] }
      if (!this.Rapports_RapportSynthetique) { delete tmpNav[4]['children'][2] }
      if (!this.Rapports_RapportAutomatique) { delete tmpNav[4]['children'][3] }
      tmpNav[4]['children'] = tmpNav[4]['children'].filter(function () { return true; });
    }
    if (!this.Eco_EcoConduite && !this.Eco_EcoDetailles) {
      delete tmpNav[5]
    } else {
      if (!this.Eco_EcoConduite) { delete tmpNav[5]['children'][0] }
      if (!this.Eco_EcoDetailles) { delete tmpNav[5]['children'][1] }
      tmpNav[5]['children'] = tmpNav[5]['children'].filter(function () { return true; });
    }
    if (!this.Parametrage_Vehicules && !this.Parametrage_Conducteur && !this.Parametrage_Utilisateur && !this.Parametrage_CarteCarburant && !this.Parametrage_GroupeVehicules && !this.Parametrage_Alertes) {
      delete tmpNav[6]
    }
    // if (!this.Maintenance_Pneu && !this.Maintenance_Consommation && !this.Maintenance_Accidents && !this.Maintenance_PlanEntretien) {
      // delete tmpNav[7]
    // }
    if (!this.Notifications) { delete tmpNav[8] }
    if (!this.TrajetPlanner) { delete tmpNav[9] }
    this.navItems = tmpNav.filter(function () { return true; });
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['login']);
  }

  loadGroupedUnseenNotifs() {
    var route = this.route

    this.dataService.getGroupedUnseenNotifs().subscribe({
      next: (res: any) => {
        var notifsTmp = { v: 0, z: 0, d: 0, f: 0, other: 0, total: 0, maintenance: 0 }

        if (res) {
          notifsTmp.maintenance = res.maintenanceCount;
          // console.log("res", res);

          if (res.alerts && res.alerts.length) {
            var tmp = res.alerts.map((v: any) => { return v.selector }).join("&&")
            var tab = tmp.split(/[&&||]+/)

            tab.forEach(e => {
              if (this.notifregx.v.test(e)) {
                notifsTmp.v++
              }
              if (this.notifregx.z1.test(e)) {
                notifsTmp.z++
              }
              if (this.notifregx.z2.test(e)) {
                notifsTmp.z++
              }
              if (this.notifregx.z3.test(e)) {
                notifsTmp.z++
              }
              if (this.notifregx.d.test(e)) {
                notifsTmp.d++
              }
              if (this.notifregx.f.test(e)) {
                notifsTmp.f++
              }
            });
            notifsTmp.other = tab.length - (notifsTmp.v + notifsTmp.z + notifsTmp.f)
            notifsTmp.total = tab.length + notifsTmp.maintenance;
          }

          this.notifs = notifsTmp;
        }
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  destroy() {
    if (this.inter) {
      clearInterval(this.inter);
      this.inter = null;
    }
  }
}
