import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component';
import { ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { DataService } from 'src/app/services/data.service';
import * as L from 'leaflet'
import { VehiculeService } from 'src/app/services/vehicule.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit, AfterViewInit {
  sub: any

  tVisible = false
  tVisible1 = false
  loading: boolean = false
  loading1: boolean = false

  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;

  value1: string | Object;
  myDateRangePickerOptions1: MyDateRangePickerOptions;

  startTime = "";
  endTime = "";
  timestamps = "";
  errorMessageDevice = "";
  showErrorDevice = false;

  errorMessageDevice1 = "";
  showErrorDevice1 = false;

  devices: any = [];
  selectedDevices = [];
  selectedDevice = null;
  selectedDevices1 = [];
  selectedDevice1 = null;
  loadingEvents = false
  loadingEvents1 = false
  dates = []
  selectedDate: any
  //Durée de conduite
  events: any = []
  events1: any = []

  urldetails = "";

  map1: any
  map2: any
  car = {
    lat: 35.75,
    lng: -5.83
  }
  @Input() showFullScreenControle?: Boolean = true
  @Input() showPositionControle?: Boolean = true
  MyPositionMarker1: L.Marker
  MyPositionMarker2: L.Marker
  isMyPositionVisible1: Boolean = false
  isMyPositionVisible2: Boolean = false
  fullScreenControl1: L.Control;
  fullScreenControl2: L.Control;
  positionControl: L.Control;
  provider = new OpenStreetMapProvider();
  //DATATABLE Attributes
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  @ViewChild('MatPaginator1') paginator1: MatPaginator
  @ViewChild('MatSort1') sort1: MatSort

  dataSource = new MatTableDataSource()
  displayedColumns: any[] = ['start', 'end', 'km', 'consom', 'nbrArr', 'dureeArr'] //dureeCond
  columnNames: any[] = ['Départ', 'Arrivée', 'Distance (Km)', 'Consommation', "Nombre d'arrêts", "Durée d'arrêt"] //Durée de conduite

  dataSource1 = new MatTableDataSource()
  sumTrajet = { diff: "00h 00s", sumKm: 0, sumConsomation: "0 ", sumNbrArr: "0", sumDureeArr: "00h 00s" }
  sumTrajet1 = { diff: "00h 00s", sumKm: 0, sumConsomation: "0 ", sumNbrArr: "0", sumDureeArr: "00h 00s" }

  selectedPageSize = 5
  selectedPageSize1 = 5
  // maxSize = 5
  totalItems: number
  curremtPage: number = 1
  numPages: number

  totalItems1: number
  curremtPage1: number = 1
  numPages1: number
  //End of DATATABLE Attributes
  constructor(private vehiculeService: VehiculeService, private dataService: DataService, private router: Router, private tools: util, private activatedRoute: ActivatedRoute) {
    // this.activatedRoute.snapshot.paramMap.get('id')
    // this.generateDates()
  }

  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;

  @ViewChild('calendar1', { static: true })
  private myDateRangePicker1: MyDateRangePickerComponent;

  selection = new L.LayerGroup()
  selectedTrajet: any

  selection1 = new L.LayerGroup()
  selectedTrajet1: any

  trajets: any[] = []
  trajets1: any[] = []

  // ################################################################################################
  ngOnInit(): void {
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
    // if (this.vehiculeExist(this.vehiculeID1)) {
    //   this.loadVehiculeEvents()
    // } else {
    //   // console.log('Vehicule Does not exist');
    //   this.router.navigate(['/404'])
    // }
  }


  getSelectedDevices(selected) {
    // console.log(selected);
    this.selectedDevice = selected;
  }
  getSelectedDevices1(selected) {
    // console.log(selected);
    this.selectedDevice1 = selected;
  }
  onValidateDevice() {
    this.showErrorDevice = !this.showErrorDevice;
    this.errorMessageDevice = "This field is required";
  }
  onValidateDevice1() {
    this.showErrorDevice1 = !this.showErrorDevice;
    this.errorMessageDevice1 = "This field is required";
  }
  resetValidator() {
    this.showErrorDevice = false;
    this.errorMessageDevice = "";
  }
  getDev() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        console.log("getDev", res);
        this.devices = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }
  getVehiculeNameById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].name
    }
    return ""
  }
  getVehiculeExtraById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return { "fe": this.devices[i].fe, "fc": this.devices[i].fc, "cp": this.devices[i].cp }
    }
    return { "fe": 0, "fc": 0, "cp": 0 }
  }

  getVehiculeCapacityById(id) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].dID == id) return this.devices[i].cp
    }
  }

  // #############################################################################################

  submit(map) {
    if (this.selectedDevice == null) {
      this.onValidateDevice()
    } else {
      this.loading = true;
      let extra = this.getVehiculeExtraById(this.selectedDevice)
      // this.getdetails()
      console.log(this.selectedDevice)
      var urlParams = "map-events?d=" + this.selectedDevice + "&st=" + this.myDateRangePicker.getDateFrom + "&et=" + this.myDateRangePicker.getDateTo
      console.log(urlParams);
      this.loadingEvents = true
      this.vehiculeService.getVehiculeEvents(urlParams).toPromise()
        .then((res) => {
          this.events = res


          this.getTrajets(1, this.events)

          map.eachLayer((layer) => {
            if (!(layer instanceof L.TileLayer)) {
              map.removeLayer(layer);
            }
          });

          this.paintPolyline(map,1,this.events)

          this.dataSource = new MatTableDataSource(this.trajets)
          this.totalItems = this.dataSource.data.length
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.loadingEvents = false
          this.loading = false
        },
          (err) => {
            if (err.status == 401) {
              this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url } });
            }
          }
        )
    }
  }
  // ########################################################################################################
  submit2(map) {
    if (this.selectedDevice1 == null) {
      this.onValidateDevice1()
    } else {
      this.loading1 = true;
      let extra = this.getVehiculeExtraById(this.selectedDevice1)
      // this.getdetails()
      console.log(this.selectedDevice1)
      var urlParams = "map-events?d=" + this.selectedDevice1 + "&st=" + this.myDateRangePicker1.getDateFrom + "&et=" + this.myDateRangePicker1.getDateTo
      console.log(urlParams);
      this.loadingEvents1 = true
      this.vehiculeService.getVehiculeEvents(urlParams).toPromise()
        .then((res) => {
          this.events1 = res

          this.getTrajets(2,this.events1)

          map.eachLayer((layer) => {
            if (!(layer instanceof L.TileLayer)) {
              map.removeLayer(layer);
            }
          });

          this.paintPolyline(map,2,this.events1)

          this.dataSource1 = new MatTableDataSource(this.trajets1)
          this.totalItems1 = this.dataSource1.data.length
          this.dataSource1.paginator = this.paginator1;
          this.dataSource1.sort = this.sort1;

          this.loadingEvents1 = false
          this.loading1 = false
        },
          (err) => {
            if (err.status == 401) {
              this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url } });
            }
          }
        )
    }
  }
  // ########################################################################################################



  ngAfterViewInit() {
    setTimeout(() => {
      this.map1 = this.createMap("1");
      this.map2 = this.createMap("2");
    }, 100);

  }
  //""""""""""""""""""""""""""""""""""""""""""  Create Map 1  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""" 

  createMap(id) {
    const zoomLevel = 12
    console.log('mapDetail' + id);

    let map = L.map('mapDetail' + id, { attributionControl: false, zoomControl: false, markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true })
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
      "Google Hybrid": googleHybrid,
      "Google Terrain": googleTerrain,
      "Google Satellite": googleSat,
      'Google Street': googleStreets,
      'Dark': dark,
    };
    googleHybrid.addTo(map)


    L.control.zoom().addTo(map)

    let FullScreenControl = L.Control.extend({
      onAdd(map: L.Map) {
        return L.DomUtil.get('mapDetail' + id + 'fullScreenControl');
      },
      onRemove(map: L.Map) { }
    });
    new FullScreenControl({
      position: "topleft"
    }).addTo(map);
    let PositionControl = L.Control.extend({
      onAdd(map: L.Map) {
        return L.DomUtil.get('positionControl' + id);
      },
      onRemove(map: L.Map) { }
    });
    new PositionControl({
      position: "topleft"
    }).addTo(map);

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
    }).addTo(map)

    ////////////////////////////////////////////////////////////
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(map);
    L.control.scale().addTo(map);
    return map
  }

  centerMap() {
    // console.log(this.map.layers)
  }

  toggleMapFullscreen(id) {
    if (!this.tools.isFullScreen) {
      this.tools.openFullscreen(document.getElementById("mapDetail" + id))
    }
    else {
      this.tools.closeFullscreen()
    }
  }

  toggleMyPosition(id, map, isMyPositionVisible, MyPositionMarker) {
    // console.log("toggleMyPosition");
    if (navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition((p) => {
        // console.log(p.coords);
        var positionCtl = document.getElementById("positionControl" + id)
        if (!isMyPositionVisible) {
          console.log("isMyPositionVisible1 ", isMyPositionVisible);
          positionCtl.classList.replace("icon-target", "icon-close")

          if (MyPositionMarker) {
            if (id == 1)
              this.MyPositionMarker1.setLatLng([p.coords.latitude, p.coords.longitude])
            else
              this.MyPositionMarker2.setLatLng([p.coords.latitude, p.coords.longitude])
          } else {
            if (id == 1)
              this.MyPositionMarker1 = new L.Marker([p.coords.latitude, p.coords.longitude])
            else
              this.MyPositionMarker2 = new L.Marker([p.coords.latitude, p.coords.longitude])
          }
          if (id == 1) {
            this.MyPositionMarker1.removeFrom(this.map1)
            this.MyPositionMarker1.addTo(this.map1)
            this.isMyPositionVisible1 = true
            this.map1.fitBounds([[p.coords.latitude, p.coords.longitude]])
          }
          else {
            this.MyPositionMarker2.removeFrom(this.map2)
            this.MyPositionMarker2.addTo(this.map2)
            this.isMyPositionVisible2 = true
            this.map2.fitBounds([[p.coords.latitude, p.coords.longitude]])
          }

        } else {
          console.log("isMyPositionVisible2 ", isMyPositionVisible);
          // this.MyPositionMarker1 = new L.Marker([p.coords.latitude, p.coords.longitude])
          if (id == 1) {
            this.MyPositionMarker1.removeFrom(this.map1)
            this.isMyPositionVisible1 = false
          }

          else {
            this.MyPositionMarker2.removeFrom(map)
            this.isMyPositionVisible2 = false
          }

          this.centerMap()
          positionCtl.classList.replace("icon-close", "icon-target")
        }
      }, null, options)
    }
  }
  // """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
  getTrajets(id, eventsT) {
    let trajets = []
    let isStart = false
    let isFinal = false
    let startIndex = 0
    let endIndex = 0
    let startTime = 0
    let endTime = 0

    let events2 = []
    let sumKm = 0
    let sumDuree = 0
    let sumConsom = 0
    let nbArrets = 0
    let dureeArrets = 0
    eventsT.forEach((ev, index) => {
      if (ev.statusCode == 61714 || ev.statusCode == 62465) { // Moving Or ON
        if (!isStart) { // if it wasn't already moving or ON
          startTime = ev.timestamp //timestamp départ de trajet
          startIndex = index
          isStart = true
        } else if (index == eventsT.length - 1) {
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
        events2 = eventsT.slice(startIndex, endIndex + 1)

        var date1 = new Date(null);
        // var date2 = new Date(null);
        let dureeArrTmp = this.getStats(events2)['dureeArr']
        date1.setSeconds(dureeArrTmp);
        // date2.setSeconds(this.getStats(events2)['dureeCond']);

        var durreArr = date1.toISOString().substr(11, 8);
        // var dureeCond = date2.toISOString().substr(11, 8);

        var km = this.getStats(events2)['Km']

        if (km > 0) { // dureeConduite > 0
          let consom = this.getStats(events2)['Consom']
          let nbrArr = this.getStats(events2)['nbrArr']
          sumKm += km
          sumDuree+=(endTime-startTime)
          sumConsom+=consom
          nbArrets+=nbrArr
          dureeArrets+=dureeArrTmp
          trajets.push({
            start: new Date(startTime * 1000),
            end: new Date(endTime * 1000),
            km: km,
            consom: consom,
            nbrArr: nbrArr,
            dureeArr: durreArr,
            events: { startIndex: startIndex, endIndex: endIndex }
          })
        }

        isStart = false
        isFinal = false
      }
    });
    if(id==1){
      this.sumTrajet = {
        diff: this.tools.formatDuree(sumDuree,"00h 00s"),
        sumKm: sumKm,
        sumNbrArr: nbArrets.toString(),
        sumConsomation: sumConsom.toString(),
        sumDureeArr: this.tools.formatDuree(dureeArrets,"00h 00s"),
      }
      this.trajets = trajets
    }else{
      this.sumTrajet1 = {
        diff: this.tools.formatDuree(sumDuree,"00h 00s"),
        sumKm: sumKm,
        sumNbrArr: nbArrets.toString(),
        sumConsomation: sumConsom.toString(),
        sumDureeArr: this.tools.formatDuree(dureeArrets,"00h 00s"),
      }
      this.trajets1 = trajets
    }
    

    // return trajets
  }
  onRowClicked(id,row: any, map) {
    if(id==1){
      if (this.selectedTrajet != row) {
        if (map.hasLayer(this.selection)) {
          map.removeLayer(this.selection)
        }
        this.paintPolyline(map,id,this.events, false, row.events.startIndex, row.events.endIndex)
        this.selectedTrajet = row
      } else {
        map.removeLayer(this.selection)
        this.selectedTrajet = undefined
      }
    }else{
      if (this.selectedTrajet1 != row) {
        if (map.hasLayer(this.selection1)) {
          map.removeLayer(this.selection1)
        }
        this.paintPolyline(map,id,this.events1, false, row.events.startIndex, row.events.endIndex)
        this.selectedTrajet1 = row
      } else {
        map.removeLayer(this.selection1)
        this.selectedTrajet1 = undefined
      }
    }
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

  paintPolyline(map,id,events, isAll = true, startEventsIndex?: number, endEvenntsIndex?: number) {
    var latlngs = []
    if (isAll) {
      if (events && events.length > 0) {
        latlngs = events.map(ev => [ev.latitude, ev.longitude])
        var layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })])

        events.forEach((ev, i) => {
          let time = new Date(ev.timestamp * 1000)
          if (i != 0 && i != (events - 1)) {
            if (ev.statusCode == 62465 || ev.statusCode == 62467) {
              var marker = L.marker([ev.latitude, ev.longitude], {
                icon: ev.statusCode == 62465 ? this.tools.myTrajetIcon('stop') : this.tools.myTrajetIcon('park')
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
        L.marker([events[0].latitude, events[0].longitude], {
          icon: this.tools.myTrajetIcon('start')
        }).bindPopup(`` +
          `<div>Heure: ${this.formatTime(new Date(events[0].timestamp * 1000))}</div>` +
          `<div>Status: ${events[0].statusCode} </div>` +
          `<div>Carburant: ${events[0].fuelTotal} </div>`
          , {
            closeButton: false,
            offset: L.point(0, -20)
          }).addTo(layer)

        L.marker([events[events.length - 1].latitude, events[events.length - 1].longitude], {
          icon: this.tools.myTrajetIcon('end')
        }).bindPopup(`` +
          `<div>Heure: ${this.formatTime(new Date(events[events.length - 1].timestamp * 1000))}</div>` +
          `<div>Status: ${events[events.length - 1].statusCode} </div>` +
          `<div>Carburant: ${events[events.length - 1].fuelTotal} </div>`
          , {
            closeButton: false,
            offset: L.point(0, -20)
          }).addTo(layer)

        layer.addTo(map)
      }

    } else {
      var subEvents = events.slice(startEventsIndex, endEvenntsIndex + 1)
      latlngs = subEvents.map(ev => [ev.latitude, ev.longitude])
      var layer = L.layerGroup([L.polyline(latlngs, { color: 'red', opacity: .8, weight: 4 })]).addTo(map)
      subEvents.forEach((ev, i) => {
        let time = new Date(ev.timestamp * 1000)
        if (i == 0) {
          var marker = L.marker([ev.latitude, ev.longitude], {
            icon: this.tools.myTrajetIcon('start')
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
            icon: this.tools.myTrajetIcon('end')
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

      if (id == 1)
        this.selection = layer
      else {
        this.selection1 = layer
      }

    }

    if (latlngs.length > 0) {
      map.fitBounds(latlngs)
    }
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
  getKilometrage(events) {
    if (events.length > 0) {
      let km = events[events.length - 1].odometerKM - events[0].odometerKM
      return km

    } else {
      return 0
    }
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
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
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
