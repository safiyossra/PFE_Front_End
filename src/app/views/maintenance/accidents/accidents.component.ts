import { Device } from './../../../models/device';
import { util } from './../../../tools/utils';
import { AccidentCooment } from './../../../models/accidentComment';
import { Constant } from './../../../tools/constants';
import { DataService } from './../../../services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Accident } from '../../../models/accident';
import { Assurance } from '../../../models/assurance'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { MyDateRangePickerOptions, MyDateRangePickerComponent } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { Router } from '@angular/router';

interface IItemEtape {
  etapeID: number;
  designation: string;
}

@Component({
  selector: 'app-accidents',
  templateUrl: './accidents.component.html',
  styleUrls: ['./accidents.component.scss']
})
export class AccidentsComponent implements OnInit {

  accident: Accident = new Accident();
  comment: AccidentCooment = new AccidentCooment()
  assurance: Assurance = new Assurance()
  mode = "Ajouter";
  modeComment = "Ajouter"
  modePlan = "Ajouter"
  modeEtape = "Ajouter"
  iconCollapse: string = 'icon-arrow-up';
  isCollapsed: boolean = false;
  data = [];
  data2 = []
  drivers = []
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('commentModal') public commentModal: ModalDirective;
  @ViewChild('etapeModal') public etapeModal: ModalDirective;
  @ViewChild('messageModale') public messageModale: ModalDirective;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  public devices: any = [];
  selectedDevice = [];
  selectedDriver = [];
  selectedEtape = [];
  selectedType = [];
  selectedStatus = [];
  loading: boolean = false
  // datePicker
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  errorMsg: string
  errorCommentMsg: string
  errorEtapeMsg: string
  errorMsgPlan: string
  commentsTable: AccidentCooment[] = []
  selectedTab = 0
  modalLoading: boolean = false;
  itemEtapesLeft: IItemEtape[]
  etapesPredefinie: IItemEtape[]
  itemEtapesRight: IItemEtape[] = [];
  etapes: IItemEtape[] = [];
  assuranceTable: Assurance[] = []
  accidentTable: Accident[] = []
  etape = { etapeID: 0, designation: "" }
  assuranceVehicule: any
  nameAssurance: string = ""
  dismissible = true;
  alert = {
    type: 'danger',
    msg: ""
  }
  openAlert: boolean = false
  msg: string
  progress: any
  accidents = []
  forceCloturer: boolean = false
  typesDegat = []
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------

  constructor(private dataService: DataService, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel,
    private router: Router, public cts: Constant, private tools: util) { }

  ngOnInit(): void {
    this.resetDatePicker();
    this.getDev();
    this.getDrivers();
    this.getEtapes();
  }

  /********************************************* Main Page Functions **********************************************/
  modalAjouter() {
    this.accident = new Accident();
    this.mode = "Ajouter"
    this.primaryModal.show()
    this.commentsTable = []
    this.accident.deviceID = []
    this.accident.driverID = []
    this.accident.assuranceID = []
    this.typesDegat = []

  }

  exporter(type) {
    var v = this.getJsonValue(this.data);
    type == 1 ? this.exportingPdfTool.exportPdf_Accident(v, "Rapport Accidents") :
      this.exportingExcelTool.Export_Accidents(v, "Rapport Accidents")
  }
  reset() {
    this.selectedDevice = []
    this.selectedDriver = []
    this.resetDatePicker()
    this.getAccidents();
  }

  resetDatePicker() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.myDateRangePickerOptions = {
      theme: 'default',
      labels: ['Début', 'Fin'],
      menu: [
        { alias: 'td', text: 'Aujourd\'hui', operation: '0d' },
        { alias: 'tm', text: 'Ce mois-ci', operation: '0m' },
        { alias: 'lm', text: 'Le mois dernier', operation: '-1m' },
        { alias: 'tw', text: 'Cette semaine', operation: '0w' },
        { alias: 'lw', text: 'La semaine dernière', operation: '-1w' },
        { alias: 'ty', text: 'Cette année', operation: '0y' },
        { alias: 'ly', text: 'L\'année dernière', operation: '-1y' },
        { alias: 'ln', text: '90 derniers jours', operation: '-90d' },
        { alias: 'l2m', text: '2 derniers mois', operation: '-2m' },

        { alias: 'pmt', text: 'Mois passé à partir d\'aujourd\'hui', operation: '-1mt' },
        { alias: 'pwt', text: 'Semaine passée à partir d\'aujourd\'hui', operation: '-1wt' },
        { alias: 'pyt', text: 'Année passée à partir d\'aujourd\'hui', operation: '-1yt' },
        { alias: 'pdt', text: '90 derniers jours à partir d\'aujourd\'hui', operation: '-90dt' },
        { alias: 'pl2mt', text: '2 derniers mois à partir d\'aujourd\'hui', operation: '-2mt' }
      ],
      dateFormat: 'yyyy-MM-dd',
      outputFormat: 'dd-MM-yyyy',
      startOfWeek: 1,
      outputType: 'object',
      locale: 'fr-US',
      minDate: {
        day: null,
        month: null,
        year: null
      },
      maxDate: {
        day: null,
        month: null,
        year: null
      },
      date: {
        from: today,
        to: tomorrow
      }
    };
  }

  getJsonValue(v) {
    return JSON.parse(JSON.stringify(v))
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  getDrivers() {
    this.dataService.getDriverData("?minimum=true").subscribe({
      next:
        response => {
          // console.log("drivers ", response);
          this.drivers = [].concat(response)
        },
      error(err) {
        console.log("err ", err);
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
        else
          alert("Erreur Serveur,")
      }
    })
  }

  getSelectedDevices(selected) {
    this.selectedDevice = selected;
  }

  getSelectedDriver(selected) {
    this.selectedDriver = selected;
  }

  // getSelectedEtape(selected) {
  //   this.selectedEtape = selected;
  //   console.log("this.selectedEtape ", this.selectedEtape);
  // }
  // getSelectedType(selected) {
  //   this.selectedType = selected;
  //   console.log("this.status ", this.selectedType);
  // }
  // getSelectedStatus(selected) {
  //   this.selectedStatus = selected;
  //   console.log("this.status ", this.selectedStatus);
  // }


  loadData(first = false) {
    this.loading = true;
    // console.log("myDateRangePicker", this.myDateRangePicker);
    if (!first) {
      this.data2 = [].concat(this.accidentTable)
      if (this.selectedDevice.length > 0 && this.selectedDriver.length > 0) {
        let a = this.data2.filter(e => (Date.parse(e.date) / 1000) >= this.myDateRangePicker.getDateFrom &&
          (Date.parse(e.date) / 1000) <= this.myDateRangePicker.getDateTo &&
          e.deviceID == this.selectedDevice && e.driverID == this.selectedDriver)
        this.data = [].concat(a);
      } else {
        if (this.selectedDevice.length > 0) {
          let a = this.data2.filter(e => (Date.parse(e.date) / 1000) >= this.myDateRangePicker.getDateFrom &&
            (Date.parse(e.date) / 1000) <= this.myDateRangePicker.getDateTo &&
            e.deviceID == this.selectedDevice)
          this.data = [].concat(a);
        }
      }

      if (this.selectedDevice.length == 0 && this.selectedDriver.length == 0) {
        let a = this.data2.filter(e => (Date.parse(e.date) / 1000) >= this.myDateRangePicker.getDateFrom &&
          (Date.parse(e.date) / 1000) <= this.myDateRangePicker.getDateTo)
        this.data = [].concat(a);
      }

    }
    this.loading = false

  }

  selectTab(i) {
    this.selectedTab = i
  }

  /**************************** Table Functions ******************************************* */
  // onModify(event) {
  //   console.log("2----", event);
  // }

  onEdit(event) {
    // console.log("2----", event);
    this.mode = "Modifier"
    this.accident = event;
    this.typesDegat = this.accident.degatType;
    this.getAssuranceVehicule(this.accident.deviceID);
    this.getAccidentComment(this.accident.accidentID);

    this.etapes = this.assuranceTable.filter(assur => assur.assuranceID == this.accident.assuranceID)[0].etapes;
    let size = this.etapes.length
    let index;
    for (let i = 0; i < size; i++) {
      if (this.etapes[i].etapeID == this.accident.etapeAssurance)
        index = i
    }
    // console.log(" this.etapes  ", this.etapes);
    // console.log("index ", index);
    // console.log("size ", size);
    if (this.accident.etapeAssurance == this.etapes[size - 1].etapeID && this.accident.statut == "CLOTURE")
      this.progress = "100"
    else
      this.progress = parseInt((index * 100 / this.etapes.length).toString()).toString();
    this.primaryModal.show();
  }

  delete(acc) {
    if (confirm("Vous êtes sûre de supprimer cette accident ?")) {
      var route = this.router
      var url = "?accidentID=" + acc.accidentID
      this.dataService.deleteAccident(url).subscribe({
        next: (res) => {
          // console.log("res ", res);
          this.getAccidents();
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login']);
          }
          else if (err.status == 402) {
            alert("Erreur, la suppression est bloqué")
          }
        }
      })
    }
  }

  cloturer(event) {
    this.accident = event;
    this.forceCloturer = true
    this.OpenCommentModal(this.accident)
  }

  /******************************* Modal Functions ****************************************** */
  getSelectedDevicesModal(seletedVehicule) {
    this.accident.deviceID = seletedVehicule;
    this.getAssuranceVehicule(seletedVehicule);
  }
  getSelectedDriverModal(seletedDriver) {
    this.accident.driverID = seletedDriver;
  }
  getTypeDegat(event) {
    // console.log("event ", event);
    this.accident.degatType = event.toString();
    // console.log("this.accident ", this.accident);


  }

  getSelectedPlan(selectedPlan) {
    // console.log("seletedPlan ", selectedPlan);
    this.accident.etapeAssurance = this.assuranceTable.filter(plan => plan.assuranceID == selectedPlan)[0].etapes[0].etapeID;
    this.accident.assuranceID = selectedPlan;
  }

  getAccidents() {
    this.dataService.getAccident().subscribe({
      next:
        response => {
          // console.log("response accident", response);
          this.accidentTable = response;
          this.accidentTable.forEach(acc => {
            acc.driverName = this.drivers.filter(dr => dr.driverID == acc.driverID)[0].displayName;
            acc.deviceName = this.devices.filter(dv => dv.dID == acc.deviceID)[0].name;
            acc.typeAssurance = this.assuranceTable.filter(assur => assur.assuranceID == acc.assuranceID)[0].designation;
            acc.etapeAssuranceName = this.etapesPredefinie.filter(etape => etape.etapeID == acc.etapeAssurance)[0].designation;
            acc.date = this.tools.formatDateVer(this.tools.timeStampToDate(acc.date));
            acc.assuranceID = acc.assuranceID.toString();

            this.typesDegat = Array.from(acc.degatType.split(','));
            acc.degatType = this.typesDegat;
            acc.icons = []
            acc.degatType.forEach(element => {
              let icon = this.cts.degatTypes.filter(dg => dg.value == element)[0].icon.toString()
              acc.icons.push(icon)
            });
          })
          // console.log("acidents table", this.accidentTable);
          this.data = this.accidentTable.reverse();
        },
      error(err) {
        console.log("err get accident ", err);
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
        else
          alert("Erreur Serveur")
      }
    })
  }



  submit() {
    this.errorMsg = ""
    this.accident.statut = "EN COURS"

    // console.log("accident to save ", this.accident);

    if (this.accident.deviceID && this.accident.driverID && this.accident.degatType
      && this.accident.degatApparents && this.accident.lieu && this.accident.date) {
      this.accident.date = this.tools.dateToTimestamp(this.accident.date)
      this.accident.degatType = this.accident.degatType.toString();
      // console.log("2---accident to save ", this.accident);

      this.dataService.saveAccident(this.accident).subscribe({
        next:
          response => {
            this.getAccidents();
            this.primaryModal.hide()

          },
        error(err) {
          console.log("err save accident ", err);
          if (err.status == 401) {
            this.route.navigate(['login']);
          }
          else
            alert("Erreur, l'joute est bloqué")

        }
      })
    } else {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    }

  }

  /************** Comment Modal Functions ********** */
  // accident: Accident = new Accident();
  OpenCommentModal(accident) {
    this.comment = new AccidentCooment();
    this.comment.dateComment = this.tools.formatDateVer(new Date())

    if (!accident) {
      this.comment.etapeID = "0"
      this.comment.etapeName = "Commentaire"
      this.comment.accidentID = this.accident.accidentID
    }
    else {
      if (this.forceCloturer) {
        this.accident = accident
        this.comment.etapeID = "-1"
        this.comment.etapeName = "CLÔTURER MANUELEMENT"
      } else {
        this.accident = accident
        this.comment.etapeID = accident.etapeAssurance
        this.comment.accidentID = accident.accidentID
        this.comment.etapeName = this.etapesPredefinie.filter(et => et.etapeID == this.comment.etapeID)[0].designation;
      }

    }


    this.modeComment = "Ajouter"
    this.commentModal.show()

  }

  hideCommentModal() {
    this.commentModal.hide();
    this.forceCloturer = false;
  }
  getAccidentComment(accidentID) {
    let url = "?accidentID=" + accidentID;
    this.dataService.getAccidentCommnet(url).subscribe({
      next:
        response => {
          this.commentsTable = response;
          // console.log("commentsTable", this.commentsTable);
          this.commentsTable.forEach(comm => {
            if (comm.etapeID == 0)
              comm.etapeName = "Commentaire"
            else {
              if (comm.etapeID == -1)
                comm.etapeName = "CLÔTURER MANUELEMENT"
              else
                comm.etapeName = this.etapesPredefinie.filter(et => et.etapeID == comm.etapeID)[0].designation;
            }

          })
          this.commentsTable = this.commentsTable.reverse();

        },
      error(err) {
        console.log("error get accident comments ", err);
        if (err.sattus == 401) {
          this.router.navigate(['login'])
        } else {
          alert("Erreur Serveur");
        }
      }
    })

  }

  submitComment() {
    this.errorCommentMsg = ""
    if (this.comment.comment && this.comment.dateComment) {
      this.comment.dateComment = this.tools.formatDateVer(new Date(this.comment.dateComment))
      // this.comment.date = this.comment.date.replace("T", " ")

      if (this.forceCloturer) {
        this.comment.etapeID = "-1"
        this.comment.etapeName = "CLÔTURER MANUELEMENT"
        this.comment.accidentID = this.accident.accidentID
        this.accident.statut = "CLOTURE"
      } else {
        if (this.comment.etapeID != "0") {
          let plan = this.assuranceTable.filter(assur => assur.assuranceID == this.accident.assuranceID)[0]
          let size = plan.etapes.length;
          if (this.accident.statut != "CLOTURE")
            for (let i = 0; i < size; ++i) {
              if (i == size - 1) {
                this.accident.statut = "CLOTURE"
                this.accident.etapeAssurance = plan.etapes[size - 1].etapeID
                this.accident.etapeAssuranceName = plan.etapes[size - 1].designation;
                break;
              }
              if (this.accident.etapeAssurance == plan.etapes[i].etapeID) {
                this.accident.etapeAssurance = plan.etapes[i + 1].etapeID
                this.accident.etapeAssuranceName = plan.etapes[i + 1].designation;
                break
              }


            }
          // console.log("this.accident ", this.accident);
        }
      }



      let url = "?etape=" + this.accident.etapeAssurance + "&statut=" + this.accident.statut;

      // console.log("comment ", this.comment);
      this.dataService.saveAccidentComment(this.comment, url).subscribe({
        next:
          response => {
            // console.log("response ", response);
            this.getAccidentComment(this.accident.accidentID);
            this.forceCloturer = false

          },
        error(err) {
          console.log("err ", err);
          if (err.status == 401) {
            this.route.navigate(['login']);
          }
          else
            alert("Erreur Serveur !")
        }
      })
      this.commentModal.hide()
    } else {
      this.errorCommentMsg = "Veuillez remplir les champs obligatoires (*) ."
    }

  }
  editComment(comment) {
    this.modeComment = "Modifier"
    // let ms = Date.parse(comment.date);
    this.comment = comment;
    this.commentModal.show()
  }

  deleteComment(comment) {
    let url = "?commentID=" + comment.commentID
    this.dataService.deleteAccidentComment(url).subscribe({
      next:
        response => {
          // console.log("response ", response);
          this.getAccidentComment(this.accident.accidentID);
        },
      error(err) {
        console.log("err ", err);
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
        else
          alert("Erreur Serveur !")
      }
    })

  }
  /******************************************** */

  getAssuranceVehicule(deviceID) {
    let url = "?deviceID=" + deviceID
    this.dataService.getAssuranceVehicule(url).subscribe({
      next:
        response => {
          // console.log("response assurance vehicule ", response);
          this.assuranceVehicule = response;
          this.nameAssurance = this.assuranceVehicule.societe

        },
      error(err) {
        console.log("err ", err);
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
        else
          alert("Erreur Serveur !")
      }
    })
  }



  /*************************** Assurance Tab Function *************************** */

  /******** Etapes Plan Assuraces Functions ******** */
  modalEtape() {
    this.etape = { etapeID: 0, designation: "" }
    this.etapeModal.show()
  }

  onUpdateEtape(event) {
    this.modeEtape = "Modifier"
    this.etape = event
    this.etapeModal.show()
  }

  getEtapes() {
    this.dataService.getEtapes().subscribe({
      next:
        response => {

          this.itemEtapesLeft = this.etapesPredefinie = [].concat(response)
          // this.itemEtapesLeft.forEach(et => {
          //   et.index = this.itemEtapesLeft.indexOf(et)
          // })
          // console.log("etapes prédefinie ", this.itemEtapesLeft);
          this.getPlanAssurance()


        },
      error(err) {
        console.log("error get Etapes ", err);
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
        else
          alert("Erreur Serveur,")

      }
    })
  }

  submitEtape() {
    this.errorEtapeMsg = ""

    // console.log("etape to save ", this.etape);
    if (this.etape.designation) {
      this.dataService.saveEtape(this.etape).subscribe({
        next:
          response => {
            // console.log("response etape ", response);
            this.getEtapes();
            this.resetPlan()
            this.etapeModal.hide()
          },
        error(err) {
          console.log("err assurance ", err);
          if (err.status == 401) {
            this.route.navigate(['login']);
          }
          else
            alert("Erreur, l'ajoute est bloqué")
        }
      })

    } else {
      this.errorEtapeMsg = "Veuillez remplir les champs obligatoires(*)."
    }
    this.modeEtape = "Ajouter"

  }

  /*********** Plan Assurance Functions ************* */

  resetPlan() {
    this.assurance = new Assurance()
    this.itemEtapesLeft = this.etapesPredefinie;
  }

  getPlanAssurance() {
    this.dataService.getPlanAssurance().subscribe({
      next:
        response => {
          // console.log("Response plan assurance ", response);
          let etapes = [].concat(response.etapes);
          etapes.forEach(etape => {
            this.etapesPredefinie.forEach(etp => {
              if (etape.etapeID == etp.etapeID)
                etape.designation = etp.designation;
            })
          })

          this.assuranceTable = [].concat(response.plans);
          this.assuranceTable.forEach(assurance => {
            assurance.etapes = []
            etapes.forEach(etape => {
              if (assurance.assuranceID == etape.assuranceId)
                assurance.etapes.push(etape)
            })
            assurance.assuranceID = assurance.assuranceID.toString();
          })
          // console.log("plans assurane ", this.assuranceTable);
          this.getAccidents();

        },
      error(err) {
        console.log("erroooor ", err);
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
        else
          alert("Server Erreur")
      }
    })
  }


  savePlan() {
    this.errorMsgPlan = ""
    // console.log("plan assurance to save", this.assurance);
    if (this.assurance.designation && this.assurance.etapes.length > 0) {
      if (this.modePlan == "Ajouter") {
        this.dataService.savePlanAssurance(this.assurance).subscribe({
          next:
            response => {

              this.getPlanAssurance()
            },
          error(err) {
            console.log("err plan assurance ", err);
            if (err.status == 401) {
              this.route.navigate(['login']);
            }
            else
              alert("Erreur, l'ajoute est bloqué")
          },

        })
      } else {
        this.openAlert = false
        this.dataService.editPlanAssurance(this.assurance).subscribe({
          next:
            response => {
              // console.log("plan assurance response  ", response);

              if (response.success == true) {
                this.getPlanAssurance();
              } else {
                response.accident.forEach(element => {
                  element.deviceID = this.devices.filter(dev => dev.dID == element.deviceID)[0].name
                  element.date = this.tools.formatDateVer(this.tools.timeStampToDate(element.date))
                });
                this.accidents = response.accident;
                this.msg = "modifier"
                this.openAlert = true

              }
            },
          error(err) {
            console.log("err plan assurance ", err);
            if (err.status == 401) {
              this.route.navigate(['login']);
            }
            else
              alert("Erreur, la modification est bloqué")

          },
        })
      }

      this.resetPlan();
      this.modePlan = "Ajouter"
    } else {
      this.errorMsgPlan = "Veuillez remplir les champs obligatoires(*)."
    }

  }

  onClosed(dismissedAlert: any): void {
    this.alert !== dismissedAlert;
  }

  onEditPlan(plan) {
    this.modePlan = "Modifier"
    this.itemEtapesLeft = this.etapesPredefinie
    // console.log("plan ", plan);
    this.assurance = new Assurance()
    this.assurance.assuranceID = plan.assuranceID
    this.assurance.designation = plan.designation
    this.assurance.etapes = plan.etapes
    plan.etapes.forEach(pl => {
      this.itemEtapesLeft = this.itemEtapesLeft.filter(p => p.designation != pl.designation)
    })
  }


  deletePlan(plan) {
    this.openAlert = false
    if (confirm("Vous êtes sûr que vous voullez supprimer ce plan")) {
      let url = "?assuranceID=" + plan.assuranceID
      this.dataService.deletePlanAssurance(url).subscribe({
        next:
          response => {
            // console.log("response ", response);
            if (response.success == true) {
              this.getPlanAssurance();
            } else {

              response.accident.forEach(element => {
                element.deviceID = this.devices.filter(dev => dev.dID == element.deviceID)[0].name
                element.date = this.tools.formatDateVer(this.tools.timeStampToDate(element.date))

              });
              this.accidents = response.accident;
              this.msg = "supprimer"
              this.openAlert = true
            }

          },
        error(err) {
          console.log("err ", err);
          if (err.status == 401) {
            this.route.navigate(['login']);
          }
          else
            alert("Erreur, la suppression est bloqué")

        }
      })
    }


  }



}


