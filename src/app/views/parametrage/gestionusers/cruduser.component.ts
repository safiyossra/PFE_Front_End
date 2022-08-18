import { catchError } from 'rxjs/operators';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { Constant } from 'src/app/tools/constants';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { throwError } from 'rxjs';

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
  constructor(private dataService: DataService, private tools: util, private router: Router, public cst: Constant,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }
  data = [];
  errorMsg: string;
  public groups: any = [];
  selectedGroups = "*";
  showErrorGroup = false;
  errorMessageGroup = "";
  getSelectedGroups(selected) {
    this.selectedUser.groups = selected;
    console.log(this.selectedUser);

  }

  onValidateGroup() {
    this.showErrorGroup = !this.showErrorGroup;
    this.errorMessageGroup = "This field is required";
  }

  selectedTimezones = "GMT+01:00";
  getSelectedTimezones(selected) {
    this.selectedUser.timeZone = selected;
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
        console.log(d);

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
    if (ev) {
      var url = "?id=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getUsers(url).subscribe({
        next: (result: any) => {
          this.selectedUser = new User(result.user.userID, result.user.isActive, result.user.description,  result.user.password, result.user.contactName,  result.user.contactPhone,   result.user.contactEmail,  result.user.notifyEmail,  result.user.timeZone, "*",  result.user.notes)
          // console.log(this.selectedUser);

          if (result.groups && result.groups.length) {
            this.selectedGroups = result.groups[0].groupID
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
    if (!this.selectedUser.userID || !this.selectedUser.description || !this.selectedUser.password ) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    }else {
        if(this.selectedUser.password && this.selectedUser.password.length<6)this.errorMsg = "Veuillez saisir un mot de passe de 6 caractères minimum ."
        else{
          if (this.selectedUser.notifyEmail && !this.tools.ValidateEmail(this.selectedUser.notifyEmail)) this.errorMsg = "Vous avez saisi un email de notification invalid."
          else if (this.selectedUser.contactEmail && !this.tools.ValidateEmail(this.selectedUser.contactEmail)) this.errorMsg = "Vous avez saisi un email de contact invalid."
          else {
            this.errorMsg = "";

            this.dataService.addUsers(this.selectedUser)
            .pipe(
              catchError(err => {
                this.modalLoading = false;
                this.errorMsg = "Erreur "+err
                if (err.status == 401) {
                  route.navigate(['login'], { queryParams: { returnUrl: route.url } });
                }

                else if (err.status == 400) {
                  console.log(err);
                  this.errorMsg = "Utilisateur avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
                  console.log(this.errorMsg);
                }

                else if (err.status == 402) {
                  this.errorMsg = "Erreur l'ajout est bloqué."
                }
                return throwError(err);
              })
            )
            .subscribe({
              next: (res) => {
                console.log("add")
                this.loadData()
                this.primaryModal.hide()
                this.errorMsg = ""
              }
              // , error(err) {
              //   this.modalLoading = false;
              //   if (err.status == 401) {
              //     route.navigate(['login'], { queryParams: { returnUrl: route.url } });
              //   }
              //   else if (err.status == 402) {
              //     this.errorMsg = "Erreur l'ajout est bloqué."
              //   }
              // }
            })
          }
        }
  }
  }

  modifier() {
    var route = this.router
    this.errorMsg = ""
    if (!this.selectedUser.description)  {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (this.selectedUser.notifyEmail && !this.tools.ValidateEmail(this.selectedUser.notifyEmail)) this.errorMsg = "Vous avez saisi un email de notification invalid."
      else if (this.selectedUser.contactEmail && !this.tools.ValidateEmail(this.selectedUser.contactEmail)) this.errorMsg = "Vous avez saisi un email de contact invalid."
      else if (this.selectedUser.password.length > 0 && this.selectedUser.password.length < 6) this.errorMsg = "Veuillez saisir un mot de passe de 6 caractères minimum ."
      else{
        console.log("dkhal");

        this.modalLoading = true;
      this.dataService.updateUsers(this.selectedUser).subscribe({
        next: (res) => {
          console.log("updateUsers");
          this.loadData()
          this.primaryModal.hide()
          this.errorMsg = ""
        } , error(err) {
          console.log("error", err);
          this.modalLoading = false;
          this.errorMsg = "Erreur "+err
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
    this.mode = "Ajouter"
    this.selectedUser = new User();
    this.selectedGroups = "*"
    this.errorMsg = ""
    this.primaryModal.show()
  }


  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Users(this.data, "Rapport de List Utilisateurs" ) :
      this.exportingExcelTool.Export_Users(this.data, "Rapport de List Utilisateurs" )
}
}
