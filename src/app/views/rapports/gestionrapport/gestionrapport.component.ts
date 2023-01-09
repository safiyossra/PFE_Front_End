import { catchError } from 'rxjs/operators';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RapportAutomatique } from '../../../models/rapportAutomatique';
import { Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { Constant } from 'src/app/tools/constants';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { throwError } from 'rxjs';

@Component({
  templateUrl: 'gestionrapport.component.html',
  styleUrls: ["./style.scss"]
})
export class GestionRapportComponent {

  role = "admin";
  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedRapport: RapportAutomatique = new RapportAutomatique();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('secondModal') public secondModal: ModalDirective;

  public permissionData: any;
  public oldPermissionData:any;
  isEditPermission = false
  isAddPermission = false

  constructor(private dataService: DataService, public tools: util, private router: Router, public cst: Constant,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { 
  }
  intervals = [{intervalID:"custom",description:"Personnalisé"},{intervalID:"today",description:"Aujourd'hui"},{intervalID:"daily",description:"Tous les jours (hier)"},
  {intervalID:"hourly",description:"Horaire (dernière heure)"},{intervalID:"weekly",description:"Hebdomadaire (du dimanche au samedi)"},{intervalID:"satsun",description:"Week-end dernier"},
  {intervalID:"monfri",description:"Du lundi dernier au vendredi"},{intervalID:"monthly",description:"Le mois dernier"}]
  data = [];
  errorMsg: string;
  public groups: any = [];
  selectedGroups = "*";
  selectedGroupReport = "*";
  selectedInterval = "*";
  showErrorGroup = false;
  showErrorInterval = false;
  errorMessageGroup = "";
  errorMessageGroupreport = "";
  errorMessageInterval = "";

  getSelectedGroups(selected) {
    this.selectedRapport.group = selected;
    // console.log(this.selectedRapport);
  }
  
  getSelectedGroupsreport(selected) {
    this.selectedRapport.grouprapport = selected;
    // console.log(this.selectedRapport);
  }
  
  getSelectedInterval(selected) {
    this.selectedRapport.interval = selected;
    // console.log(this.selectedRapport);
  }
  onValidateGroup() {
    this.showErrorGroup = !this.showErrorGroup;
    this.errorMessageGroup = "This field is required";
  }


  ngOnInit() {
    this.getGroup();
    // this.loadData();
    this.oldPermissionData = this.permissionData = this.cst.userPermissions;
    this.isEditPermission = this.tools.isAuthorized('Rapports_RapportAutomatique','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Rapports_RapportAutomatique','Ajouter')
  }

  getGroup() {
    var route = this.router
    this.dataService.getGroupeVehicules("").subscribe({
      next: (res) => {
        this.groups = res;
        this.groups.unshift({ groupID: "*", description: "Tout" })
        // console.log(res)
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
        d.forEach(e => {
          if (e.lastLoginTime != 0) {
            e.lastLoginTime = this.tools.formatDate(new Date(Number.parseInt(e.lastLoginTime) * 1000));
          } else {
            e.lastLoginTime = "Jamais"
          }

        });
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

  loadEditPassword(ev){
    this.mode = "Valider"
    // ev => userID
    this.selectedRapport = new RapportAutomatique();
    this.selectedRapport.rapportID = ev;
    this.selectedRapport.description = "x";
    this.selectedRapport.group = "";
    // console.log(this.selectedRapport);
    this.secondModal.show();
    this.modalLoading = false;
  }

  loadModify(ev) {
    this.mode = "Modifier"
    if (ev) {
      var url = "?id=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getUsers(url).subscribe({
        next: (result: any) => {
          // console.log(result);
          this.selectedRapport = new RapportAutomatique(result.user.userID, result.user.isActive, result.user.description, "", result.user.contactName, result.user.contactPhone, result.user.contactEmail, result.user.notifyEmail, result.user.timeZone, "*")

          if (result.groups && result.groups.length) {
            this.selectedGroups = result.groups[0].groupID
          } else {
            this.selectedGroups = "*"
          }
          this.selectedRapport.group = this.selectedGroups
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
    if (!this.selectedRapport.rapportID || !this.selectedRapport.description) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    }else {
            // console.log(this.selectedRapport);
            this.errorMsg = "";
            // this.dataService.addUsers(this.selectedRapport)
            // .pipe(
            //   catchError(err => {
            //     this.modalLoading = false;
            //     this.errorMsg = "Erreur "+err
            //     if (err.status == 401) {
            //       route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            //     }
            //     else if (err.status == 400) {
            //       console.log(err);
            //       this.errorMsg = "Utilisateur avec cet identifiant exist deja. Veuillez utiliser un autre identifiant."
            //       console.log(this.errorMsg);
            //     }

            //     else if (err.status == 402) {
            //       this.errorMsg = "Erreur l'ajout est bloqué."
            //     }
            //     return throwError(err);
            //   })
            // )
            // .subscribe({
            //   next: (res) => {
            //     console.log("add")
            //     this.loadData()
            //     this.primaryModal.hide()
            //     this.errorMsg = ""
            //   }
            // })
  }
  }

  modifier() {
    var route = this.router
    this.errorMsg = ""
    // if (!this.selectedRapport.description)  {
    //   this.errorMsg = "Veuillez remplir les champs obligatoires (*)."
    // } else {
    //     this.modalLoading = true;
    //     console.log(this.selectedRapport);
    //     this.dataService.updateUsers(this.selectedRapport).subscribe({
    //     next: (res) => {
    //       console.log("updateUsers");
    //       this.loadData()
    //       this.primaryModal.hide()
    //       this.errorMsg = ""
    //     } , error(err) {
    //       console.log("error", err);
    //       this.modalLoading = false;
    //       this.errorMsg = "Erreur "+err
    //       if (err.status == 401) {
    //         route.navigate(['login'], { queryParams: { returnUrl: route.url } });
    //       }
    //       else if (err.status == 402) {
    //         this.errorMsg = "Erreur la modification est bloqué."
    //       }
    //     }
    //   })
  }

  delete(rapport) {
    if (confirm("Are you sure to delete " + rapport)) {
      var route = this.router
      var u = "?u=" + rapport
      this.dataService.delUsers(u).subscribe({
        next: (res) => {
          // console.log("deleted cruduser")
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
    this.selectedRapport = new RapportAutomatique();
    this.selectedGroups = "*"
    this.errorMsg = ""
    this.primaryModal.show()
  }


  exporter(type) {
    // type == 1 ? this.exportingPdfTool.exportPdf_Users(this.data, "Rapport de List Utilisateurs" ) :
    //   this.exportingExcelTool.Export_Users(this.data, "Rapport de List Utilisateurs" )
  }
}
