import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { VehiculeService } from 'src/app/services/vehicule.service';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit {

  provider = new OpenStreetMapProvider();
  vehiculeID: string
  vName: string =""
  map: any
  car = {
    lat: 35.75,
    lng: -5.83
  }

  events: any = []
  trajets: any[] = []
  selection = new L.LayerGroup()
  selectedTrajet: any


  @Input() showFullScreenControle?: Boolean = true
  @Input() showPositionControle?: Boolean = true
  MyPositionMarker: L.Marker
  isMyPositionVisible: Boolean = false
  fullScreenControl: L.Control;
  positionControl: L.Control;

  dates = []
  selectedDate: any

  showAllPoints: Boolean = false
  //DATATABLE Attributes
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  dataSource = new MatTableDataSource()
  displayedColumns: any[] = ['start', 'end', 'km', 'consom', 'nbrArr', 'dureeArr'] //dureeCond
  columnNames: any[] = ['Départ', 'Arrivée', 'Distance (Km)', 'Consommation', "Nombre d'arrêts", "Durée d'arrêt"] //Durée de conduite

  pageSizeOptions = []

  selectedPageSize = 5
  // maxSize = 5
  totalItems: number
  curremtPage: number = 1
  numPages: number
  //End of DATATABLE Attributes


////////////////////////

///////////////////////


  // charts attributes
  public lineChartData1: Array<any> = [
    { data: [], label: 'Vitesse(km/h)' }
  ]
  public lineChartData2: Array<any> = [
    { data: [], label: 'Carburant(%)' }
  ]
  public lineChartLabels: Array<any> = []
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        ticks: {
          // maxRotation: 0,
          // minRotation: 0,
          // callback: function (value: any) {
          //   return value.substring(7);
          // },
          maxTicksLimit: 24,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          // maxTicksLimit: 5,
          // stepSize: Math.ceil(250 / 5),
          // max: 250
        },

      }],
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: true
    }
  };
  public lineChartColours1: Array<any> = [
    {
      backgroundColor: 'rgba(32,168,216,0.5)',
      borderColor: 'rgba(32,168,216,1)',
      // pointBackgroundColor: 'rgba(32,168,216,1)',
      // pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,84,0,0.8)'
    },
  ];

  public lineChartColours2: Array<any> = [
    {
      backgroundColor: 'rgba(32,168,216,0.5)',
      borderColor: 'rgba(32,168,216,1)',
      // pointBackgroundColor: 'rgba(32,168,216,1)',
      // pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,84,0,0.8)'
    },

  ];

  public lineChartLegend = true;
  public lineChartType = 'line';


  loadingEvents = false

  constructor(private activatedRoute: ActivatedRoute, private vehiculeService: VehiculeService, public router: Router, private tools: util) {
    this.vehiculeID = this.activatedRoute.snapshot.paramMap.get('id')
    this.generateDates()
  }

  async vehiculeExist(id: any): Promise<boolean> {
    let vehicules = []
    let exist = false
    let promise = this.vehiculeService.getData().toPromise()

    await promise.then((res) => {
      vehicules = res['DeviceList']
      // console.log("vehicules",vehicules);
      vehicules.forEach(element => {
        if (element.Device == id) {
          this.vName=element.Device_desc;
          exist = true
        }
      })
    }, (err) => {
      if (err.status == 401) {
        this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url } });
      }
    })

    return exist
  }

  async ngOnInit(): Promise<any> {
    if (await this.vehiculeExist(this.vehiculeID)) {
      this.loadVehiculeEvents()
    } else {
      // console.log('Vehicule Does not exist');
      this.router.navigate(['/404'])
    }
  }

  async loadVehiculeEvents() {
    this.loadingEvents = true
    await this.vehiculeService.getVehiculeEvents("map-events?d=" + this.vehiculeID + "&st=" + Math.round(this.selectedDate.getTime() / 1000)).toPromise()
      .then((res) => {
        this.events = res
        this.lineChartData1[0].data = (this.events.map((event) => {
          return { x: new Date(event.timestamp * 1000), y: event.speedKPH }
        }))

        this.lineChartData2[0].data = (this.events.map((event) => event.fuelLevel))

        this.lineChartLabels = this.events.map((event: { timestamp: any; }) => new Date(event.timestamp * 1000))

        this.getTrajets()

        this.map.eachLayer((layer) => {
          if (!(layer instanceof L.TileLayer)) {
            this.map.removeLayer(layer);
          }
        });

        this.paintPolyline()

        this.dataSource = new MatTableDataSource(this.trajets)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.loadingEvents = false
        // console.log(this.lineChartData1 );
        // console.log(this.lineChartLabels );
      },
        (err) => {
          if (err.status == 401) {
            this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url } });
          }
        }
      )
  }

  dateChange(event: any) {
    // console.log('date changed');
    // console.log(this.selectedDate);
    // console.log(Math.floor(this.selectedDate.getTime() / 1000));

    this.loadVehiculeEvents()
  }

  generateDates() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    endDate.setMonth(endDate.getMonth() - 1)


    const date = new Date(startDate.getTime());


    const dates = [];

    while (date > endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() - 1);
    }

    this.dates = dates
    this.selectedDate = this.dates[0]
    // return dates;

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createMap()
    }, 100);

  }

  createMap() {
    const zoomLevel = 12
    this.map = L.map('mapDetail', { attributionControl: false, zoomControl: false, markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true })
      .setView([this.car.lat, this.car.lng], zoomLevel)

    // dark map 
    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    });
    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}&apistyle=s.t%3A17|s.e%3Alg|p.v%3Aoff', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // google street 
    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&apistyle=s.t%3A17|s.e%3Alg|p.v%3Aoff', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    //google satellite
    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&apistyle=s.t%3A17|s.e%3Alg|p.v%3Aoff', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&apistyle=s.t%3A17|s.e%3Alg|p.v%3Aoff', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const baseMaps = {
      'Google Street': googleStreets,
      "Google Hybrid": googleHybrid,
      "Google Terrain": googleTerrain,
      "Google Satellite": googleSat,
      'Dark': dark,
    };
    switch (this.tools.getMapType()) {
      case 'Google Hybrid':
        googleHybrid.addTo(this.map)
        break;
      case 'Google Terrain':
        googleTerrain.addTo(this.map)
        break;
      case 'Google Satellite':
        googleSat.addTo(this.map)
        break;
      case 'Dark':
        dark.addTo(this.map)
        break;

      default:
        googleStreets.addTo(this.map)
        break;
    }

    L.control.zoom().addTo(this.map)

    if (this.showFullScreenControle) {
      let FullScreenControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('mapDetailfullScreenControl');
        },
        onRemove(map: L.Map) { }
      });
      this.fullScreenControl = new FullScreenControl({
        position: "topleft"
      }).addTo(this.map);
    }
    if (this.showPositionControle) {
      let PositionControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('positionControl');
        },
        onRemove(map: L.Map) { }
      });
      this.positionControl = new PositionControl({
        position: "topleft"
      }).addTo(this.map);
    }


    ////////////////////////////////////////////////////////////
    GeoSearchControl({
      provider: this.provider,
      showMarker: false,
      // style: 'bar',
      position: "topleft",
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: true, // optional: true|false  - default false
      searchLabel: 'Entrez une adresse', // optional: string      - default 'Enter address'
      // keepResult: false, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    }).addTo(this.map)
    this.map.on('baselayerchange', (e) => {
      this.tools.setMapType(e.name)
    })
    ////////////////////////////////////////////////////////////
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);
    L.control.scale().addTo(this.map);
  }

  centerMap() {
    // console.log(this.map.layers)
  }

  toggleMapFullscreen() {
    if (!this.tools.isFullScreen) {
      this.tools.openFullscreen(document.getElementById("mapDetail"))
    }
    else {
      this.tools.closeFullscreen()
    }
  }

  toggleMyPosition() {
    // console.log("toggleMyPosition");
    if (navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition((p) => {
        // console.log(p.coords);
        var positionCtl = document.getElementById("positionControl")
        if (!this.isMyPositionVisible) {
          positionCtl.classList.replace("icon-target", "icon-close")
          if (this.MyPositionMarker) {
            this.MyPositionMarker.setLatLng([p.coords.latitude, p.coords.longitude])
          } else {
            this.MyPositionMarker = new L.Marker([p.coords.latitude, p.coords.longitude])
          }
          this.MyPositionMarker.removeFrom(this.map)
          this.MyPositionMarker.addTo(this.map)
          this.isMyPositionVisible = true
          this.map.fitBounds([[p.coords.latitude, p.coords.longitude]])
        } else {
          this.MyPositionMarker.removeFrom(this.map)
          this.isMyPositionVisible = false
          this.centerMap()
          positionCtl.classList.replace("icon-close", "icon-target")
        }
      }, null, options)
    }
  }

  // table events 
  onRowClicked(row: any) {
    if (this.selection) {
      this.map.removeLayer(this.selection)
    }
    if (this.selectedTrajet != row) {
      this.paintPolyline(false, row.events.startIndex, row.events.endIndex)
      this.selectedTrajet = row
    } else {
      this.selectedTrajet = undefined
    }
  }

  paintPolyline(isAll = true, startEventsIndex?: number, endEvenntsIndex?: number) {
    var latlngs = []
    if (isAll) {
      if (this.events && this.events.length > 0) {
        latlngs = this.events.map(ev => [ev.latitude, ev.longitude])
        var layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })])
        this.events.forEach((ev, i) => {
          // let time = new Date(ev.timestamp * 1000)
          if (i != 0 && i != (this.events - 1)) {
            if (ev.statusCode == 62465 || ev.statusCode == 62467) {
              this.createMarker(ev, ev.statusCode == 62465 ? this.tools.myTrajetIcon('stop') : this.tools.myTrajetIcon('park')).addTo(layer)
            } else if (this.showAllPoints) {
              this.createMarker(ev, ev.speedKPH <= 8 ? this.tools.myTrajetIcon('semi-stop') : ev.speedKPH <= 30 ? this.tools.myTrajetIcon('semi-moving') : this.tools.myTrajetIcon('moving')).addTo(layer)
            }
          }
        });
        this.createMarker(this.events[0], this.tools.myDetailsIcon('start')).addTo(layer)
        this.createMarker(this.events[this.events.length - 1], this.tools.myDetailsIcon('end')).addTo(layer)
        layer.addTo(this.map)
      }

    } else {
      var subEvents = this.events.slice(startEventsIndex, endEvenntsIndex + 1)
      latlngs = subEvents.map(ev => [ev.latitude, ev.longitude])
      var layer = L.layerGroup([L.polyline(latlngs, { color: 'red', opacity: .8, weight: 4 })]).addTo(this.map)
      subEvents.forEach((ev, i) => {
        // let time = new Date(ev.timestamp * 1000)
        if (i == 0) {
          // var marker = L.marker([ev.latitude, ev.longitude], {
          //   icon: this.tools.myTrajetIcon('start')
          // }).bindPopup(`` +
          //   `<div>Heure: ${this.formatTime(time)}</div>` +
          //   `<div>Status: ${ev.statusCode} </div>` +
          //   `<div>Carburant: ${ev.fuelTotal} </div>`
          //   , {
          //     closeButton: false,
          //     offset: L.point(0, -20)
          //   })
          // layer.addLayer(marker)
          this.createMarker(ev, this.tools.myDetailsIcon('start')).addTo(layer)
        } else if (i == subEvents.length - 1) {
          // var marker = L.marker([ev.latitude, ev.longitude], {
          //   icon: this.tools.myTrajetIcon('end')
          // }).bindPopup(`` +
          //   `<div>Heure: ${this.formatTime(time)}</div>` +
          //   `<div>Status: ${ev.statusCode} </div>` +
          //   `<div>Carburant: ${ev.fuelTotal} </div>`
          //   , {
          //     closeButton: false,
          //     offset: L.point(0, -20)
          //   })
          // layer.addLayer(marker)
          this.createMarker(ev, this.tools.myDetailsIcon('end')).addTo(layer)
        }
      });

      this.selection = layer

    }

    if (latlngs.length > 0) {
      this.map.fitBounds(latlngs)
    }
  }

  resetPolyline() {

  }

  getSubEvents(start, end) {
    return this.events.slice(start, end)
  }

  // -------------------------------------------------// 
  //chart events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }
  // -------------------------------------------------// 

  // ----------------------- Getting info for the table --------------------------// 
  createMarker(ev: any, icon: any) {
    var v = { name: "", timestamp: ev.timestamp, statusCode: ev.statusCode, fuelLevel: ev.fuelLevel, address: ev.address, odometer: ev.odometerKM, speed: ev.speedKPH, lat: ev.latitude, lng: ev.longitude }
    var marker = L.marker([ev.latitude, ev.longitude], {
      icon: icon
    }).bindPopup(this.tools.formatPopUpContent(v), {
      closeButton: false,
      offset: L.point(0, -20)
    })
    return marker;

  }

  getTrajets() {
    let trajets = []

    let carStat = 0
    let isStart = false
    let isFinal = false
    let startIndex = 0
    let endIndex = 0
    let startTime = 0
    let endTime = 0

    let events2 = []

    this.events.forEach((ev, index) => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) { // Moving Or ON
        if (!isStart) { // if it wasn't already moving or ON
          startTime = ev.timestamp //timestamp départ de trajet
          startIndex = index
          isStart = true
        } else if (index == this.events.length - 1) {
          endIndex = index
          endTime = ev.timestamp
          isFinal = true
        }
      } else if (ev.statusCode == 62467 || ev.statusCode == 61472) {  //OFF
        if (isStart && !isFinal) {
          endIndex = index
          endTime = ev.timestamp //timestamp fin de trajet
          isFinal = true
        }
      }

      if (isStart && isFinal) {
        events2 = this.events.slice(startIndex, endIndex + 1)

        var date1 = new Date(null);
        // var date2 = new Date(null);

        date1.setSeconds(this.getStats(events2)['dureeArr']);
        // date2.setSeconds(this.getStats(events2)['dureeCond']);

        var durreArr = date1.toISOString().substr(11, 8);
        // var dureeCond = date2.toISOString().substr(11, 8);

        var km = this.getStats(events2)['Km']

        if (km > 0) { // dureeConduite > 0
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

        isStart = false
        isFinal = false
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

  showAllPointscheckbox() {
    if (this.events && this.events.length > 1) {
      this.map.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
          this.map.removeLayer(layer);
        }
      });
      this.selection = undefined
      this.paintPolyline()
    }
  }

  //////////////////////
}
