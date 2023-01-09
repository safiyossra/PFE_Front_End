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
import { JsonEditorComponent, JsonEditorOptions } from './jsoneditor/jsoneditor.component'
import { schema } from 'src/app/tools/schema.value';

@Component({
  templateUrl: 'cruduser.component.html',
  styleUrls: ["./style.scss"]
})
export class CruduserComponent {

  role = "admin";
  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedUser: User = new User();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('editor', { static: false }) editor: JsonEditorComponent;

  public editorOptions: JsonEditorOptions;
  public permissionData: any;
  public oldPermissionData:any;
  isEditPermission = false
  isAddPermission = false

  constructor(private dataService: DataService, public tools: util, private router: Router, public cst: Constant,private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { 
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.schema = schema;
    this.initEditorOptions(this.editorOptions);
  }

  data = [];
  errorMsg: string;
  public groups: any = [];
  selectedGroups = "*";
  showErrorGroup = false;
  errorMessageGroup = "";
  selectedTimezones = "GMT+00:00";

  getSelectedGroups(selected) {
    this.selectedUser.groups = selected;
    // console.log(this.selectedUser);
  }
  
  editorJsonChangeLog(event = null) {
    const editorJson = this.editor.getEditor()
    editorJson.validate()
    const errors = editorJson.validateSchema.errors
    if (errors && errors.length > 0) {
      console.log('Errors found', errors)
      editorJson.set(this.oldPermissionData);
    } else {
      this.oldPermissionData = this.editor.get();
    }
  }

  initEditorOptions(editorOptions) {
    // this.editorOptions.mode = 'code'; // set only one mode
    editorOptions.modes = []; //'code', 'text', 'tree', 'view' set all allowed modes
    // code, text, tree, form and view
    editorOptions.mode = 'tree'
  }

  onValidateGroup() {
    this.showErrorGroup = !this.showErrorGroup;
    this.errorMessageGroup = "This field is required";
  }

  getSelectedTimezones(selected) {
    this.selectedUser.timeZone = selected;
  }

  ngOnInit() {
    this.getGroup();
    this.loadData();
    this.oldPermissionData = this.permissionData = this.cst.userPermissions;
    this.isEditPermission = this.tools.isAuthorized('Parametrage_Utilisateur','Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_Utilisateur','Ajouter')
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
        let now = Math.round(new Date().getTime() / 1000)
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
    this.selectedUser = new User();
    this.selectedUser.userID = ev;
    this.selectedUser.password = "";
    this.selectedUser.description = "x";
    this.selectedUser.groups = "";
    this.selectedUser.confirmPass = "";
    // console.log(this.selectedUser);
    this.secondModal.show();
    this.modalLoading = false;
  }

  editPassword(){
    var route = this.router
    this.errorMsg = ""
    if (!this.selectedUser.password && !this.selectedUser.confirmPass)  {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      if (this.selectedUser.password.length > 0 && this.selectedUser.password.length < 6)
        this.errorMsg = "Veuillez saisir un mot de passe de 6 caractères minimum ."
      else if (this.selectedUser.password !=  this.selectedUser.confirmPass)
        this.errorMsg = "Le mot de passe et le mot de passe de confirmation ne sont pas identiques ."
      else{
        this.modalLoading = true;
        // console.log(this.selectedUser);
        this.dataService.updateUsers(this.selectedUser).subscribe({
          next: (res) => {
            this.loadData()
            this.secondModal.hide()
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
        });
      }
    }
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
          this.selectedUser = new User(result.user.userID, result.user.isActive, result.user.description, "", result.user.contactName, result.user.contactPhone, result.user.contactEmail, result.user.notifyEmail, result.user.timeZone, "*", result.user.notes,'')
          const editorJson = this.editor.getEditor()
          editorJson.set(JSON.parse(result.p))
          editorJson.validate()
          const errors = editorJson.validateSchema.errors
          if (errors && errors.length > 0) {
            console.log('Errors found', errors)
            editorJson.set(this.oldPermissionData);
          } else {
            this.oldPermissionData = this.editor.get();
          }
          this.selectedUser.permissions = JSON.stringify(this.editor.get())
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
    if (this.mode == "Valider") this.editPassword()
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
            this.selectedUser.permissions = JSON.stringify(this.editor.get())
            // console.log(this.selectedUser);
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
                // console.log("add")
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
      this.errorMsg = "Veuillez remplir les champs obligatoires (*)."
    } else {
      if (this.selectedUser.notifyEmail && !this.tools.ValidateEmail(this.selectedUser.notifyEmail)) this.errorMsg = "Vous avez saisi un email de notification invalid."
      else if (this.selectedUser.contactEmail && !this.tools.ValidateEmail(this.selectedUser.contactEmail)) this.errorMsg = "Vous avez saisi un email de contact invalid."
      // else if (this.selectedUser.password.length > 0 && this.selectedUser.password.length < 6) this.errorMsg = "Veuillez saisir un mot de passe de 6 caractères minimum ."
      else{
        this.modalLoading = true;
        this.selectedUser.permissions = JSON.stringify(this.editor.get())
        // console.log(this.selectedUser);
        this.dataService.updateUsers(this.selectedUser).subscribe({
        next: (res) => {
          // console.log("updateUsers");
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
