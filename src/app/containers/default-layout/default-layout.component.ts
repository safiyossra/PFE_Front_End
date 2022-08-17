import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements AfterViewInit, OnInit, OnDestroy {
  public sidebarMinimized = true;
  public navItems = navItems;
  notifs = { v: 0, z: 0, d: 0, f: 0, other: 0, total: 0 }
  notifregx = { v: /\$Speeding/i, z1: /InZone/i, z2: /\$DEPART/i, z3: /\$Arrive/i, f: /\$FuelDelta()/i }
  username: String
  compte: String

  inter: any
  constructor(private route: Router, private dataService: DataService,) {

  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username')
    this.compte = localStorage.getItem('compte')
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

  logout() {
    localStorage.clear()
    this.route.navigate(['login']);

  }

  loadGroupedUnseenNotifs() {
    var route = this.route
    this.dataService.getGroupedUnseenNotifs().subscribe({
      next: (res: any) => {
        var notifsTmp = { v: 0, z: 0, d: 0, f: 0, other: 0, total: 0 }
        if (res && res.length) {
          var tmp = res.map((v: any) => { return v.selector }).join("&&")
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
            if (this.notifregx.f.test(e)) {
              notifsTmp.f++
            }
          });
          notifsTmp.other = tab.length - (notifsTmp.v + notifsTmp.z + notifsTmp.f)
          notifsTmp.total = tab.length
        }
        this.notifs = notifsTmp
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
