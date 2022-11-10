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
  public navItems = navItems;
  notifs = { v: 0, z: 0, d: 0, f: 0, other: 0, total: 0, maintenance: 0 }
  notifregx = { v: /\$Speeding/i, z1: /InZone/i, z2: /\$DEPART/i, z3: /\$Arrive/i, f: /\$FuelDelta()/i, d: /demarrage/i }
  username: String
  compte: String
  Dashboard = false
  Parametrage_Vehicules = false
  Map_Vehicules = false
  Map_Comparaison = false
  Zones = false
  VehiculesPlusProches = false
  Rapports_RapportsDetailles = false
  Rapports_RapportsJournalier = false
  Rapports_RapportSynthetique = false
  Eco_EcoConduite = false
  Eco_EcoDetailles = false
  Notifications = false
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
    this.Dashboard = this.tools.isAuthorized('Dashboard', 'Afficher')
    this.Map_Vehicules = this.tools.isAuthorized('Map_Vehicules', 'Afficher')
    this.Map_Comparaison = this.tools.isAuthorized('Map_Comparaison', 'Afficher')
    this.Zones = this.tools.isAuthorized('Zones', 'Afficher')
    this.VehiculesPlusProches = this.tools.isAuthorized('VehiculesPlusProches', 'Afficher')
    this.Rapports_RapportsDetailles = this.tools.isAuthorized('Rapports_RapportsDetailles', 'Afficher')
    this.Rapports_RapportsJournalier = this.tools.isAuthorized('Rapports_RapportsJournalier', 'Afficher')
    this.Rapports_RapportSynthetique = this.tools.isAuthorized('Rapports_RapportSynthetique', 'Afficher')
    this.Eco_EcoConduite = this.tools.isAuthorized('Eco_EcoConduite', 'Afficher')
    this.Eco_EcoDetailles = this.tools.isAuthorized('Eco_EcoDetailles', 'Afficher')
    this.Notifications = this.tools.isAuthorized('Notifications', 'Afficher')
    this.Parametrage_Vehicules = this.tools.isAuthorized('Parametrage_Vehicules', 'Afficher')
    if (!this.Dashboard) { delete this.navItems[0] }
    if (!this.Map_Vehicules && !this.Map_Comparaison) {
      delete this.navItems[1]
    } else {
      if (!this.Map_Vehicules) { delete this.navItems[1]['children'][0] }
      if (!this.Map_Comparaison) { delete this.navItems[1]['children'][1] }
      this.navItems[1]['children'] = this.navItems[1]['children'].filter(function () { return true; });
    }
    if (!this.Zones) { delete this.navItems[2] }
    if (!this.VehiculesPlusProches) { delete this.navItems[3] }
    if (!this.Rapports_RapportsDetailles && !this.Rapports_RapportsDetailles && !this.Rapports_RapportSynthetique) {
      delete this.navItems[4]
    } else {
      if (!this.Rapports_RapportsDetailles) { delete this.navItems[4]['children'][0] }
      if (!this.Rapports_RapportsJournalier) { delete this.navItems[4]['children'][1] }
      if (!this.Rapports_RapportSynthetique) { delete this.navItems[4]['children'][2] }
      this.navItems[4]['children'] = this.navItems[4]['children'].filter(function () { return true; });
    }
    if (!this.Eco_EcoConduite && !this.Eco_EcoDetailles) { 
      delete this.navItems[5]
     } else {
      if (!this.Eco_EcoConduite) { delete this.navItems[5]['children'][0] }
      if (!this.Eco_EcoDetailles) { delete this.navItems[5]['children'][1] }
      this.navItems[5]['children'] = this.navItems[5]['children'].filter(function () { return true; });
    }
    if (!this.Notifications) { delete this.navItems[8] }
    this.navItems = this.navItems.filter(function () { return true; });
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
