import { util } from './../../../tools/utils';
import { routes } from './../../../app.routing';
import { Consommation } from './../../../models/Consommation';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';

@Component({
  templateUrl: 'consommcarburant.component.html',
})
export class ConsommcarburantComponent {

  loading: boolean = false;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  constructor(private dataService: DataService, private router: Router, private tools: util, private dateAdapter: DateAdapter<Date>, private route: Router) {
  }

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  isCollapsed: boolean = false;
  isCollapsedData: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  data = [];
  datatrajet = [];
  public isnotNum: boolean = false

  public devices: any = [];
  public drivers: any = [];
  selectedDevices = null;
  selectedDevice = this.selectedDevices;

  selectedDriverOption = null;
  selectedDriver = this.selectedDriverOption;

  showErrorDevice = false;
  errorMessageDevice = "";

  selectedDevicesModal = null;
  selectedDeviceModalOption = this.selectedDevicesModal;
  showErrorDeviceModal = false;
  errorMessageDeviceModal = "";

  selectedCiternes = null;
  selectedCiterne = this.selectedCiternes;

  consommation: Consommation = new Consommation();
  kilometrageErr = false;
  qteZeroErr = false;


  getSelectedCiternes(selected) {
    this.selectedCiterne = selected;
  }

  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }

  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;

  ngOnInit() {
    this.dateAdapter.setLocale('en-GB');

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.myDateRangePickerOptions = {
      theme: 'default',
      labels: ['Start', 'End'],
      menu: [
        { alias: 'td', text: 'Today', operation: '0d' },
        { alias: 'tm', text: 'This Month', operation: '0m' },
        { alias: 'lm', text: 'Last Month', operation: '-1m' },
        { alias: 'tw', text: 'This Week', operation: '0w' },
        { alias: 'lw', text: 'Last Week', operation: '-1w' },
        { alias: 'ty', text: 'This Year', operation: '0y' },
        { alias: 'ly', text: 'Last Year', operation: '-1y' },
        { alias: 'ln', text: 'Last 90 days', operation: '-90d' },
        { alias: 'l2m', text: 'Last 2 months', operation: '-2m' },

        { alias: 'pmt', text: 'Past Month from Today', operation: '-1mt' },
        { alias: 'pwt', text: 'Past Week from Today', operation: '-1wt' },
        { alias: 'pyt', text: 'Past Year from Today', operation: '-1yt' },
        { alias: 'pdt', text: 'Past 90 days from Today', operation: '-90dt' },
        { alias: 'pl2mt', text: 'Past 2 months from Today', operation: '-2mt' }
      ],
      dateFormat: 'yyyy-MM-dd',
      outputFormat: 'dd-MM-yyyy',
      startOfWeek: 1,
      outputType: 'object',
      locale: 'en-US',
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

    this.getDrivers();

    this.loadData(true);
  }

  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }

  getSelectedDevices(selected) {
    this.selectedDevice = selected;
  }

  // La list des vehicules
  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        this.devices = res;
        // this.devices.unshift({ dID: '-', name: 'sélectionner une vehicule' })
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  // Modal functions

  mode = "Ajouter";

  submit() {
    this.mode == 'Ajouter' ? this.ajouter() : this.modifier();
  }

  editKmEncours = false;
  editKmPrecedent = false;

  dateToTimeStamp(date) {
    return Date.parse(date) / 1000 as number;
  }

  timestampToDate(myTimestamp) {

    console.log(Date.parse(myTimestamp) / 1000);

    return Date.parse(myTimestamp) / 1000 as number;
  }

  getDrivers() {
    var route = this.router
    this.dataService.getDriverData("?minimum=true").subscribe({
      next: (res) => {
        console.log(res)
        this.drivers = res;
        // this.drivers.unshift({ driverID: '-', displayName: 'sélectionner un chauffeur' })
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  dateSelected() {
    this.consommation.dateFill = this.dateToTimeStamp(new Date(this.consommation.dateFillString));

    if (this.consommation.dateFill != '' && !isNaN(this.consommation.dateFill) && this.consommation.deviceID != '') {
      this.getKmPrecedent(this.consommation.dateFill, this.consommation.deviceID);
    }
  }

  getSelectedDeviceModal(selected) {
    console.log("getSelectedDeviceModal");

    this.consommation.deviceID = selected;
    this.consommation.kmEncours = this.getCurrentKm(selected);
    if (this.consommation.dateFill != '' && !isNaN(this.consommation.dateFill) && this.consommation.deviceID != '')
      this.getKmPrecedent(this.consommation.dateFill, this.consommation.deviceID);
  }

  getSelectedDriver(selected) {
    this.consommation.driverID = selected;
  }

  // get km precedent
  getKmPrecedent(date, vehID) {
    this.dataService.getConsommation("?date=" + date + "&vehId=" + vehID).subscribe({
      next: (res) => {
        this.consommation.kmPrecedent = (res as any)?.kmEncours ?? 0;

        if (this.consommation.pleinOn == 1)
          this.getQteTotale(this.consommation.dateFill);

      }, error(err) {
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
      }
    });
  }

  // km_actuel
  getCurrentKm(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) {
        return this.devices[i].km
      }
    }
    return 0
  }

  pleincheckbox() {
    if (this.consommation.dateFill != '' && !isNaN(this.consommation.dateFill) && this.consommation.deviceID != '' && this.consommation.pleinOn == 1)
      this.getQteTotale(this.consommation.dateFill);
  }

  // get qte total => plein
  qteTotal = 0;
  getQteTotale(date) {
    this.dataService.getConsommation("?date=" + date + "&plein=true").subscribe({
      next: (res) => {

        this.qteTotal = res as number;

        this.calculateQteMoy();

      }, error(err) {
        if (err.status == 401) {
          this.route.navigate(['login']);
        }
      }
    });
  }

  calculateQteMoy() {
    if (this.consommation.dateFill != '' && !isNaN(this.consommation.dateFill) && this.consommation.deviceID != '' && this.consommation.pleinOn == 1) {

      this.kilometrageValidate();
      this.qteValidate();

      if (this.kilometrageValidate() && this.qteValidate())
        if (this.consommation.kmPrecedent > 0)
          this.consommation.consoM = (this.qteTotal + this.consommation.qte) / (this.consommation.kmEncours - this.consommation.kmPrecedent) * 100;
        else
          this.consommation.consoM = 0
    }
  }

  kilometrageValidate() {
    if (this.consommation.kmEncours < this.consommation.kmPrecedent) {
      this.kilometrageErr = true;
      return false;
    }
    this.kilometrageErr = false;
    return true;
  }

  qteValidate() {
    if (this.consommation.qte <= 0) {
      this.qteZeroErr = true;
      return false;
    }
    this.qteZeroErr = false;
    return true;
  }

  errorMsg = "";

  verifyConsommationFields() {
    return (
      this.qteValidate()
      &&
      this.kilometrageValidate()
      &&
      this.consommation.deviceID != '-'
      &&
      this.consommation.driverID != '-'
      &&
      this.consommation.montant != 0
      &&
      this.consommation.montantTTC != 0
      &&
      this.consommation.dateFill != ''
      &&
      this.consommation.fournisseur != ''
      &&
      this.consommation.numCarte != ''
      &&
      this.consommation.numBon != ''
    )
  }

  // save button function
  ajouter() {
    var route = this.router
    this.errorMsg = ""

    if (!this.verifyConsommationFields()) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.errorMsg = ""
      this.dataService.addConsommation(this.consommation).subscribe({
        next: (res) => {
          this.loadData(true)
          // this.clearModal();
          this.primaryModal.hide();
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

  getJsonValue(v) {
    return JSON.parse(JSON.stringify(v))
  }

  loadConsomToModify(consom) {
    this.mode = 'Modifier';
    this.clearModal()
    this.consommation = this.getJsonValue(consom);
    this.consommation.dateFillString = consom.dateFill.replace(' ', 'T');
    this.consommation.dateFill = this.dateToTimeStamp(new Date(this.consommation.dateFillString));
    this.selectedDriverOption = this.consommation.driverID;
    this.selectedDeviceModalOption = this.consommation.deviceID;
    this.primaryModal.show()
  }

  btnAjouter(){
    this.mode = 'Ajouter';
    this.clearModal()
    this.primaryModal.show()
  }

  modifier() {
    var route = this.router
    this.errorMsg = ""

    if (!this.verifyConsommationFields()) {
      console.log(!this.verifyConsommationFields());
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.errorMsg = ""

      console.log(this.consommation);


      this.dataService.editConsommation(this.consommation).subscribe({
        next: (res) => {
          this.loadData(true)
          // this.clearModal();
          this.primaryModal.hide();

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

  deleteConsommation(consommation) {
    if (confirm("Are you sure to delete " + consommation.id)) {
      var route = this.router
      var id = "?id=" + consommation.id
      this.dataService.deleteConsommation(id).subscribe({
        next: (res) => {
          console.log("deleted cruduser")
          this.loadData(true)
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
      console.log(consommation);

    }
  }

  clearModal() {
    this.consommation = new Consommation()
    this.selectedDeviceModalOption = null;
    this.selectedDriverOption = null;

    this.editKmEncours = false;
    this.editKmPrecedent = false;

    console.log(this.selectedDeviceModalOption);
    console.log(this.selectedDriverOption);


  }

  loadData(first = false) {
    var route = this.router
    this.loading = true;
    var urlParams = ""
    if (!first) {
      var d = this.selectedDevice == '-' || this.selectedDevice == null ? "?" : "?d=" + this.selectedDevice + "&"
      urlParams = d + "st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
    }

    this.dataService.getConsommation(urlParams).subscribe({
      next: (d: any) => {
        this.data = d;
        this.data.forEach((e) => {
          e.dateFill = this.tools.formatDateVer(new Date(Number.parseInt(e.dateFill) * 1000));

          const d = { ...this.drivers.find(elem => elem.driverID == e.driverID) };

          e.driverName! = d.displayName;
        })
        this.loading = false;
      }, error(err) {
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };


}


