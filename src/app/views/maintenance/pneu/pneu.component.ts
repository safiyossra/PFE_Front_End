
import { EntretienPneu } from './../../../models/entretien-pneu';
import { Router } from '@angular/router';
import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MyDateRangePickerOptions, MyDateRangePickerComponent } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/services/data.service';
import { util } from 'src/app/tools/utils';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';
import { Constant } from 'src/app/tools/constants';

@Component({
  selector: 'app-pneu',
  templateUrl: './pneu.component.html',
  styleUrls: ['./pneu.component.scss']
})
export class PneuComponent implements OnInit {

  iconCollapse: string = 'icon-arrow-up';
  isCollapsed: boolean = false;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  loading: boolean = false;
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  public devices: any = [];
  selectedDevices = [];
  selectedDevice = this.selectedDevices;

  public modeles: any = [];


  public axes: any[]
  selectedPneu = new EntretienPneu();
  mode = "Ajouter";
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  errorMsg: string;
  entretienPneu: EntretienPneu = new EntretienPneu()

  data = [];
  data2 = []
  selectedMarque: any

  /******************************************************* */
  constructor(private dataService: DataService, private tools: util, public cts: Constant, private router: Router,
    private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) {
  }

  ngOnInit(): void {
    this.axes = []
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

    this.getDev();

  }

  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        this.devices = res;
        this.getChangementsPneu();

      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })


  }


  getChangementsPneu() {
    let url = "?deviceID=" + ""
    this.dataService.getChangemantsPneu(url).subscribe({
      next:
        res => {

          this.data2 = [].concat(res)
          this.data2.forEach(p => {
            p.deviceName = this.getVehiculeNameById(p.deviceID);
            p.DateDebut = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
            p.DateFin = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateFin ?? 0) * 1000)).toString();
            p.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(p.creationTime ?? 0) * 1000)).toString();
          })

          this.data = [].concat(this.data2)

        },
      error(err) {
        console.log("err ", err);
      }
    })
  }

  modalAjoutr() {
    this.entretienPneu = new EntretienPneu();
    this.axes = []
    this.mode = "Ajouter"
    this.primaryModal.show()

  }


  exporter(type) {
    var v = this.getJsonValue(this.data);


    type == 1 ? this.exportingPdfTool.exportPdf_Pneu(v, "Rapport Entretien Pneu") :
      this.exportingExcelTool.Export_Pneu(v, "Rapport Entretien Pneu")
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }



  getSelectedDevices(selected) {
    this.selectedDevice = selected;
  }

  getSelectedMotif(selectedMotif) {
    this.entretienPneu.MotifChangPneu = selectedMotif
  }

  getSelectedModele(selectedModele) {
    this.entretienPneu.ModelePneu = selectedModele
  }

  getSelectedDimension(selectedDimension) {
    this.entretienPneu.DimensionPneu = selectedDimension
  }



  loadData(first = false) {
    this.loading = true;
    if (!first) {
      let a = this.data2.filter(e => (Date.parse(e.creationTime) / 1000) >= this.myDateRangePicker.getDateFrom && (Date.parse(e.creationTime) / 1000) <= this.myDateRangePicker.getDateTo && e.deviceID == this.selectedDevice)

      this.data = [].concat(a);
      // console.log("date from", this.myDateRangePicker.getDateFrom);

    }
    this.loading = false

  }

  getSelectedDevicesModal(seletedVehicule) {
    this.entretienPneu.deviceID = seletedVehicule;
    this.entretienPneu.KmAcquisition = this.devices.filter(v => v.dID == seletedVehicule)[0].km
    this.getShema(seletedVehicule)

  }


  getSelectedMarque(id) {
    this.selectedMarque = this.cts.marques.filter(m => m.name == id)
    this.entretienPneu.MarquePneu = id          //this.selectedMarque[0].name
    this.modeles = this.selectedMarque[0].models
  }

  getSelectedEtat(selectedEtat) {
    this.entretienPneu.EtatPneu = selectedEtat
  }

  submit() {

    if (!this.entretienPneu.deviceID || !this.entretienPneu.KmAcquisition || !this.entretienPneu.Fournisseurs ||
      !this.entretienPneu.LieuMontage || !this.entretienPneu.FraisMontage || !this.entretienPneu.MarquePneu ||
      !this.entretienPneu.ModelePneu || !this.entretienPneu.DimensionPneu || !this.entretienPneu.PositionPneu ||
      !this.entretienPneu.DateDebut || !this.entretienPneu.DateFin || !this.entretienPneu.Montant || !this.entretienPneu.EtatPneu) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.entretienPneu.indexAxe = parseInt(this.entretienPneu.PositionPneu.charAt(0))
      // this.entretienPneu.deviceName = this.devices.filter(d => d.dID == this.entretienPneu.IDVehicule)[0].name
      this.entretienPneu.DateDebut = (new Date(this.entretienPneu.DateDebut)).getTime() / 1000;
      this.entretienPneu.DateFin = (new Date(this.entretienPneu.DateFin)).getTime() / 1000,
        this.errorMsg = ""

      if (this.mode == "Ajouter") this.ajouter()
      if (this.mode == "Modifier") this.modifier()
    }

  }


  ajouter() {
    this.dataService.addPneu(this.entretienPneu).subscribe({
      next:
        res => {

          this.data2 = [].concat(res[0])
          this.data2.forEach(p => {
            p.deviceName = this.getVehiculeNameById(p.deviceID);
            p.DateDebut = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
            p.DateFin = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateFin ?? 0) * 1000)).toString();
            p.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(p.creationTime ?? 0) * 1000)).toString();
          });
          this.data = [].concat(this.data2)

        },
      error(err) {
        console.log("err ", err);
      }
    })

    this.primaryModal.hide()
    this.loading = false;

  }

  modifier() {
    this.errorMsg = ""
    this.data = this.data2

    this.primaryModal.hide()
    this.loading = false;
    this.dataService.updateCangementPneu(this.entretienPneu).subscribe({
      next:
        resp => {
          this.data2 = [].concat(resp[0])
          this.data2.forEach(p => {
            p.deviceName = this.getVehiculeNameById(p.deviceID);
            p.DateDebut = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
            p.DateFin = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateFin ?? 0) * 1000)).toString();
            p.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(p.creationTime ?? 0) * 1000)).toString();
          });
          this.data = [].concat(this.data2)

        },
      error(err) {
        console.log("response update ", err);
      }
    })

  }
  /************ table functions *********/
  loadModify(ev) {

    if (ev) {
      this.mode = "Modifier"
      this.selectedPneu = this.getJsonValue(ev);
      // console.log("selectedPneu ", this.selectedPneu);
      this.selectedMarque = this.cts.marques.filter(m => m.name == this.selectedPneu.MarquePneu)
      this.modeles = this.selectedMarque[0].models.filter(m => m.name == this.selectedPneu.ModelePneu)
      this.getShema(this.selectedPneu.deviceID)
      this.entretienPneu = this.selectedPneu;
      this.primaryModal.show()
    }
  }

  refreshKm() {
    this.selectedPneu.KmAcquisition = this.devices.filter(d => d.dID == this.selectedPneu.deviceID)[0].km
  }

  getJsonValue(v) {
    return JSON.parse(JSON.stringify(v))
  }



  delete(pneu) {
    if (confirm("Vous êtes sûr que vous voulez suprimmer cette declaration ? ")) {
      let index = this.data2.findIndex(x => x.idPneu === pneu.idPneu);
      this.data2.splice(index, 1)
      this.data = [].concat(this.data2);
      var route = this.router
      var url = "?idPneu=" + pneu.idPneu


      this.dataService.deleteCangementPneu(url).subscribe({
        next:
          res => {

            this.data2 = [].concat(res[0])
            this.data2.forEach(p => {
              // console.log("vehicule  ", this.devices.filter(d => d.dID == p.IDVehicule));
              p.deviceName = this.getVehiculeNameById(p.deviceID);
              p.DateDebut = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
              p.DateFin = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
              p.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(p.DateDebut ?? 0) * 1000)).toString();
            });
            this.data = [].concat(this.data2)
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
      // this.getChangementsPneu();
    }
  }


  getShema(seletedVehicule) {

    let url = "?d=" + seletedVehicule

    this.dataService.getSchema(url).subscribe({
      next:
        res => {

          this.axes = [].concat(res)

          this.axes.forEach(axe => {
            if (axe.dg) axe.dg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dg ?? 0) * 1000))
            if (axe.dd) axe.dd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.dd ?? 0) * 1000))
            if (axe.gd) axe.gd = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gd ?? 0) * 1000))
            if (axe.gg) axe.gg = this.tools.formatDateForInput(new Date(Number.parseInt(axe.gg ?? 0) * 1000))
          }

          )

          // this.getPneuInfo()
        },
      error(err) {
        console.log("err ", err);

      }
    })

  }

  getPneuInfo() {
    this.axes.forEach(axe => {
      this.data2.forEach(p => {
        if (axe.idAxe == p.idAxe) {
          let position = p.PositionPneu.charAt(1) + p.PositionPneu.charAt(2)
          switch (position) {
            case "dd":
              axe.dd = p.DateDebut
              axe.ddKm = p.KmAcquisition
              break
            case "dg":
              axe.dg = p.DateDebut
              axe.dgKm = p.KmAcquisition
              break
            case "gd":
              axe.gd = p.DateDebut
              axe.gdKm = p.KmAcquisition
              break
            case "gg":
              axe.gg = p.DateDebut
              axe.ggKm = p.KmAcquisition
              break
          }

        }
      })
    })
  }


  getVehiculeNameById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].name
    }
    return ""
  }

  getPosition(selectedPenu, index, axe) {
    index++
    this.entretienPneu.PositionPneu = index + selectedPenu.id;
    this.entretienPneu.idAxe = axe.idAxe

  }




}

