import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Device } from '../../models/device';
import { VehiculeService } from 'src/app/services/vehicule.service';

@Component({
  templateUrl: 'crudvehicule.component.html',
  styleUrls: ["./style.scss"],
  providers: [DatePipe]
})
export class CrudvehiculeComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  selectedDevice: Device = new Device();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private vehiculeService: VehiculeService, private datePipe: DatePipe) { }

  data = [];

  ngOnInit() {
    this.loadData();
  }

  //////////////////////
  loadData() {
    this.loading = true;
    this.dataService.getDeviceData("").subscribe({
      next: (d: any) => {
        let now = Math.round(new Date().getTime() / 1000)
        d.forEach(e => {
          e.age = e.age > 0 ? (now - e.age) : "jamais"
        });
        this.data = d;
        this.loading = false;
      }, error(err) {
        this.loading = false;
      },
    })
  };

  loadModify(ev) {
    console.log(ev);
    this.selectedDevice = new Device();
    if (ev) {
      var url = "?d=" + ev
      this.modalLoading = true;
      this.primaryModal.show()
      this.dataService.getDeviceData(url).subscribe({
        next: (d: any) => {
          if (d && d.length) {
            d.forEach(e => {
              e.creationTime = this.formatDate(new Date(Number.parseInt(e.creationTime) * 1000));
            });
            this.selectedDevice = d[0];
          }
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
        },
    })
    }
  }

  modifier() { }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'MMM dd, HH:mm:ss');
  }
}


