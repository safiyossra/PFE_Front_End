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
  selectedDevice: Device = new Device();
  errorMsg: string;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
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
          e.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(e.creationTime ?? 0) * 1000));
          e.registrationExpireString != 0 ? e.registrationExpireString = this.tools.formatDateForInput(new Date(Number.parseInt(e.registrationExpire) * 1000)) : '';
          e.insuranceExpireString != 0 ? e.insuranceExpireString = this.tools.formatDateForInput(new Date(Number.parseInt(e.insuranceExpire) * 1000)) : '';
          // console.log(e.insuranceExpireString);
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
          d[0].creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(d[0].creationTime) * 1000));
          d[0].fuelEconomy = d[0].fuelEconomy > 0 ? Math.round(100 / d[0].fuelEconomy) : 0;
          d[0].pushpinID = this.tools.getImageId(d[0].pushpinID);
          d[0].registrationExpireString != 0 ? d[0].registrationExpireString = this.tools.formatDateForInput(new Date(Number.parseInt(d[0].registrationExpire) * 1000)) : '';
          d[0].insuranceExpireString != 0 ? d[0].insuranceExpireString = this.tools.formatDateForInput(new Date(Number.parseInt(d[0].insuranceExpire) * 1000)) : '';
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

  dateToTimeStamp(date) {
    return Date.parse(date) / 1000 as number;
  }

  setExpDates() {
    this.selectedDevice.registrationExpire = this.dateToTimeStamp(new Date(this.selectedDevice.registrationExpireString));
    this.selectedDevice.insuranceExpire = this.dateToTimeStamp(new Date(this.selectedDevice.insuranceExpireString));
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


