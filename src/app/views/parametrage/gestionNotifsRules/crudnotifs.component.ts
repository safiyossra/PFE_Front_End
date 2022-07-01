import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertRule } from '../../../models/alertRule';
import { Router } from '@angular/router';
import { util } from '../../../tools/utils'

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
  constructor(private dataService: DataService, private tools: util, private router: Router) { }
  data = [];

  public groups: any = [];
  selectedGroups = null;
  selectedGroup = this.selectedGroups;
  showErrorGroup = false;
  errorMessageGroup = "";

  getSelectedGroups(selected) {
    this.selectedGroup = selected;
    console.log(this.selectedGroup?.join(" , ").trim());

  }

  onValidateGroup() {
    this.showErrorGroup = !this.showErrorGroup;
    this.errorMessageGroup = "This field is required";
  }

  ngOnInit() {
    this.getGroup();
    this.loadData();
  }

  getGroup() {

    var route = this.router
    this.dataService.getGroupeVehicules("").subscribe({
      next: (res) => {
        this.groups = res;
        console.log(res)
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
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getNotifRules(url).subscribe({
        next: (d: any) => {
          // if (d && d.length) {
          //  this.selectedUser = d[0];
          // }
          this.selectedAlert = d[0]
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

  showAddModal() {
    this.selectedAlert = new AlertRule();
    this.mode = "Ajouter"
    this.primaryModal.show()
  }
}
