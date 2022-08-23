import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Device } from '../../../models/device';
import { util } from 'src/app/tools/utils';
import { Router } from '@angular/router';
import { Constant } from 'src/app/tools/constants';
import { ExportingTool } from 'src/app/tools/exporting_tool';
import { ExportExcel } from 'src/app/tools/export-excel';

@Component({
  templateUrl: 'crudvehicule.component.html',
  styleUrls: ["./style.scss"],
})
export class CrudvehiculeComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  offModalLoading: boolean = false;
  newOdo: any;
  oldOdo: any;
  offset: any;
  selectedDevice: Device = new Device();
  errorMsg: string;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('offsetModal') public offsetModal: ModalDirective;
  constructor(private dataService: DataService, public cts: Constant, private tools: util, private router: Router, private exportingPdfTool: ExportingTool, private exportingExcelTool: ExportExcel) { }

  data = [];

  ngOnInit() {
    this.loadData();
  }


  //////////////////////
  loadData() {
    this.loading = true;

    var route = this.router
    this.dataService.getDeviceData("").subscribe({
      next: (d: any) => {
        let now = Math.round(new Date().getTime() / 1000)
        console.log(d);
        d.forEach(e => {
          e.age = e.age ?? 0 > 0 ? (now - e.age) : "jamais"
          e.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(e.creationTime ?? 0)));
          e.registrationExpireString != 0 ? e.registrationExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.registrationExpire)) : '';
          e.insuranceExpireString != 0 ? e.insuranceExpireString = this.tools.formatDateForInput(this.tools.timeStampToDate(e.insuranceExpire)) : '';
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
        console.log(d);
        this.selectedDevice = d[0];
        this.offset = this.selectedDevice.odometerOffsetKM;
        this.offModalLoading = false;
        this.oldOdo = this.selectedDevice.lastOdometerKM + this.selectedDevice.odometerOffsetKM;
        this.newOdo = this.oldOdo;
      }, error(err) {
        console.log(err);
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

  loadModify(ev) {
    this.selectedDevice = new Device();
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
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
    if (!this.selectedDevice.description) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else
      if (!this.tools.ValidatePhone(this.selectedDevice.simPhoneNumber)) {
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

  onIconChange(e) {
    console.log(e, this.selectedDevice);
    this.selectedDevice.pushpinID = e.value
  }

  exporter(type) {
    type == 1 ? this.exportingPdfTool.exportPdf_Vehicules(this.data, "Rapport de List de Vehicules ") :
      this.exportingExcelTool.Export_Vehicules(this.data, "Rapport de List de Vehicules ")
  }
}


