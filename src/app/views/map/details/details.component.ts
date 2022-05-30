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

  events: any = []
  trajets: any[] = []
  selection = new L.LayerGroup()
  selectedTrajet: any


  //DATATABLE Attributes
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  dataSource = new MatTableDataSource()
  displayedColumns: any[] = ['start', 'end', 'km', 'consom', 'nbrArr', 'dureeArr'] //dureeCond
  columnNames: any[] = ['Départ', 'Arrivée', 'Distance (Km)', 'Consommation', "Nombre d'arrêts", "Durée d'arrêt"] //Durée de conduite

  pageSizeOptions = [5, 10, 15, 25]

  selectedPageSize = 5
  // maxSize = 5
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
    {
      backgroundColor: 'rgba(0,120,182,0.5)',
      borderColor: 'rgba(0,120,182,1)',
      pointBackgroundColor: 'rgba(0,120,182,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,84,0,0.8)'
    },

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

          this.getTrajets()
          this.paintPolyline()

          this.dataSource = new MatTableDataSource(this.trajets)
          this.totalItems = this.dataSource.data.length
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        )
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

  loadPolylines() {
    this.trajets.forEach(trajet => {
      if (trajet.km > 0) {
        var latlngs = []
        latlngs = trajet.events.map(ev => [ev.latitude, ev.longitude])
        var polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this.map)
      }
    })

  }

  // table events 
  onRowClicked(row: any) {
    if (this.selectedTrajet != row) {
      if (this.map.hasLayer(this.selection)) {
        this.map.removeLayer(this.selection)
      }
      this.paintPolyline(false, row.events.startIndex, row.events.endIndex)
      this.selectedTrajet = row
    } else {
      this.map.removeLayer(this.selection)
      this.selectedTrajet = undefined
    }
  }

  myIcon(status: string) {
    let icon = `/assets/img/markers/${status}.png`

    return L.icon({
      iconUrl: icon,
      iconSize: [30, 30],
      iconAnchor: [15, 30],

    })
  }

  paintPolyline(isAll = true, startEventsIndex?: number, endEvenntsIndex?: number) {
    var latlngs = []
    if (isAll) {
      latlngs = this.events.map(ev => [ev.latitude, ev.longitude])
      var layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })]).addTo(this.map)

      this.events.forEach((ev, i) => {
        let time = new Date(ev.timestamp * 1000)
        if (i == 0) {
          var marker = L.marker([ev.latitude, ev.longitude], {
            icon: this.myIcon('start')
          }).bindPopup(`` +
            `<div>Heure: ${this.formatTime(time)}</div>` +
            `<div>Status: ${ev.statusCode} </div>` +
            `<div>Carburant: ${ev.fuelTotal} </div>`
            , {
              closeButton: false,
              offset: L.point(0, -20)
            })
          layer.addLayer(marker)
        } else if (i == this.events.length - 1) {
          var marker = L.marker([ev.latitude, ev.longitude], {
            icon: this.myIcon('end')
          }).bindPopup(`` +
            `<div>Heure: ${this.formatTime(time)}</div>` +
            `<div>Status: ${ev.statusCode} </div>` +
            `<div>Carburant: ${ev.fuelTotal} </div>`
            , {
              closeButton: false,
              offset: L.point(0, -20)
            })
          layer.addLayer(marker)
        } else {
          if (ev.statusCode == 62465 || ev.statusCode == 62467) {
            var marker = L.marker([ev.latitude, ev.longitude], {
              icon: ev.statusCode == 62465 ? this.myIcon('park') : this.myIcon('stop')
            }).bindPopup(`` +
              `<div>Heure: ${this.formatTime(time)}</div>` +
              `<div>Status: ${ev.statusCode} </div>` +
              `<div>Carburant: ${ev.fuelTotal} </div>`
              , {
                closeButton: false,
                offset: L.point(0, -20)
              })
            layer.addLayer(marker)
          }
        }
      });
    } else {
      var subEvents = this.events.slice(startEventsIndex, endEvenntsIndex + 1)
      latlngs = subEvents.map(ev => [ev.latitude, ev.longitude])
      var layer = L.layerGroup([L.polyline(latlngs, { color: '#6f42c1', opacity: .8, weight: 4 })]).addTo(this.map)

      subEvents.forEach((ev, i) => {
        let time = new Date(ev.timestamp * 1000)
        if (i == 0) {
          var marker = L.marker([ev.latitude, ev.longitude], {
            icon: this.myIcon('start')
          }).bindPopup(`` +
            `<div>Heure: ${this.formatTime(time)}</div>` +
            `<div>Status: ${ev.statusCode} </div>` +
            `<div>Carburant: ${ev.fuelTotal} </div>`
            , {
              closeButton: false,
              offset: L.point(0, -20)
            })
          layer.addLayer(marker)
        } else if (i == subEvents.length - 1) {
          var marker = L.marker([ev.latitude, ev.longitude], {
            icon: this.myIcon('end')
          }).bindPopup(`` +
            `<div>Heure: ${this.formatTime(time)}</div>` +
            `<div>Status: ${ev.statusCode} </div>` +
            `<div>Carburant: ${ev.fuelTotal} </div>`
            , {
              closeButton: false,
              offset: L.point(0, -20)
            })
          layer.addLayer(marker)
        }
      });

      this.selection = layer

    }
    this.map.fitBounds(latlngs)
  }

  resetPolyline() {

  }

  getSubEvents(start, end) {
    return this.events.slice(start, end + 1)
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

  getTrajets() {

    let trajets = []

    let carStat = 0
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
          events2 = this.getSubEvents(startIndex, endIndex + 1)

          var date1 = new Date(null);
          // var date2 = new Date(null);

          date1.setSeconds(this.getStats(events2)['dureeArr']);
          // date2.setSeconds(this.getStats(events2)['dureeCond']);

          var durreArr = date1.toISOString().substr(11, 8);
          // var dureeCond = date2.toISOString().substr(11, 8);

          var km = this.getStats(events2)['Km']

          if (km > 0) {
            trajets.push({
              start: new Date(startTime * 1000),
              end: new Date(endTime * 1000),
              km: km,
              consom: this.getStats(events2)['Consom'],
              nbrArr: this.getStats(events2)['nbrArr'],
              dureeArr: durreArr,
              events: { startIndex: startIndex, endIndex: endIndex }
            })
          }
        }
      } else {
        //
      }
    });

    this.trajets = trajets

    // return trajets
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
    // stats['dureeCond'] = this.getDurreCond(events)

    return stats
  }

  // TODO : Fix this
  getDurreCond(events) {
    var carStat = 0
    var dureeConduite = 0

    console.log(5 - 15);

    events.forEach(ev => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) {
        if (carStat == 0) {
          var timeConduiteInit = ev.timestamp
          carStat = 1
        }
      }

      if (ev.statusCode == 62467 && carStat == 1) {
        var timeConduiteFin = ev.timestamp

        // followed the backend logic but this still not working
        // TODO : Need to verify this 
        dureeConduite += (timeConduiteFin - timeConduiteInit)

        carStat = 0
      }


      console.log('conduite');
      console.log(dureeConduite);
    })



    return dureeConduite
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

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  // 👇️ format as "YYYY-MM-DD hh:mm:ss"
  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
  // 👇️ format as "hh:mm:ss"
  formatTime(date: Date) {
    return (
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
}
