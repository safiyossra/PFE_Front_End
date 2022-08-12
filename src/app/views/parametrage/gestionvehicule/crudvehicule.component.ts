import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Device } from '../../../models/device';
import { VehiculeService } from 'src/app/services/vehicule.service';
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
    // this.testCheck();
  }

  testCheck() {
    this.dataService.getConsommation("?check=true").subscribe(
      {
        next:(res: any) => {
          console.log(res);
        }
      }
    );
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
          e.age = e.age??0 > 0 ? (now - e.age) : "jamais"
          e.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(e.creationTime??0) * 1000));
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
    console.log(ev);
    this.selectedDevice = new Device();
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()
      var route = this.router
      this.dataService.getDeviceData(url).subscribe({
        next: (d: any) => {
          // console.log(d);
          if (d && d.length) {
            d.forEach(e => {
              e.creationTime = this.tools.formatDateForInput(new Date(Number.parseInt(e.creationTime) * 1000));
              e.fuelEconomy = e.fuelEconomy > 0 ? Math.round(100 / e.fuelEconomy) : 0;
              e.pushpinID = this.tools.getImageId(e.pushpinID);
            });
            this.selectedDevice = d[0];
          }
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

  modifier() {
    var route = this.router
    this.errorMsg = ""
    if (!this.selectedDevice.description) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
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


