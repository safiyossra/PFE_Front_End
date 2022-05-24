import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import * as L from 'leaflet'
import { VehiculeService } from 'src/app/services/vehicule.service';

import { Vehicule } from '../../../models/vehicule'


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit {

  vehiculeID: string
  map: any
  car = {
    lat: 35.75,
    lng: -5.83
  }

  events: any
  // trajets: any[]


  //DATATABLE Attributes
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  dataSource = new MatTableDataSource()
  displayedColumns: any[] = ['date', 'depart', 'arrivee']
  columnNames: any[] = ['date', 'depart', 'arrivee']

  pageSizeOptions = [5, 10, 15, 25]

  selectedPageSize = 5
  maxSize = 5
  totalItems: number
  curremtPage: number = 1
  numPages: number
  //End of DATATABLE Attributes



  // charts attributes
  public lineChartData1: Array<any> = [
    { data: [], label: 'Vitesse' }
  ]
  public lineChartData2: Array<any> = [
    { data: [], label: 'Carburant' }
  ]
  public lineChartLabels: Array<any> = []
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    scales: {
      xAxes: [{
        // scaleLabel: {
        //   display: true,
        //   labelString: 'Time ( UTC )'
        // },
        type: 'time',
        // time: {
        //   tooltipFormat: "hh:mm",
        //   displayFormats: {
        //     hour: 'MMM D, hh:mm:ss'
        //   }
        // },
        ticks: {
          maxRotation: 0,
          minRotation: 0
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Temperature ( Celcius )'
        },
        // min: 0
      }]
    }
  };
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.4)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(private activatedRoute: ActivatedRoute, private vehiculeService: VehiculeService, private router: Router) {
    this.vehiculeID = this.activatedRoute.snapshot.paramMap.get('id')
  }

  async vehiculeExist(id: any): Promise<boolean> {
    let vehicules = []
    let exist = false
    let promise = this.vehiculeService.getData().toPromise()

    await promise.then((res) => {
      vehicules = res['DeviceList']
      vehicules.forEach(element => {
        if (element.Device == id) {
          exist = true
        }
      })

    })

    return exist
  }

  async ngOnInit(): Promise<any> {
    if (await this.vehiculeExist(this.vehiculeID)) {
      await this.vehiculeService.getVehiculeEvents(this.vehiculeID).toPromise()
        .then((res) => {
          this.events = res

          this.lineChartData1[0].data = (this.events.map((event) => {
            return { x: new Date(event.timestamp * 1000), y: event.speedKPH }
          }))

          this.lineChartData2[0].data = (this.events.map((event) => event.fuelTotal))

          this.lineChartLabels = this.events.map((event: { timestamp: any; }) => new Date(event.timestamp * 1000))

          console.log(this.trajets);

        },
        )


      // console.log(this.events.map((event: { speedKPH: any; }) => event.speedKPH));
      // console.log("Fuel : " + this.events.map((event: { fuelTotal: any; }) => event.fuelTotal));


    } else {
      console.log('Vehicule Does not exist');
      this.router.navigate(['/404'])
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createMap()
    }, 100);

  }

  createMap() {
    const testCoord = {
      lat: 33.589886,
      lng: -7.603869
    }

    const zoomLevel = 12
    this.map = L.map('mapDetail', { attributionControl: false, inertia: true })
      .setView([this.car.lat, this.car.lng], zoomLevel)

    // https://leaflet-extras.github.io/leaflet-providers/preview/
    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    mainLayer.addTo(this.map)

  }

  // table events 
  onRowClicked(row: any) {
    console.log(row);
  }

  // -------------------------------------------------// 
  //chart events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  // -------------------------------------------------// 

  // ----------------------- Getting info for the table --------------------------// 

  get trajets() {

    let trajets = []

    let carStat = 0
    let i = 0
    let startIndex = 0
    let endIndex = 0
    let startTime = 0
    let endTime = 0

    let events2 = []

    this.events.forEach((ev, index) => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) {
        if (carStat == 0) {
          startTime = ev.timestamp
          startIndex = index
          carStat = 1
        }
      } else if (ev.statusCode == 62467) {
        if (carStat == 1) {
          endIndex = index
          endTime = ev.timestamp
          carStat = 0
          events2 = this.events.slice(startIndex, endIndex + 1)
          // let day = new Date(startTime * 1000)
          // console.log(events2);
          trajets.push({
            start: new Date(startTime * 1000),
            end: new Date(endTime * 1000),
            data: this.getStats(events2)
          })
        }
      } else {
        console.log('other status : ' + ev.statusCode);
      }
    });

    return trajets
  }

  getStats(events) {
    let trajetGroup = []
    let stats = []
    let speed = []
    let nbrArrets = 0

    stats['Km'] = Math.round(this.getKilometrage(events) * 100) / 100
    stats['Consom'] = Math.round(this.getConsommation(events) * 100) / 100
    stats['nbrArr'] = this.getNbrArrets(events)
    stats['dureeArr'] = this.getDurreArret(events)

    return stats
  }

  getDurreArret(events) {
    let dureeArret = 0;
    let Motorstat = 0;
    let timeArretInit
    let timeArretFin
    events.forEach(ev => {
      if (ev.statusCode == 62465) {
        if (Motorstat == 0) {
          Motorstat = 1;
          timeArretInit = ev.timestamp;
        }
        timeArretFin = ev.timestamp;
      }
      if (ev.statusCode == 61714 || ev.statusCode == 62467) {
        if (Motorstat == 1) {
          Motorstat = 0;
          dureeArret += timeArretFin - timeArretInit;
        }
      }
    })

    return dureeArret;
  }

  getNbrArrets(events) {
    let motorStat = 0
    let nbrArrets = 0

    events.forEach(ev => {
      if (ev.statusCode == 61714 || ev.statusCode == 62467) {
        motorStat = 0
      }
      if (ev.statusCode == 62465 && motorStat == 0) {
        nbrArrets += 1
        motorStat = 1
      }
    });

    return nbrArrets
  }

  getConsommation(events) {
    if (events.length > 0) {
      let fuelInit = events[0].fuelTotal
      let fuelFinal
      events.forEach(ev => {
        if ((fuelInit == 0) && (ev.fuelTotal > 0)) {
          fuelInit = ev.fuelTotal
        }
      });

      fuelFinal = events[events.length - 1].fuelTotal
      let consomation = fuelFinal - fuelInit
      if (consomation < 0) {
        consomation = consomation * (-1)
      }

      return consomation
    } else {
      return 0
    }
  }

  getKilometrage(events) {

    if (events.length > 0) {
      let km = events[events.length - 1].odometerKM - events[0].odometerKM
      return km
    } else {
      return 0
    }
  }

  getOdomKM(events) {
    let carStat = 0
    let odomKM
    events.forEach(ev => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) {
        if (carStat == 0) {
          carStat = 1
        }
      } else if (ev.statusCode == 62467) {
        if (carStat == 1) {
          odomKM = ev.odometreKM
          carStat = 0
        }
      }
    })
    return odomKM
  }

  getAddressInit(events) {
    let carStat = 0
    let addressInit
    events.forEach(ev => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) {
        if (carStat == 0) {
          carStat = 1
        }
      } else if (ev.statusCode == 62467) {
        if (carStat == 1) {
          addressInit = ev.address
          carStat = 0
        }
      }
    })

    return addressInit
  }

  getAddressFin(events) {
    let carStat = 0
    let addressFin
    events.forEach(ev => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) {
        if (carStat == 0) {
          carStat = 1
        }
      } else if (ev.statusCode == 62467) {
        if (carStat == 1) {
          addressFin = ev.address
          carStat = 0
        }
      }
    })

    return addressFin
  }


  // -----------------------------------------------------------------------------// 
}
