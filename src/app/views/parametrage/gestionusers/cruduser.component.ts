import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { Constant } from 'src/app/tools/constants';

@Component({
  templateUrl: 'cruduser.component.html',
  styleUrls: ["./style.scss"]
})
export class CruduserComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedUser: User = new User();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, private router: Router, private cst: Constant) { }
  data = [];
  errorMsg: string;
  public groups: any = [];
  selectedGroups = null;
  selectedGroup = this.selectedGroups;
  showErrorGroup = false;
  errorMessageGroup = "";
  timezone = this.cst.timezone
  getSelectedGroups(selected) {
    this.selectedGroup = selected;
    console.log(this.selectedGroup?.join(" , ").trim());

  }

  onValidateGroup() {
    this.showErrorGroup = !this.showErrorGroup;
    this.errorMessageGroup = "This field is required";
  }

  selectedTimezones = null;
  selectedTimezone = this.selectedTimezones;
  getSelectedTimezones(selected) {
    this.selectedTimezone = selected;
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
    this.dataService.getUsers("").subscribe({
      next: (d: any) => {
        let now = Math.round(new Date().getTime() / 1000)
        d.forEach(e => {
          e.lastLoginTime = this.tools.formatDate(new Date(Number.parseInt(e.lastLoginTime) * 1000));
        });
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
    this.selectedUser = new User(ev[0], ev[1], ev[2], ev[3], ev[4], ev[5], ev[6], ev[7], ev[8], ev[9], ev[10]);
    if (ev) {
      var url = "?u=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getUsers(url).subscribe({
        next: (d: any) => {
          console.log(d);
          if (d && d.length)
            this.selectedUser.groups = d[0].groupID;
          this.selectedGroups = this.selectedUser.groups
          this.selectedGroup = this.selectedGroups
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

    if (!this.selectedUser.userID || !this.selectedUser.description || !this.selectedUser.password || !this.selectedUser.contactPhone) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.addUsers(this.selectedUser).subscribe({
        next: (res) => {
          console.log("add")
         // console.log(res)
        },
        error: (errors) => {

        }
      })
    }

  }

  modifier() {

    if (!this.selectedUser.description || !this.selectedUser.password || !this.selectedUser.contactPhone) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.dataService.updateUsers(this.selectedUser).subscribe({
        next: (res) => {
          console.log("edit")
          //console.log(this.selectedUser)
        },
        error: (errors) => {

        }
      })
    }



  }

  // delete(user) {
   
  // }


//   delete(user) {
//     //user =  this.selectedUser 

//     this.dataService.delUsers(user).subscribe({
//       next: (res) => {
//         console.log("deleted cruduser")
//        // console.log(res)
//       },
//       error: (errors) => {

//       }
//     })
  
// }

  showAddModal() {
    this.selectedUser = new User();
    this.mode = "Ajouter"
    this.primaryModal.show()
  }
}


