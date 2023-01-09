import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { VehiculeService } from 'src/app/services/vehicule.service'
import { util } from '../../tools/utils'
import * as L from 'leaflet'
import { Vehicule } from '../../models/vehicule'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Router } from '@angular/router'
import { Constant } from 'src/app/tools/constants'
import { ZoneService } from 'src/app/services/zone.service'
import { Zone, ZoneType } from './../../models/zone'
import { DataService } from 'src/app/services/data.service'
import "leaflet.markercluster";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ModalComponent } from './resizable-draggable/modal/modal.component';
// import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})


export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() showFullScreenControle?: boolean = true
  @Input() showPositionControle?: boolean = true
  @Input() showCollapsControle?: boolean = true
  @Input() showClusterControle?: boolean = true
  periodOptions = [{ name: '1min', val: 1 }, { name: '5min', val: 5 }, { name: '15min', val: 15 }, { name: '30min', val: 30 }, { name: '1 Heur', val: 60 }, { name: '1H30min', val: 90 }, { name: '3 Heurs', val: 180 }, { name: '1 Jour', val: 1440 }, { name: '3 Jour', val: 4320 }];
  isShareTrajet = false
  generatedShareLink = ""
  errorMsg = ""
  period = 1
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('modalRoot') public modalRoot: ModalComponent;
  provider = new OpenStreetMapProvider();
  isFirstTime = true
  public position_left: string = "0%"
  public size = [25, 75]
  public size2 = [60, 40]
  isMyPositionVisible: boolean = false
  isClustering: string = "1"
  MyPositionMarker: L.Marker
  map: any//L.Map
  mapModal: any//L.Map
  car = {
    lat: 35.75,
    lng: -5.83
  }
  maxZoom = 20
  marker: any
  markers: L.Marker[] = []
  markersLayerGroup: any
  cluster: L.MarkerClusterGroup;
  vehicules: Vehicule[] = []
  typesCount = [0, 0, 0, 0]
  drivers: any = [];
  inter: any
  vehicle2shareIndex = -1
  modalLoading = false;
  selectedVehiculeIndex = -1
  constructor(private dataService: DataService, private vehiculeService: VehiculeService, private tools: util, public cts: Constant, private zoneService: ZoneService, private router: Router) {

  }

  public segmentedData = [];
  loadingEvents = false
  events: any = []
  selectedVehiculeID: string = ""
  selectedVName: string = ""
  showAllPoints = false
  allTrajet = false
  selectedDate: any
  selectedDateString: any
  selectedEvent = undefined
  layer: any
  public resume = { dureeOFF: "0h:0min", dureeON: "0h:0min", dureeMoving: "0h:0min", maxVitesse: 0, odometer: 0, kmParcoure: 0, fuelLevel: 0, consomation: 0, consomationMoyenne: "0" }
  dates = []
  splitDisabled = true
  maxSize = 40

  ngOnInit(): void {
    this.isClustering = localStorage.getItem("isClustering") ?? "1";
    this.getDrivers();
    this.loadData();
    this.resetSelectedDate()
  }

  loadVehiculeEvents() {
    this.loadingEvents = true
    var route = this.router
    // console.log(this.selectedVehiculeID)
    if (this.selectedVehiculeID != "") {//&unskip
      this.vehiculeService.getVehiculeEvents("map-events?d=" + this.selectedVehiculeID + "&st=" + Math.round(this.selectedDate.getTime() / 1000)).subscribe({
        next: (res) => {
          this.events = res
          // console.log(res);
          if (this.events.length > 1) {
            this.extractTrajets()
            this.extractResume()
            this.splitDisabled = false
          } else {
            this.resetWhenNoEvent()
          }
          // console.log(this.segmentedData);
          this.loadingEvents = false
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })
    }
  }

  extractResume() {
    var resumeTmp = { dureeOFF: 0, dureeON: 0, dureeMoving: 0, odometer: 0, kmParcoure: 0, fuelLevel: 0, consomation: 0, consomationMoyenne: "0" }
    resumeTmp.kmParcoure = this.round2d(this.events[this.events.length - 1].odometerKM - this.events[0].odometerKM)
    resumeTmp.consomation = this.round2d(this.events[this.events.length - 1].fuelTotal - this.events[0].fuelTotal)
    resumeTmp.consomationMoyenne = (100 * (resumeTmp.consomation / (resumeTmp.kmParcoure != 0 ? resumeTmp.kmParcoure : 1))).toFixed(2);
    var length = this.segmentedData.length
    var i = 0
    this.segmentedData.forEach(tr => {
      const start = this.events[tr.start].timestamp
      const end = this.events[tr.end].timestamp
      var duree = '<div class="px-auto col-md-12 py-1"><i class="nav-icon icon-speedometer h6 text-primary">&nbsp;' + this.tools.formatAge2(end - start) + '</i></div>'
      var address = ""
      var fuel = ""
      var odometre = ""
      var speed = ""
      var parkoure = ""
      var conducteur = ""
      if (tr.status < 3) {
        address = '<div class="px-auto col-md-12 py-1"><i class="nav-icon cil-location-pin h6 text-primary">&nbsp;' + this.events[tr.start].address + '</i></div>'
        fuel = '<div class="px-auto col-md-12 py-1"><i class="fa fa-battery-quarter h6 text-primary">&nbsp;' + this.events[tr.start].fuelLevel + ' L</i></div>'
        odometre = '<div class="px-auto col-md-12 py-1"><i class="nav-icon cil-football h6 text-primary">&nbsp;' + this.events[tr.start].odometerKM + ' KM</i></div>'
      } else {
        speed = '<div class="px-auto col-md-12 py-1"><i class="fa fa-tachometer h6 text-blue">&nbsp;' + this.getMaxSpeed(tr.start, tr.end) + ' KM/h</i></div>'
        parkoure = '<div class="px-auto col-md-12 py-1"><i class="nav-icon icon-graph h6 text-blue">&nbsp;' + this.round2d(this.events[tr.end].odometerKM - this.events[tr.start].odometerKM) + ' KM</i></div>'
        conducteur = '<div class="px-auto col-md-12 py-1"><i class="fa fa-user h6 text-green">&nbsp;' + (this.tools.getDriverName(this.drivers, this.events[tr.start].driverID) ?? "inconnue") + '</i></div>'
      }
      tr.tooltip = '<div class="row" ><div class="col-md-6 p-1"><div class="px-auto col-md-12 py-1"><i class="nav-icon icon-speedometer h6 text-success">&nbsp;' + new Date(start * 1000).toLocaleTimeString() + '</i></div>' + odometre + speed + conducteur + '</div><div class="col-md-6 p-1"><div class="px-auto col-md-12 py-1"><i class="nav-icon icon-speedometer h6 text-danger">&nbsp;' + new Date(end * 1000).toLocaleTimeString() + '</i></div>' + duree + parkoure + fuel + '</div>' + address + '</div>'
      switch (tr.status) {
        case 3:
          resumeTmp.dureeMoving += end - start
          tr.class = "motor-driving"
          break;
        case 2:
          resumeTmp.dureeON += end - start
          tr.class = "travel-stop"
          break;
        default:
          resumeTmp.dureeOFF += end - start
          tr.class = "motor-off"
          break;
      }
      var interval = i == length - 1 ? end - start : (this.events[this.segmentedData[i + 1].start].timestamp - start)
      tr.ratio = (100 * interval) / 86400 + "%";
      i++
    });
    this.resume = { dureeOFF: this.tools.formatAge2(resumeTmp.dureeOFF), dureeON: this.tools.formatAge2(resumeTmp.dureeON), dureeMoving: this.tools.formatAge2(resumeTmp.dureeMoving), maxVitesse: this.resume.maxVitesse, kmParcoure: resumeTmp.kmParcoure, odometer: this.events[this.events.length - 1].odometerKM, fuelLevel: this.events[this.events.length - 1].fuelLevel, consomation: resumeTmp.consomation, consomationMoyenne: resumeTmp.consomationMoyenne }
  }

  extractTrajets() {
    var selectedDay = this.selectedDate.getTime()
    var data = [{ status: 0, start: 0, end: 0 }]
    var carstatMoving = false;
    var carstatON = false;
    var carstatOFF = false;
    var eventIndex = 0
    var maxVitesse = 0
    var i = 0
    this.events.forEach(event => {
      if (event.speedKPH > maxVitesse) maxVitesse = event.speedKPH
      if (this.cts.movingStatusCodes.includes(event.statusCode)) {   //Moving

        if (carstatON || carstatOFF) {
          eventIndex++
          data[eventIndex] = { status: 3, start: i, end: i }
          if (carstatON) carstatON = false;
          if (carstatOFF) carstatOFF = false;
        }
        data[eventIndex].end = i
        if (!carstatMoving) {
          data[eventIndex].status = 3 //Moving
          data[eventIndex].start = i
          carstatMoving = true;
        }
      } else if (this.cts.onStatusCodes.includes(event.statusCode)) {  //ON
        if (carstatMoving || carstatOFF) {
          eventIndex++
          data[eventIndex] = { status: 2, start: i, end: i }
          if (carstatMoving) carstatMoving = false;
          if (carstatOFF) carstatOFF = false;
        }
        data[eventIndex].end = i
        if (!carstatON) {
          data[eventIndex].status = 2 //ON
          data[eventIndex].start = i
          carstatON = true;
        }
      } else {  //OFF
        if (carstatMoving || carstatON) {
          eventIndex++
          data[eventIndex] = { status: 1, start: i, end: i }
          if (carstatMoving) carstatMoving = false;
          if (carstatON) carstatON = false;
        }
        data[eventIndex].end = i
        if (!carstatOFF) {
          data[eventIndex].status = 1 //OFF
          data[eventIndex].start = i
          carstatOFF = true;
        }
      }
      i++
    });
    this.resume.maxVitesse = maxVitesse

    this.segmentedData = data;
  }

  getMaxSpeed(start, end) {
    var max = 0
    var tmp = this.events.slice(start, end + 1)
    tmp.forEach(el => {
      if (el.speedKPH > max) max = el.speedKPH
    });
    return max
  }

  resetSelectedDate() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    this.selectedDate = startDate
    this.selectedDateString = this.tools.formatDateForInput(this.selectedDate)
  }

  incrementDate(step) {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + step));
    this.loadVehiculeEvents()
    this.selectedDateString = this.tools.formatDateForInput(this.selectedDate)
  }

  updateCalcs() {
    this.selectedDate = new Date(this.selectedDateString)
    this.loadVehiculeEvents()
  }

  public chartClicked(e: any): void {
    // console.log(this.segmentedData[e]);
    this.modalRoot.show();
    if (e != this.selectedEvent) {
      this.selectedEvent = e
      this.allTrajet = false
      setTimeout(() => {
        this.paintPolyline()
      }, 100)
    }

  }

  closeSpliter(force) {
    this.events = []
    this.selectedEvent = undefined
    this.allTrajet = false
    this.segmentedData = []
    this.resetResume()
    this.selectedVehiculeID = ""
    this.selectedVName = ""
    this.showAllPoints = false
    this.modalRoot.hide()
    this.resetSize2()
    this.resetSelectedDate()
    if (force)
      this.splitDisabled = true
  }

  resetWhenNoEvent() {
    this.selectedEvent = undefined
    // this.events = []
    this.segmentedData = []
    this.resetResume()
    this.allTrajet = false
    this.showAllPoints = false
    this.modalRoot.hide()
    this.resetSize2()
  }

  showAllPointscheckbox() {
    if (this.events && this.events.length > 1) {
      this.mapModal.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
          this.mapModal.removeLayer(layer);
        }
      });
      this.paintPolyline()
    }
  }

  showAllTrajet() {
    if (this.events && this.events.length > 0) {
      this.allTrajet = true
      this.selectedEvent = undefined
      this.modalRoot.show();
      setTimeout(() => {
        this.paintPolyline()
      }, 100)
    }
  }

  paintPolyline() {
    if (this.allTrajet) {
      this.invalidateModalMap()
      if (this.layer) this.mapModal.removeLayer(this.layer)
      var tr = this.segmentedData[this.selectedEvent]
      // var evts = this.events.slice(tr.start, tr.end + 1)
      var latlngs = []
      latlngs = this.events.map(ev => [ev.latitude, ev.longitude])
      // console.log(latlngs);
      if (latlngs.length > 0) {
        this.layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })])
        this.events.forEach((ev, i) => {
          if (i != 0 && i != (this.events.length - 1)) {
            if (ev.statusCode == 62465 || ev.statusCode == 62467) {
              this.createMarker(ev, ev.statusCode == 62465 ? this.tools.myDetailsIcon('stop') : this.tools.myDetailsIcon('park')).addTo(this.layer)
            } else if (this.showAllPoints) {
              this.createMarker(ev, ev.speedKPH <= 8 ? this.tools.myDetailsIcon('semi-stop') : ev.speedKPH <= 30 ? this.tools.myDetailsIcon('semi-moving') : this.tools.myDetailsIcon('moving')).addTo(this.layer)
            }
          }
        });
        this.createMarker(this.events[0], this.tools.myDetailsIcon('start')).addTo(this.layer)
        this.createMarker(this.events[this.events.length - 1], this.tools.myDetailsIcon('end')).addTo(this.layer)
        this.mapModal.fitBounds(latlngs)
        this.layer.addTo(this.mapModal)
        this.invalidateModalMap()
      }
    }
    else if (this.selectedEvent != undefined) {
      this.invalidateModalMap()
      if (this.layer) this.mapModal.removeLayer(this.layer)
      var tr = this.segmentedData[this.selectedEvent]
      var evts = this.events.slice(tr.start, tr.end + 1)
      if (tr.status == 3) {
        var latlngs = []
        latlngs = evts.map(ev => [ev.latitude, ev.longitude])
        // console.log(latlngs);
        if (latlngs.length > 0) {
          this.layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })])
          evts.forEach((ev, i) => {
            if (i != 0 && i != (evts.length - 1)) {
              if (ev.statusCode == 62465 || ev.statusCode == 62467) {
                this.createMarker(ev, ev.statusCode == 62465 ? this.tools.myDetailsIcon('stop') : this.tools.myDetailsIcon('park')).addTo(this.layer)
              } else if (this.showAllPoints) {
                this.createMarker(ev, ev.speedKPH <= 8 ? this.tools.myDetailsIcon('semi-stop') : ev.speedKPH <= 30 ? this.tools.myDetailsIcon('semi-moving') : this.tools.myDetailsIcon('moving')).addTo(this.layer)
              }
            }
          });
          this.createMarker(evts[0], this.tools.myDetailsIcon('start')).addTo(this.layer)
          this.createMarker(evts[evts.length - 1], this.tools.myDetailsIcon('end')).addTo(this.layer)
          this.mapModal.fitBounds(latlngs)
        }
      } else {
        // console.log(evts[0]);
        this.layer = L.layerGroup([this.createMarker(evts[0], tr.status == 2 ? this.tools.myDetailsIcon('stop') : this.tools.myDetailsIcon('park'))])
        this.mapModal.setView(new L.LatLng(evts[0].latitude, evts[0].longitude))
      }
      this.layer.addTo(this.mapModal)
      this.invalidateModalMap()
    }
  }

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

  getDrivers() {
    var route = this.router
    this.dataService.getDriverData("?minimum=true").subscribe({
      next: (res) => {
        // console.log(res)
        this.drivers = res;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.map = this.tools.createMap(this.map, 'map', this.car, this.provider, this.showCollapsControle, this.showFullScreenControle, this.showPositionControle, true, true)
      this.mapModal = this.tools.createMap(this.mapModal, 'mapModal', this.car, this.provider, false, false, false, false, false)
      this.inter = setInterval(() => {
        this.loadData()
      }, 5000)
      this.loadZones()
    }, 100);
  }

  initMarkers() {
    this.cluster = L.markerClusterGroup({ animate: false, animateAddingMarkers: false, spiderfyOnMaxZoom: false, disableClusteringAtZoom: 20 });
    // console.log("this.vehicules", this.vehicules);
    this.vehicules.forEach((veh, index) => {
      this.markers.push(
        L.marker([veh.lat, veh.lng], {
          icon: this.tools.myIcon(veh, veh.statusCode, veh.icon),
        })
          .bindPopup(this.tools.formatPopUpContent(veh), {
            closeButton: false,
            offset: L.point(0, -20)
          }).on('click', (event) => {
            this.rowClicked(index)
          })
        // .on('mouseout', (event) => {
        //   event.target.closePopup()
        // })
      )
    });

    this.markersLayerGroup = L.layerGroup(this.markers)
    if (this.map) {
      this.centerMap()
      if (this.isClustering == "1") {
        this.cluster.addLayers(this.markersLayerGroup)
      }
      else {
        this.markersLayerGroup.addTo(this.map)
      }
      this.cluster.addTo(this.map)
    } else {
      let inter = setInterval(() => {
        if (this.map) {
          this.centerMap()
          // L.layerGroup(this.markers).addTo(this.map)
          if (this.isClustering == "1") {
            this.cluster.addLayers(this.markersLayerGroup)
          }
          else {
            this.markersLayerGroup.addTo(this.map);
          }
          this.cluster.addTo(this.map)
          clearInterval(inter)
        }
      }, 100)
    }
    this.isFirstTime = false
    this.invalidate()
  }

  updateMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.vehicules[i]) {
        let v = this.vehicules[i]
        this.markers[i].setLatLng([v.lat, v.lng])
        this.markers[i].setIcon(this.tools.myIcon(v, v.statusCode, v.icon, this.selectedVehiculeIndex == i))
        this.markers[i].setPopupContent(this.tools.formatPopUpContent(v))
      }
    }
    // this.cluster.refreshClusters()
    this.center()
  }

  reset() {
    this.selectedVehiculeIndex = -1
    for (let i = 0; i < this.markers.length; i++) {
      if (this.vehicules[i]) {
        let v = this.vehicules[i]
        this.markers[i].setIcon(this.tools.myIcon(v, v.statusCode, v.icon, this.selectedVehiculeIndex == i))
      }
    }
    this.centerMap()
  }

  loadData() {
    var route = this.router
    this.vehiculeService.getData().subscribe({
      next: (res) => {
        const data = res['DeviceList']
        let vehicules = []
        data.forEach(e => {
          let l = e['EventData'].length - 1 ?? -1
          if (l > -1) {
            const vData = e['EventData'][l]
            vehicules.push(
              new Vehicule(e["Device"] ?? "", e["Device_desc"] ?? "", vData['Timestamp'] ?? 0, vData["StatusCode"]?.toString(), vData["Address"] ?? "",
                vData["Odometer"] ?? "", vData["acceleration"] ?? "", e["SimCard"] ?? "", e["DeviceCode"] ?? "", vData["GPSPoint_lat"] ?? 0,
                vData["GPSPoint_lon"] ?? 0, vData['Heading'] ?? 0, vData['Speed'] ?? 0, e['Icon'], vData['FuelLevel_Liter'] ?? 0, this.tools.getDriverName(this.drivers, vData['DriverID'] ?? '----'))
            )
          }
        });
        this.isFirstTime = this.vehicules.length == 0
        this.vehicules = vehicules
        // console.log(this.vehicules)
        vehicules = []
        if (this.isFirstTime) {
          this.initMarkers()
        } else {
          this.updateMarkers()
        }
        this.setTypesCount()

      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  setTypesCount() {
    this.vehicules.map(vehicule => {
      if (vehicule.statusCode == 61714) {
        this.typesCount[0] += 1;
      }

      if (vehicule.statusCode == 62465) {
        this.typesCount[1] += 1;
      }

      if (vehicule.statusCode == 62467) {
        this.typesCount[2] += 1;
      }

      if (vehicule.statusCode == 61472 || vehicule.statusCode == 64783) {
        this.typesCount[3] += 1;
      }
    })
  }

  center() {
    if (this.selectedVehiculeIndex != -1) {
      this.map.setView(this.markers[this.selectedVehiculeIndex].getLatLng())
    }
  }

  centerMap() {
    let bounds = this.markers.map((e) => {
      return [e.getLatLng().lat, e.getLatLng().lng]
    })
    // if (bounds.length > 0) {
    //   if (bounds.length > 1) {
    this.map.fitBounds(bounds)
    //   } else {
    //     this.map.setView(new L.LatLng(bounds[0][0], bounds[0][1]))
    //   }
    // }

  }

  toggleMapFullscreen() {
    if (!this.tools.isFullScreen) {
      this.tools.openFullscreen(document.getElementById("map"))
    }
    else {
      this.tools.closeFullscreen()
    }
  }

  toggleClustering() {
    if (this.isClustering != "1") {
      if (this.map.hasLayer(this.markersLayerGroup)) this.map.removeLayer(this.markersLayerGroup)
      this.cluster.addLayers(this.markersLayerGroup)
      this.isClustering = "1"
    }
    else {
      this.cluster.clearLayers()
      this.markersLayerGroup.addTo(this.map)
      this.isClustering = "0"
    }
    localStorage.setItem("isClustering", this.isClustering)
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

  rowClicked(index) {
    this.map.setView(this.markers[index].getLatLng(), this.maxZoom)
    this.selectedVehiculeIndex = index
    if (!this.splitDisabled) {
      var v = this.vehicules[index]
      this.resetWhenNoEvent()
      this.selectedVehiculeID = v.id
      this.selectedVName = v.name
      this.loadVehiculeEvents()
    }
    for (let i = 0; i < this.markers.length; i++) {
      if (this.vehicules[i]) {
        let v = this.vehicules[i]
        this.markers[i].setIcon(this.tools.myIcon(v, v.statusCode, v.icon, this.selectedVehiculeIndex == i, true))
      }
    }


    // this.showDetails(this.vehicules[index])
  }

  showReportClicked(index) {
    var v = this.vehicules[index]
    if (v) {
      this.closeSpliter(false)
      this.selectedVehiculeID = v.id
      this.selectedVName = v.name
      this.loadVehiculeEvents()
    }
  }

  shareClicked(index) {
    if (this.vehicules[index]) {
      this.vehicle2shareIndex = index
      this.modalLoading = false;
      this.isShareTrajet = false
      this.generatedShareLink = ""
      this.errorMsg = ""
      this.period = 1
      this.secondModal.show();
    }
  }

  resetResume() {
    this.resume = { dureeOFF: "0h:0min", dureeON: "0h:0min", dureeMoving: "0h:0min", maxVitesse: 0, odometer: 0, kmParcoure: 0, fuelLevel: 0, consomation: 0, consomationMoyenne: "0" }
  }
  
  rowDoubleClicked(event) {
    this.map.setView(this.markers[event].getLatLng(), this.maxZoom)
    this.selectedVehiculeIndex = event
    for (let i = 0; i < this.markers.length; i++) {
      if (this.vehicules[i]) {
        let v = this.vehicules[i]
        this.markers[i].setIcon(this.tools.myIcon(v, v.statusCode, v.icon, this.selectedVehiculeIndex == i, true))
      }
    }
  }

  collapseClicked() {
    this.size[0] = 0
    this.size[1] = 100
    this.invalidate()
  }

  expandClicked() {
    this.size[0] = 100
    this.size[1] = 0
    this.invalidate()
  }

  invalidate() {
    this.map?.invalidateSize(true)
  }

  invalidateModalMap() {
    this.mapModal?.invalidateSize(true)
  }

  resetSize() {
    this.size[0] = 25
    this.size[1] = 75
    this.invalidate()
  }

  resetSize2() {
    this.size2 = [60, 40]
    this.invalidate()
  }

  onDragEnd(e) {
    this.size = [e.sizes[0], e.sizes[1]]
    this.invalidate()
  }

  loadZones() {
    this.zoneService.getData().subscribe({
      next: (res: any) => {
        var zones: Zone[] = []
        res.map((element: any) => {
          var zone = new Zone()
          zone.description = element.description
          zone.isActive = element.isActive
          zone.iconName = element.iconName
          zone.radius = element.radius
          zone.zoneType = element.zoneType
          zone.latitude1 = element.latitude1
          zone.longitude1 = element.longitude1
          zone.latitude2 = element.latitude2
          zone.longitude2 = element.longitude2
          zone.latitude3 = element.latitude3
          zone.longitude3 = element.longitude3
          zone.latitude4 = element.latitude4
          zone.longitude4 = element.longitude4
          zone.latitude5 = element.latitude5
          zone.longitude5 = element.longitude5
          zone.latitude6 = element.latitude6
          zone.longitude6 = element.longitude6
          zone.latitude7 = element.latitude7
          zone.longitude7 = element.longitude7
          zone.latitude8 = element.latitude8
          zone.longitude8 = element.longitude8
          zone.latitude9 = element.latitude9
          zone.longitude9 = element.longitude9
          zone.latitude10 = element.latitude10
          zone.longitude10 = element.longitude10
          zones.push(zone)
        });
        this.generateZonesLayers(zones)
        this.map.on('overlayadd', (e) => {
          // console.log('overlayadd', e.layer);
          if (e.layer._latlng && !e.layer._radius)
            this.map.setView(e.layer._latlng, 15)
          else this.map.fitBounds(e.layer.getBounds())
        })
      }, error(err) {
        console.log(err);
      }
    })

  }

  generateZonesLayers(zones: Zone[]) {
    var layers = {}
    zones.forEach(e => {
      layers[e.description] = this.getZoneLayer(e)
    });
    L.control.layers(null, layers, { collapsed: true, position: "topleft" }).addTo(this.map);
  }

  getZoneLayer(zone: Zone) {
    var layer: any
    if (zone.zoneType == ZoneType.Circle) {
      layer = L.circle(new L.LatLng(zone.latitude1, zone.longitude1), zone.radius);
    } else if (zone.zoneType == ZoneType.Polygon) {
      layer = L.polygon(zone.latLngs)
    } else {
      var iconName = "default"
      if (this.iconExists(zone.iconName)) {
        iconName = zone.iconName
      }
      var icon = L.icon({
        iconUrl: 'assets/img/POI/' + iconName + '.png',
        iconSize: [40, 50],
        iconAnchor: [20, 50]
      });
      layer = L.marker(new L.LatLng(zone.latitude1, zone.longitude1), { icon: icon })
    }
    return layer
  }

  iconExists(name: any) {
    return this.cts.zoneIcons.findIndex(elem => elem.name == name) != -1
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  destroy() {
    if (this.inter) {
      clearInterval(this.inter);
      this.inter = null;
    }
  }

  getVehicleName(i) {
    if (i != -1 && this.vehicules[i]) return this.vehicules[i].name
    return ""
  }

  generateShareLink() {
    this.errorMsg = ""
    if (this.vehicle2shareIndex != -1 && this.vehicules[this.vehicle2shareIndex] && this.period > 0) {
      // console.log("generateShareLink");
      this.modalLoading = true
      this.dataService.generateTrackToken("?d=" + this.vehicules[this.vehicle2shareIndex].id + "&showTrajet=" + this.isShareTrajet + "&pe=" + this.period).subscribe({
        next: (res) => {
          // console.log(res)
          this.modalLoading = false
          this.generatedShareLink = "http://track.sendatrack.com/#/track/" + res["t"].toString();
        }, error(err) {
          console.log(err)
          this.modalLoading = false
          this.errorMsg = "Quelque chose s'est mal passé, Veuillez réessayer ou contacter le support!"
        }
      })
    }
  }

  onCloseModal() { }

  round2d(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }
}

