import { map } from 'rxjs/operators';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
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

  // selectedDevicesModal = [];
  // selectedDeviceModal = this.selectedDevicesModal;


  public modeles: any = [];
  public dimentions: any = [
    { id: 1, name: '1' },
    { id: 2, name: '2' }
  ];
  public motifs: any = [
    { id: 'fin de vie', name: 'fin de vie' },
    // { id: 'motif2', name: 'motif2' },
  ]


  public etats: any = [
    { id: 'Neuf', name: 'Neuf' },
    { id: 'Occasion', name: 'Occasion' },
  ]



  selectedPneu = new EntretienPneu();
  mode = "Ajouter";
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  errorMsg: string;
  entretienPneu: EntretienPneu = new EntretienPneu()
  selectedOperations = [];
  //  data = [];
  currentKM = 0;

  data = [];
  data2 = []
  selectedMarque: any
  selectedPneu1 = new EntretienPneu(1, 1224, 'Neuf', 45, '2022-09-12', '2022-12-07', 'dacia', 'F1', 'model1', 'marque1', 968, 'casa', 485, 'ob1', '2GD', 'motif1', 1, '2022-10-12');
  selectedPneu2 = new EntretienPneu(2, 1324, 'Occasion', 45, '2022-10-30', '2022-09-12', 'v13', 'F2', 'model2', 'marque2', 25, 'tanger', 4545, 'ob1', '2DG', 'motif1', 2, '2022-09-28');
  selectedPneu3 = new EntretienPneu(3, 1244, 'Neuf', 45, '2021-02-12', '2022-09-12', 'dacia', 'F3', 'model2', 'marque1', 898, 'casa', 3645, 'ob1', '3GD', 'motif2', 1, '2022-10-01');
  selectedPneu4 = new EntretienPneu(4, 1204, 'Occasion', 45, '2022-08-10', '2022-09-129', 'v16', 'F4', 'model1', 'marque2', 656, 'tanger', 435, 'ob1', '1GD', 'motif1', 2, '2022-09-29');
  selectedPneu5 = new EntretienPneu(5, 1214, 'Occasion', 45, '2022-05-10', '2022-08-12', 'v16', 'F5', 'model1', 'marque2', 565, 'casa', 825, 'ob1', '3DG', 'motif2', 2, '2022-10-02');
  selectedPneu6 = new EntretienPneu(6, 1284, 'Neuf', 20, '2022-08-35', '2022-06-18', 'dacia', 'F6', 'model2', 'marque1', 396, 'rabat', 945, 'ob1', '1GD', 'motif1', 1, '2022-10-11');
  selectedPneu7 = new EntretienPneu(7, 1224, 'Occasion', 45, '2022-09-10', '2022-09-12', 'v13', 'F7', 'model2', 'marque1', 356, 'casa', 325, 'ob1', '3DG', 'motif2', 2, '2022-10-14');
  selectedPneu8 = new EntretienPneu(8, 1234, 'Neuf', 85, '2022-12-12', '2022-03-12', 'v16', 'F8', 'model1', 'marque2', 6941, 'tetouan', 145, 'ob1', '2GD', 'motif2', 2, '2022-10-01');
  /******************************************************* */
  constructor(private dataService: DataService, private tools: util, public cts: Constant, private router: Router,
    private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) {
    // this.selectedMarques = this.marques[0];
    this.data = [this.selectedPneu1, this.selectedPneu2, this.selectedPneu3, this.selectedPneu4, this.selectedPneu5, this.selectedPneu6, this.selectedPneu7, this.selectedPneu8]
    this.data2 = [this.selectedPneu1, this.selectedPneu2, this.selectedPneu3, this.selectedPneu4, this.selectedPneu5, this.selectedPneu6, this.selectedPneu7, this.selectedPneu8]


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
        console.log("this.devices ", this.devices);
        this.data.forEach(p => {
          // console.log("vehicule  ", this.devices.filter(d => d.dID == p.IDVehicule));

          p.deviceName = this.devices.filter(d => d.dID == p.IDVehicule)[0].name
        })

      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })


  }


  modalAjoutr() {
    this.entretienPneu = new EntretienPneu();
    this.entretienPneu.IDVehicule = []
    this.entretienPneu.MarquePneu = []
    this.entretienPneu.MotifChangPneu = []
    this.entretienPneu.ModelePneu = []
    this.entretienPneu.DimensionPneu = []
    this.entretienPneu.EtatPneu = []
    console.log(" this.entretienPneu  ", this.entretienPneu);

    this.axes = []
    this.mode = "Ajouter"
    this.primaryModal.show()

  }



  exporter(type) {
    var v = this.getJsonValue(this.data);

    // type == 1 ? this.exportingPdfTool.exportPdf_Pneu(v, "Rapport Entretien Pneu") :
    //   this.exportingExcelTool.Export_Pneu(v, "Rapport Entretien Pneu")
  }




  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }



  getSelectedDevices(selected) {
    this.selectedDevice = selected;
    this.entretienPneu.IDVehicule;
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
    var route = this.router
    this.loading = true;
    var urlParams = ""
    if (!first) {
      let a = this.data2.filter(e => (Date.parse(e.creationTime) / 1000) > this.myDateRangePicker.getDateFrom && (Date.parse(e.creationTime) / 1000) < this.myDateRangePicker.getDateTo && e.IDVehicule == this.selectedDevice)
      console.log(a);
      this.data = [].concat(a);
      console.log("date from", this.myDateRangePicker.getDateFrom);

    }
    this.loading = false
    // console.log("data======>", this.data);

  }

  getSelectedDevicesModal(seletedVehicule) {
    this.entretienPneu.IDVehicule = seletedVehicule;
    // console.log("veheculeselected ", this.devices.filter(v => v.dID == seletedVehicule));
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
    this.entretienPneu.indexAxe = parseInt(this.entretienPneu.PositionPneu.charAt(0))
    this.entretienPneu.deviceName = this.devices.filter(d => d.dID == this.entretienPneu.IDVehicule)[0].name
    console.log("1----pneu   ", this.entretienPneu);
    if (!this.entretienPneu.IDVehicule || !this.entretienPneu.KmAcquisition || !this.entretienPneu.Fournisseurs ||
      !this.entretienPneu.LieuMontage || !this.entretienPneu.FraisMontage || !this.entretienPneu.MarquePneu ||
      !this.entretienPneu.ModelePneu || !this.entretienPneu.DimensionPneu || !this.entretienPneu.PositionPneu ||
      !this.entretienPneu.DateDebut || !this.entretienPneu.DateFin || !this.entretienPneu.Montant || !this.entretienPneu.EtatPneu) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.errorMsg = ""
      console.log("2-----pneu   ", this.entretienPneu);

      if (this.mode == "Ajouter") this.ajouter()
      if (this.mode == "Modifier") this.modifier()
    }

  }


  ajouter() {
    this.entretienPneu.creationTime = this.tools.formatDateForInput(new Date()).toString()
    this.data2.push(this.entretienPneu)
    this.data = [].concat(this.data2)
    this.primaryModal.hide()
    this.loading = false;

  }
  modifier() {
    this.errorMsg = ""
    this.data2 = this.data2.map(p => p.IDPneu !== this.selectedPneu.IDPneu ? p : this.entretienPneu);
    this.data = this.data2

    this.primaryModal.hide()
    this.loading = false;
    console.log("data table ", this.data);

  }

  /************ table functions *********/
  loadModify(ev) {
    console.log("event ", ev);

    if (ev) {
      this.mode = "Modifier"
      this.selectedPneu = this.getJsonValue(ev);
      console.log("selectedPneu ", this.selectedPneu);
      this.getShema(this.selectedPneu.IDVehicule)
      this.entretienPneu = this.selectedPneu;
      this.primaryModal.show()
    }
  }

  refreshKm() {
    this.selectedPneu.KmAcquisition = this.devices.filter(d => d.dID == this.selectedPneu.IDVehicule)[0].km
  }

  getJsonValue(v) {
    return JSON.parse(JSON.stringify(v))
  }



  delete(plan) {

    if (confirm("Are you sure you want to delete " + plan)) {
      console.log(this.data);
      let index = this.data.findIndex(x => x.IDPneumatique === plan);
      console.log('index', index);

      console.log('splice');
      this.data2.splice(index, 1)
      console.log(this.data);
      this.loadData(true)
      this.data = [].concat(this.data2)



      // var route = this.router
      // var u = "?IDPneumatique=" + plan
      // this.data.splice(index, 1)

      // ?????????????????????
      // this.dataService.delPlanEntretien(u).subscribe({
      //   next: (res) => {
      //     this.loadData(true)
      //   }, error(err) {
      //     this.modalLoading = false;
      //     if (err.status == 401) {
      //       route.navigate(['login'], { queryParams: { returnUrl: route.url } });
      //     }
      //     else if (err.status == 402) {
      //       alert("Erreur, la suppression est bloqué")
      //     }
      //   }
      // })
    }
  }

  public axes: any[]
  shema1 = [{
    idAxe: 0,
    accountID: "",
    deviceID: "",
    axeIndex: 1,
    type: false,
    dd: "",
    dg: "",
    gd: "",
    gg: "",
    ddKm: 0,
    dgKm: 0,
    gdKm: 0,
    ggKm: 0
  },
  {
    idAxe: 0,
    accountID: "",
    deviceID: "",
    axeIndex: 2,
    type: false,
    dd: "",
    dg: "",
    gd: "",
    gg: "",
    ddKm: 0,
    dgKm: 0,
    gdKm: 0,
    ggKm: 0
  }]

  shema2 = [{
    idAxe: 0,
    deviceID: "",
    accountID: "",
    axeIndex: 1,
    axeType: false,
    dd: "",
    dg: "",
    gd: "",
    gg: "",
    ddKm: 0,
    dgKm: 0,
    gdKm: 0,
    ggKm: 0
  },
  {
    idAxe: 0,
    accountID: "",
    deviceID: "",
    axeIndex: 2,
    axeType: false,
    dd: "",
    dg: "",
    gd: "",
    gg: "",
    ddKm: 0,
    dgKm: 0,
    gdKm: 0,
    ggKm: 0
  },
  {
    idAxe: 0,
    accountID: "",
    deviceID: "",
    axeIndex: 3,
    axeType: true,
    dd: "",
    dg: "",
    gd: "",
    gg: "",
    ddKm: 0,
    dgKm: 0,
    gdKm: 0,
    ggKm: 0
  },
  {
    axeIndex: 4,
    axeType: true,

  },
  {
    axeIndex: 5,
    axeType: true,

  }]
  getShema(seletedVehicule) {
    switch (seletedVehicule) {
      case "dacia":
        this.axes = this.shema1
        break;
      case "v13":
        this.axes = this.shema2
        break;
    }


  }

  getPosition(selectedPenu, index) {
    index++
    // console.log("selected pneu ", selectedPenu);
    this.entretienPneu.PositionPneu = index + selectedPenu.id;

  }




}

