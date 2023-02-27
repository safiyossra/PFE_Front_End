import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Device } from '../../../models/device';
import { util } from 'src/app/tools/utils';
import { Router } from '@angular/router';
import { Constant } from 'src/app/tools/constants';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { EntretienPneu } from 'src/app/models/entretien-pneu';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CarDocument } from './../../../models/carDocument';

@Component({
  templateUrl: 'crudvehicule.component.html',
  styleUrls: ["./style.scss"],
})

export class CrudvehiculeComponent {
  loading: boolean = false;
  modalLoading: boolean = false;
  offModalLoading: boolean = false;
  isEditPermission = false
  isAddPermission = false
  file_url = ""
  file_name = ""
  newOdo: any;
  oldOdo: any;
  offset: any;
  selectedDevice: Device = new Device();
  errorMsg: string;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('offsetModal') public offsetModal: ModalDirective;
  constructor(private dataService: DataService, public cts: Constant, private tools: util, private router: Router, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }

  data = [];
  //////////////////////////////////////////////////////////

  errorMsg1: string;
  document: CarDocument = new CarDocument()
  @ViewChild('pneuTbSort') sort: MatSort
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selectAllDoc: Boolean = false
  columnNames: string[] = ['N° SÉRIE', 'ETAT PNEU', 'KM ACQUISITION', 'DATE DEBUT', 'DATE FIN ', 'POSITION PNEU', 'MODELE PNEU', 'FOURNISSEUR', 'MONTANT'];
  displayedColumns = ['NumSerie', 'EtatPneu', 'KmAcquisition', 'DateDebut', 'DateFin', 'PositionPneu', 'ModelePneu', 'Fournisseurs', 'Montant'];
  selectedTab = 0
  dataPneu = [];
  dataPneuFiltred = []
  type: boolean = false
  public axes: any[] = []
  dataSourceAdmin: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('historicModal') public historicModal: ModalDirective;
  @ViewChild('administraifModal') public administraifModal: ModalDirective;
  // @ViewChild('fileModal') public fileModal: ModalDirective;
  @ViewChild('adminTbSort') adminTbSort: MatSort

  documents = []
  mode: String = "Ajouter"
  columnNameAdmin = ['Type', 'Date contrat', 'Montant', 'Sociète', 'Date Prochaine', 'Jours Rapel', 'Jours restants', 'Actions']
  columnDisplayAdmin = ['typeDocument', 'dateContrat', 'montant', 'societe', 'dateProchain', 'rapelJours', 'joursReste', 'actions']

  selectedItemTable = ['ac', 'cm', 'cg', 'cv', 'ta', 'vi', 'vt', 'ass']
  tabTem = []
  /////////////////////////////////////////////////////////////////


  ngOnInit() {
    this.isEditPermission = this.tools.isAuthorized('Parametrage_Vehicules', 'Mettre a jour')
    this.isAddPermission = this.tools.isAuthorized('Parametrage_Vehicules', 'Ajouter')
    this.loadData();
  }

  //////////////////////
  loadData() {
    this.loading = true;
    var route = this.router
    this.dataService.getDeviceData("").subscribe({
      next: (d: any) => {
        let now = Math.round(new Date().getTime() / 1000)
        // console.log(d);
        d.forEach(e => {
          e.age = e.age ?? 0 > 0 ? (now - e.age) : "jamais"
          e.creationTime = this.tools.formatDateForInput(this.tools.timeStampToDate(e.creationTime ?? 0));
          e.registrationExpireString != 0 ? e.registrationExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.registrationExpire ?? 0)) : '';
          e.insuranceExpireString != 0 ? e.insuranceExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.insuranceExpire ?? 0)) : '';
        });
        this.data = d;
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

  loadOffset(ev) {
    this.offModalLoading = true;
    var url = "?d=" + ev
    this.offsetModal.show();
    var route = this.router
    this.dataService.getDeviceData(url).subscribe({
      next: (d: any) => {
        // console.log(d);
        this.selectedDevice = d[0];
        this.offset = this.selectedDevice.odometerOffsetKM;
        this.offModalLoading = false;
        this.oldOdo = this.round2d(this.selectedDevice.lastOdometerKM + this.selectedDevice.odometerOffsetKM);
        this.newOdo = this.oldOdo;
      }, error(err) {
        console.log(err);
        this.offModalLoading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  modifierOffset() {
    var route = this.router
    this.errorMsg = ""
    this.dataService.updateDeviceOffset({
      odometerOffsetKM: this.offset,
      deviceID: this.selectedDevice.deviceID
    }).subscribe({
      next: (res) => {
        this.loadData()
        this.offsetModal.hide()
      }, error(err) {
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

  calculateOffset(v) {
    this.offset = parseFloat((v - this.selectedDevice.lastOdometerKM).toFixed(2));
  }

  loadModify(idDevice) {
    this.selectedDevice = new Device();
    ///////////////////////////////////////
    this.selectedTab = 0
    this.type = false
    this.calculateRestDays()
    this.tabTem = this.documents
    this.dataSourceAdmin = new MatTableDataSource(this.tabTem);
    this.dataSourceAdmin.sort = this.adminTbSort;
    // this.selectAllDoc = true;
    this.selectedItemTable = ['ass']
    ///////////////////////////////////////////
    if (idDevice) {
      var url = "?d=" + idDevice
      this.modalLoading = true;
      ////////////////////////////////////
      this.getSchema(idDevice)
      this.getDeviceDocuments(idDevice)
      /////////////////////////////////////
      this.primaryModal.show()
      var route = this.router
      this.dataService.getDeviceData(url).subscribe({
        next: (d: any) => {
          // console.log(d[0]);
          d[0].creationTime = this.tools.formatDateForInput(this.tools.timeStampToDate(d[0].creationTime));
          d[0].fuelEconomy = d[0].fuelEconomy > 0 ? Math.round(100 / d[0].fuelEconomy) : 0;
          d[0].pushpinID = this.tools.getImageId(d[0].pushpinID);
          d[0].registrationExpireString != 0 ? d[0].registrationExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(d[0].registrationExpire)) : '';
          d[0].insuranceExpireString != 0 ? d[0].insuranceExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(d[0].insuranceExpire)) : '';
          this.selectedDevice = d[0];
          this.modalLoading = false;
        }, error(err) {
          console.log(err);
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })
    }
  }

  setExpDates() {
    this.selectedDevice.registrationExpire = this.tools.dateToTimestamp(new Date(this.selectedDevice.registrationExpireString));
    this.selectedDevice.insuranceExpire = this.tools.dateToTimestamp(new Date(this.selectedDevice.insuranceExpireString));
  }

  modifier() {
    var route = this.router
    this.errorMsg = ""

    if (this.selectedTab == 0) {
      if (!this.selectedDevice.description) {
        this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
      } else if (!this.tools.ValidatePhone(this.selectedDevice.simPhoneNumber)) {
        this.errorMsg = "Vous avez saisi un telephone invalid."
      } else {
        this.setExpDates()
        this.selectedDevice.fuelEconomy = this.selectedDevice.fuelEconomy > 0 ? Math.round(100 / this.selectedDevice.fuelEconomy) : 0;
        this.dataService.updateDevice(this.selectedDevice).subscribe({
          next: (res) => {
            this.loadData()
            this.primaryModal.hide()
          }, error(err) {
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
    if (this.selectedTab == 1) {
      let i = 0;
      this.axes.forEach(a => {
        i++
        a.axeIndex = i
      })
    }
  }

  onIconChange(e) {
    // console.log(e, this.selectedDevice);
    this.selectedDevice.pushpinID = e.value
  }

  round2d(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }

  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Vehicules(this.data, "Rapport de List de Vehicules ") :
      this.exportingExcelTool.Export_Vehicules(this.data, "Rapport de List de Vehicules ")
  }

  //////////////////////////////////////////////////////////////////////////////////////////////

  selectTab(i) {
    this.selectedTab = i
  }
  /************************** shéma tab ********************************************** */
  openHistoticModal() {
    this.historicModal.show();
    this.getHistoricPneu(this.selectedDevice.deviceID)
    // document.getElementById('sortTable').DataTable()
  }

  addAxe() {
    this.errorMsg = ""
    if (this.axes.length < 6) {
      let axe = {
        idAxe: 0,
        accountID: "",
        deviceID: this.selectedDevice.deviceID,
        axeIndex: 0,
        axeType: this.type,
        // dd: "",
        // dg: "",
        // gd: "",
        // gg: "",
        // ddKm: 0,
        // dgKm: 0,
        // gdKm: 0,
        // ggKm: 0
      }
      this.axes.push(axe)
      this.dataService.addShema(axe).subscribe({
        next: (res) => {
          this.axes = res[0];
          this.axes.forEach(axe => {
            if (axe.dg) axe.dg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dg ?? 0) * 1000))
            if (axe.dd) axe.dd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dd ?? 0) * 1000))
            if (axe.gd) axe.gd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gd ?? 0) * 1000))
            if (axe.gg) axe.gg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gg ?? 0) * 1000))
          })

        }, error(err) {
          var route = this.router
          console.log("erroooor ====>", err);
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

    else
      this.errorMsg = "Vous avez atteint le maximum des axes !"

  }

  deleteAxe(axe, index) {
    if (axe.dd || axe.dg || axe.gd || axe.gg) {
      if (confirm("Cet axe contient des inforation sur les pneux ,vous êtes sûr que vous voulez le suprimmer ? ")) {
        this.axes.splice(index, 1)
        this.errorMsg = ""
        this.dataService.deleteAxe(axe).subscribe({
          next:
            res => {
              // console.log("res ", res);
              this.axes = res[0];
              this.axes.forEach(axe => {
                if (axe.dg) axe.dg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dg ?? 0) * 1000))
                if (axe.dd) axe.dd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dd ?? 0) * 1000))
                if (axe.gd) axe.gd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gd ?? 0) * 1000))
                if (axe.gg) axe.gg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gg ?? 0) * 1000))
              })
            },
          error(err) {
            var route = this.router
            console.log("err ", err);
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }
            else if (err.status == 402) {
              this.errorMsg = "Erreur la modification est bloqué."
            }
          }
        })
      }
    } else {
      this.axes.splice(index, 1)
      this.errorMsg = ""
      this.dataService.deleteAxe(axe).subscribe({
        next:
          res => {
            // console.log("res ", res);
            this.axes = res[0];
            this.axes.forEach(axe => {
              if (axe.dg) axe.dg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dg ?? 0) * 1000))
              if (axe.dd) axe.dd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dd ?? 0) * 1000))
              if (axe.gd) axe.gd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gd ?? 0) * 1000))
              if (axe.gg) axe.gg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gg ?? 0) * 1000))
            })
          },
        error(err) {
          var route = this.router
          console.log("err ", err);
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

  getSchema(idDevice) {
    var url = "?d=" + idDevice;
    this.dataService.getSchema(url).subscribe({
      next:
        (response) => {

          this.axes = [].concat(response)
          // console.log("this.axes ", this.axes);
          this.axes.forEach(axe => {
            if (axe.dg) axe.dg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dg ?? 0) * 1000))
            if (axe.dd) axe.dd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dd ?? 0) * 1000))
            if (axe.gd) axe.gd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gd ?? 0) * 1000))
            if (axe.gg) axe.gg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gg ?? 0) * 1000))
          })
          // this.getPneuInfo()
        },
      error(err) {
        console.log('err ', err);
        if (err.status == 401) {
          var route = this.router;
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })

  }

  getHistoricPneu(idDevice) {
    let url = "?deviceID=" + idDevice
    this.dataService.getChangemantsPneu(url).subscribe({
      next:
        resp => {

          this.dataPneu = [].concat(resp)
          this.dataPneu.forEach(p => {
            p.DateDebut = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
            p.DateFin = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateFin ?? 0) * 1000)).toString();
            p.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(p.creationTime ?? 0) * 1000)).toString();
          })

          this.dataSource = new MatTableDataSource(this.dataPneu)
          this.dataSource.sort = this.sort;


        },
      error(err) {
        console.log("err ", err);
      }
    })

  }

  /****************** Ducument Tab ************** */

  openAddModal() {
    this.document = new CarDocument(null, this.document.typeDocument)
    this.administraifModal.show()
    this.mode = "Ajouter"
  }

  calculateRestDays() {
    this.documents.forEach(d => {
      let nbrJours = this.getDaysBetweentnDates(d.dateProchain);
      d.colorRest = this.getColor(nbrJours, d.rapelJours);
      if (d.colorRest == 'green' || d.colorRest == 'orange')
        d.joursReste = nbrJours + " jours restant."
      else
        d.joursReste = " Expiré depuis " + Math.abs(nbrJours) + " jours.";
    });
  }

  getContent(type) {
    this.selectAllDoc = false

    switch (type) {
      case 'ac':
        this.getSelectedItem('ac', 'Autorisation Circulation')
        break;
      case 'cm':
        this.getSelectedItem('cm', 'Carnet Métrologique')
        break;
      case 'cg':
        this.getSelectedItem('cg', 'Carte Grise')
        break;
      case 'cv':
        this.getSelectedItem('cv', 'Carte Vert')
        break;
      case 'ass':
        this.getSelectedItem('ass', 'Assurance')
        break;
      case 'ta':
        this.getSelectedItem('ta', 'Taxe')
        break;
      case 'vi':
        this.getSelectedItem('vi', 'Vignette')
        break;
      case 'vt':
        this.getSelectedItem('vt', 'Visites Technique')
        break;
    }
    if (this.selectedItemTable.length == 8)
      this.selectAllDoc = true
  }

  getSelectedItem(tag, type) {
    this.selectedItemTable = []
    this.selectedItemTable.push(tag)
    this.tabTem = this.documents.filter(d => d.typeDocument == type)
    this.dataSourceAdmin = new MatTableDataSource(this.tabTem);
    this.dataSourceAdmin.sort = this.adminTbSort;
    // console.log(type);

    this.document.typeDocument = type;
  }

  getDaysBetweentnDates(endtDate): number {
    const date1 = new Date(endtDate);
    const date2 = new Date();
    let endtdate = Math.floor(date1.getTime() / 1000); // return int
    let startdate = Math.floor(date2.getTime() / 1000);
    let nbrDays: number = Math.floor((endtdate - startdate) / 86400) //86400 is the number of seconds in a day
    return nbrDays;
  }

  getColor(restJours, rappelJours) {

    if (restJours > rappelJours)
      return 'green'
    else {
      if (restJours <= rappelJours && restJours >= 0)
        return 'orange'
      if (restJours < 0)
        return 'red'
    }
    return 'black'

  }

  loadModifyDocument(doc) {
    this.document = this.getJsonValue(doc)
    // this.document.dateContrat = this.tools.formatDateForInput(new Date(this.document.dateContrat))
    this.mode = "Modifier"
    this.administraifModal.show()
  }

  deleteDocument(line) {
    if (confirm("Etes-vous sûr que vous voulez supprimer " + line.typeDocument + "? ")) {

      let index = this.documents.findIndex(x => x.idDocument === line.idDocument);

      // this.documents.splice(index, 1)

      this.tabTem = this.documents;
      this.dataSourceAdmin = new MatTableDataSource(this.tabTem);
      this.dataSourceAdmin.sort = this.adminTbSort;
      let route: Router
      // let url = "?d=" + line.idDocument
      this.dataService.deleteDeviceDocument(line).subscribe({
        next: (res) => {

          this.documents = [].concat(res[0])
          this.documents.forEach(
            d => {
              d.dateContrat = this.tools.formatDateForInput(new Date(Number.parseInt(d.dateContrat ?? 0) * 1000));
              d.dateProchain = this.tools.formatDateForInput(new Date(Number.parseInt(d.dateProchain ?? 0) * 1000));
              d.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(d.creationTime ?? 0) * 1000));
            }
          )
          this.calculateRestDays()

          this.dataSourceAdmin = new MatTableDataSource(this.documents);
          this.dataSourceAdmin.sort = this.adminTbSort;

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

  getJsonValue(v) {
    return JSON.parse(JSON.stringify(v))
  }

  saveDocument() {
    if (!this.document.typeDocument || !this.document.dateContrat
      || !this.document.dateProchain || !this.document.rapelJours) {
      this.errorMsg1 = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.errorMsg1 = ""
      let docToSave = {
        idDocument: this.document.idDocument,
        accountID: this.document.accountID,
        typeDocument: this.document.typeDocument,
        dateContrat: (new Date(this.document.dateContrat)).getTime() / 1000,
        dateProchain: (new Date(this.document.dateProchain)).getTime() / 1000,
        montant: this.document.montant,
        societe: this.document.societe,
        deviceID: this.selectedDevice.deviceID,
        rapelJours: this.document.rapelJours,
      }
      var endPoint = 'addDocVehicule'; if (this.mode == "Modifier") { endPoint = 'editDocVehicule'; }
      this.dataService.AddOrUpdateDeviceDocument(endPoint, docToSave).subscribe({
        next: resp => {
          this.documents = resp[0]
          this.documents.reverse()
          this.documents.forEach(
            d => {
              d.dateContrat = this.tools.formatDateForInput(new Date(Number.parseInt(d.dateContrat ?? 0) * 1000));
              d.dateProchain = this.tools.formatDateForInput(new Date(Number.parseInt(d.dateProchain ?? 0) * 1000));
            }
          )
          this.calculateRestDays()
          this.tabTem = this.documents
          this.dataSourceAdmin = new MatTableDataSource(this.tabTem);
          this.dataSourceAdmin.sort = this.adminTbSort;
          this.document = new CarDocument()
          this.selectAllDoc = true
          this.getAllDoc()
        },
        error(err) {
          console.log("error ", err);
        }
      })
      this.administraifModal.hide();
      this.mode = "add"
    }

  }


  getAllDoc() {
    this.tabTem = this.documents
    if (this.selectAllDoc) {
      this.dataSourceAdmin = new MatTableDataSource(this.tabTem);
      this.dataSourceAdmin.sort = this.adminTbSort;
      this.selectedItemTable = ['ac', 'cm', 'cg', 'cv', 'ta', 'vi', 'vt', 'ass']
    } else {
      this.selectedItemTable = ['ass']
      this.tabTem = this.documents.filter(dt => dt.typeDocument == 'Assurance')
      this.dataSourceAdmin = new MatTableDataSource(this.tabTem);
      this.dataSourceAdmin.sort = this.adminTbSort;

    }
  }

  getDeviceDocuments(idDevice) {
    let url = "?deviceID=" + idDevice
    this.dataService.getDeviceDocuments(url).subscribe({
      next:
        resp => {
          this.documents = [].concat(resp)
          this.documents.reverse()
          this.documents.forEach(
            d => {
              d.dateContrat = this.tools.formatDateForInput(new Date(Number.parseInt(d.dateContrat ?? 0) * 1000));
              d.dateProchain = this.tools.formatDateForInput(new Date(Number.parseInt(d.dateProchain ?? 0) * 1000));
              d.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(d.creationTime ?? 0) * 1000));
            }
          )
          this.calculateRestDays()
          this.getSelectedItem("ass", "Assurance")
          // this.dataSourceAdmin = new MatTableDataSource(this.documents);
          // this.dataSourceAdmin.sort = this.adminTbSort;
        },
      error(err) {
        console.log("error ", err);
      }
    })
  }

  showDocument(doc) {
    let url = "?id_foreign=" + doc.idDocument + "&table=CarDocument&justUrl=1"
    this.dataService.getDocsUrl(url).subscribe({
      next:
        (resp: any) => {
          if (resp.length > 0) {
            this.file_url = resp[0].file_url;
            // this.file_name = resp[0].file_name;
            // this.fileModal.show()
            window.open(this.file_url, "_blank");
            console.log(this.file_url);
          }
        },
      error(err) {
        console.log("error ", err);
      }
    })
  }
}


