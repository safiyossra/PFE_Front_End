import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = true;
  public navItems = navItems;

  username: String
  constructor(private route: Router) {

  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username')
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['login']);

  }
}
