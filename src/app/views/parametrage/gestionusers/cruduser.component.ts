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
  selectedGroups = "*";
  showErrorGroup = false;
  errorMessageGroup = "";
  timezone = this.cst.timezone
  getSelectedGroups(selected) {
    this.selectedUser.groups = selected;
    console.log(this.selectedUser);

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
        this.groups.unshift({ groupID: "*", description: "Tout" })
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
          if (e.lastLoginTime != 0) {
            e.lastLoginTime = this.tools.formatDate(new Date(Number.parseInt(e.lastLoginTime) * 1000));
          } else {
            e.lastLoginTime = "Jamais"
          }

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
    this.selectedUser = new User(ev[0], ev[1], ev[2], ev[3], ev[4], ev[5], ev[6], ev[7], ev[8], "*", ev[9]);
    if (ev) {
      var url = "?u=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getUsers(url).subscribe({
        next: (d: any) => {
          console.log(d);
          if (d && d.length) {
            this.selectedGroups = d[0].groupID
          } else {
            this.selectedGroups = "*"
          }
          this.selectedUser.groups = this.selectedGroups
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
    if (!this.selectedUser.userID || !this.selectedUser.description || !this.selectedUser.password || !this.selectedUser.contactPhone) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    }else {
        if(this.selectedUser.password && this.selectedUser.password.length<6)this.errorMsg = "Veuillez saisir un mot de passe de 6 caractères minimum ."
        else{
          if(this.selectedUser.notifyEmail && !this.ValidateEmail(this.selectedUser.notifyEmail))this.errorMsg = "Vous avez saisi un email de notification invalid."
          else if(this.selectedUser.contactEmail && !this.ValidateEmail(this.selectedUser.contactEmail))this.errorMsg = "Vous avez saisi un email de contact invalid."
          else {
            this.dataService.addUsers(this.selectedUser).subscribe({
              next: (res) => {
                console.log("add")
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
    if (!this.selectedUser.description || !this.selectedUser.contactPhone)  {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if(this.selectedUser.notifyEmail && !this.ValidateEmail(this.selectedUser.notifyEmail))this.errorMsg = "Vous avez saisi un email de notification invalid."
      else if(this.selectedUser.contactEmail && !this.ValidateEmail(this.selectedUser.contactEmail))this.errorMsg = "Vous avez saisi un email de contact invalid."
      else if(this.selectedUser.password && this.selectedUser.password.length<6)this.errorMsg = "Veuillez saisir un mot de passe de 6 caractères minimum ."
      else{
      this.dataService.updateUsers(this.selectedUser).subscribe({
        next: (res) => {
          this.loadData()
          this.primaryModal.hide()
          this.errorMsg = ""
        } , error(err) {
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
  }


  delete(user) {
    if (confirm("Are you sure to delete " + user)) {
      var route = this.router
      var u = "?u=" + user
      this.dataService.delUsers(u).subscribe({
        next: (res) => {
          console.log("deleted cruduser")
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

  showAddModal() {
    this.selectedUser = new User();
    this.selectedGroups = "*"
    this.errorMsg = ""
    this.mode = "Ajouter"
    this.primaryModal.show()
  }

 ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}
}


