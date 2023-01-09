import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { VehiculeService } from '../../../services/vehicule.service'
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { Vehicule } from '../../../models/vehicule'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { ActivatedRoute, Router } from '@angular/router'
import { Constant } from '../../../tools/constants'
import { ZoneService } from '../../../services/zone.service'
import { Zone, ZoneType } from '../../../models/zone'
import { DataService } from '../../../services/data.service'
import { MyDateRangePickerComponent, MyDateRangePickerOptions } from '../../components/my-date-range-picker/my-daterangepicker.component'
// import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-maptimeline',
  templateUrl: './mapTimeLine.component.html',
  styleUrls: ['./mapTimeLine.component.scss'],
})


export class MapTimeLineComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() showFullScreenControle?: boolean = true
  @Input() showPositionControle?: boolean = true
  @Input() showCollapsControle?: boolean = true
  @Input() showClusterControle?: boolean = false
  vehiculeID: string
  vName: string = ""
  value: string | Object;
  myDateRangePickerOptions: MyDateRangePickerOptions;
  @ViewChild('calendar', { static: true })
  private myDateRangePicker: MyDateRangePickerComponent;
  provider = new OpenStreetMapProvider();
  public size = [40, 60]
  isMyPositionVisible: boolean = false
  MyPositionMarker: L.Marker
  mapModal: any//L.Map
  car = {
    lat: 35.75,
    lng: -5.83
  }
  maxZoom = 20
  layer: any
  allMarkersLayerGroup: any
  segmentedTrajetLayer: any
  drivers: any = [];
  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private vehiculeService: VehiculeService, private tools: util, public cts: Constant, private zoneService: ZoneService, public router: Router) {
    this.vehiculeID = this.activatedRoute.snapshot.paramMap.get('id')
  }

  public segmentedData = [[]]
  public TimelineDays = []
  loadingEvents = false
  events: any = []
  showAllPoints = false
  public resume = { dureeOFF: "0h:0min", dureeON: "0h:0min", dureeMoving: "0h:0min", maxVitesse: 0, odometer: 0, kmParcoure: 0, fuelLevel: 0, consomation: 0, consomationMoyenne: "0" }

  async ngOnInit(): Promise<void> {
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
    if (await this.vehiculeExist(this.vehiculeID)) {
      this.getDrivers();
      this.loadData();
    } else {
      // console.log('Vehicule Does not exist');
      this.router.navigate(['/404'])
    }
  }

  async vehiculeExist(id: any): Promise<boolean> {
    let vehicules = []
    let exist = false
    let promise = this.vehiculeService.getData().toPromise()
    await promise.then((res) => {
      vehicules = res['DeviceList']
      // console.log("vehicules", vehicules);
      vehicules.forEach(element => {
        if (element.Device == id) {
          this.vName = element.Device_desc;
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

  loadData() {
    this.loadingEvents = true
    var route = this.router
    // console.log(this.vehiculeID)
    if (this.vehiculeID != "") {//&unskip
      this.vehiculeService.getVehiculeEvents("map-events2?d=" + this.vehiculeID + "&st=" + this.myDateRangePicker.getDate2From + "&et=" + this.myDateRangePicker.getDate2To).subscribe({
        next: (res) => {
          this.events = res
          if (this.events.length > 0) {
            this.paintPolyline()
            this.extractTrajets()
            this.extractResume()
          } else {
            this.resetWhenNoEvent()
          }
          // console.log(this.events);
          this.loadingEvents = false
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          } else {
            route.navigate(['/404'])
          }
        }
      })
    }
  }

  extractTrajets() {
    if (this.events.length > 0) {
      var selectedDay = this.events[0].timestamp + 86399 //24h
      var currentDay = this.tools.formatDateForInput(new Date(this.events[0].timestamp * 1000)).toString()
      var data = [[{ status: 0, start: 0, end: 0 }]]
      var days = [currentDay]
      var carstatMoving = false;
      var carstatON = false;
      var carstatOFF = false;
      var eventIndex = 0
      var eventday = 0
      var maxVitesse = 0
      var i = 0
      this.events.forEach(event => {
        if (event.speedKPH > maxVitesse) maxVitesse = event.speedKPH

        if (event.timestamp >= selectedDay) {
          eventday++;
          selectedDay += 86400;
          days[eventday] = this.tools.formatDateForInput(new Date((selectedDay - 10) * 1000)).toString()
          data[eventday] = [{ status: 0, start: 0, end: 0 }]
          carstatMoving = false;
          carstatON = false;
          carstatOFF = false;
          eventIndex = 0
        }
        if (this.cts.movingStatusCodes.includes(event.statusCode)) {   //Moving
          ///////
          event.timestampString = this.tools.formatedTime(new Date(event.timestamp * 1000))
          event.statusString = "Moving"
          ///////
          if (carstatON || carstatOFF) {
            eventIndex++
            data[eventday][eventIndex] = { status: 3, start: i, end: i }
            if (carstatON) carstatON = false;
            if (carstatOFF) carstatOFF = false;
          }
          data[eventday][eventIndex].end = i
          if (!carstatMoving) {
            data[eventday][eventIndex].status = 3 //Moving
            data[eventday][eventIndex].start = i
            carstatMoving = true;
          }
        } else if (this.cts.onStatusCodes.includes(event.statusCode)) {  //ON
          ///////
          event.timestampString = this.tools.formatedTime(new Date(event.timestamp * 1000))
          event.statusString = "ON"
          ///////
          if (carstatMoving || carstatOFF) {
            eventIndex++
            data[eventday][eventIndex] = { status: 2, start: i, end: i }
            if (carstatMoving) carstatMoving = false;
            if (carstatOFF) carstatOFF = false;
          }
          data[eventday][eventIndex].end = i
          if (!carstatON) {
            data[eventday][eventIndex].status = 2 //ON
            data[eventday][eventIndex].start = i
            carstatON = true;
          }
        } else {  //OFF
          ///////
          event.timestampString = this.tools.formatedTime(new Date(event.timestamp * 1000))
          event.statusString = "OFF"
          ///////
          if (carstatMoving || carstatON) {
            eventIndex++
            data[eventday][eventIndex] = { status: 1, start: i, end: i }
            if (carstatMoving) carstatMoving = false;
            if (carstatON) carstatON = false;
          }
          data[eventday][eventIndex].end = i
          if (!carstatOFF) {
            data[eventday][eventIndex].status = 1 //OFF
            data[eventday][eventIndex].start = i
            carstatOFF = true;
          }
        }
        i++
      });
      this.resume.maxVitesse = maxVitesse

      this.TimelineDays = days;
      this.segmentedData = data;
    }else{

    }

  }

  extractResume() {
    var resumeTmp = { dureeOFF: 0, dureeON: 0, dureeMoving: 0, odometer: 0, kmParcoure: 0, fuelLevel: 0, consomation: 0, consomationMoyenne: "0" }
    resumeTmp.kmParcoure = this.round2d(this.events[this.events.length - 1].odometerKM - this.events[0].odometerKM)
    resumeTmp.consomation = this.round2d(this.events[this.events.length - 1].fuelTotal - this.events[0].fuelTotal)
    resumeTmp.consomationMoyenne = (100 * (resumeTmp.consomation / (resumeTmp.kmParcoure != 0 ? resumeTmp.kmParcoure : 1))).toFixed(2);
    // console.log(this.segmentedData);
    this.segmentedData.forEach(day => {
      var i = 0
      var length = day.length
      day.forEach(tr => {
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
        var interval = i == length - 1 ? end - start : (this.events[day[i + 1].start].timestamp - start)
        tr.ratio = ((100 * interval) / 86400) + "%";
        i++
      });
    });
    // };
    this.resume = { dureeOFF: this.tools.formatAge2(resumeTmp.dureeOFF), dureeON: this.tools.formatAge2(resumeTmp.dureeON), dureeMoving: this.tools.formatAge2(resumeTmp.dureeMoving), maxVitesse: this.resume.maxVitesse, kmParcoure: resumeTmp.kmParcoure, odometer: this.events[this.events.length - 1].odometerKM, fuelLevel: this.events[this.events.length - 1].fuelLevel, consomation: resumeTmp.consomation, consomationMoyenne: resumeTmp.consomationMoyenne }
  }


  getMaxSpeed(start, end) {
    var max = 0
    var tmp = this.events.slice(start, end + 1)
    tmp.forEach(el => {
      if (el.speedKPH > max) max = el.speedKPH
    });
    return max
  }


  resetWhenNoEvent() {
    if (this.layer && this.mapModal.hasLayer(this.layer)) this.mapModal.removeLayer(this.layer)
    if (this.allMarkersLayerGroup && this.mapModal.hasLayer(this.allMarkersLayerGroup)) this.mapModal.removeLayer(this.allMarkersLayerGroup)
    if (this.segmentedTrajetLayer && this.mapModal.hasLayer(this.segmentedTrajetLayer)) this.mapModal.removeLayer(this.segmentedTrajetLayer)
    this.segmentedData = [[]]
    this.resetResume()
    this.showAllPoints = false
  }

  showAllPointscheckbox() {
    if (this.allMarkersLayerGroup && this.mapModal.hasLayer(this.allMarkersLayerGroup)) this.mapModal.removeLayer(this.allMarkersLayerGroup)
    if (this.showAllPoints) this.allMarkersLayerGroup.addTo(this.mapModal)
  }

  chartClicked(j, e): void {
    if (this.events && this.events.length > 0) {
      if (this.segmentedData[j][e]) {
        var start = this.segmentedData[j][e].start
        var end = this.segmentedData[j][e].end
        this.zoomOnSegmentedTrajet(start, end)
      }
    }
  }

  showDayTrajet(j) {
    if (this.events && this.events.length > 0) {
      if (this.segmentedData[j]) {
        var start = this.segmentedData[j][0].start
        var end = this.segmentedData[j][this.segmentedData[j].length - 1].end
        this.zoomOnSegmentedTrajet(start, end)
      }
    }
  }

  paintPolyline() {
    this.invalidate()
    if (this.layer && this.mapModal.hasLayer(this.layer)) this.mapModal.removeLayer(this.layer)
    if (this.allMarkersLayerGroup && this.mapModal.hasLayer(this.allMarkersLayerGroup)) { this.mapModal.removeLayer(this.allMarkersLayerGroup); }
    if (this.segmentedTrajetLayer && this.mapModal.hasLayer(this.segmentedTrajetLayer)) this.mapModal.removeLayer(this.segmentedTrajetLayer)
    this.allMarkersLayerGroup = L.layerGroup()
    var latlngs = []
    latlngs = this.events.map(ev => [ev.latitude, ev.longitude])
    // console.log(latlngs);
    if (latlngs.length > 0) {
      this.layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })])
      this.events.forEach((ev, i) => {
        if (i != 0 && i != (this.events.length - 1)) {
          if (ev.statusCode == 62465 || ev.statusCode == 62467) {
            this.createMarker(ev, ev.statusCode == 62465 ? this.tools.myDetailsIcon('stop') : this.tools.myDetailsIcon('park')).addTo(this.layer)
          } else {
            this.createMarker(ev, ev.speedKPH <= 8 ? this.tools.myDetailsIcon('semi-stop') : ev.speedKPH <= 30 ? this.tools.myDetailsIcon('semi-moving') : this.tools.myDetailsIcon('moving')).addTo(this.allMarkersLayerGroup)
          }
        }
      });
      this.createMarker(this.events[0], this.tools.myDetailsIcon('start')).addTo(this.layer)
      this.createMarker(this.events[this.events.length - 1], this.tools.myDetailsIcon('end')).addTo(this.layer)
      this.mapModal.fitBounds(latlngs)
      this.layer.addTo(this.mapModal)
      if (this.showAllPoints) { this.allMarkersLayerGroup.addTo(this.mapModal) }
      this.invalidate()
    }
  }

  zoomOnSegmentedTrajet(start, end) {
    this.invalidate()
    if (this.segmentedTrajetLayer && this.mapModal.hasLayer(this.segmentedTrajetLayer)) this.mapModal.removeLayer(this.segmentedTrajetLayer)
    var evts = this.events.slice(start, end + 1)
    var latlngs = []
    latlngs = evts.map(ev => [ev.latitude, ev.longitude])
    // console.log(latlngs);
    if (latlngs.length > 0) {
      this.segmentedTrajetLayer = L.layerGroup([L.polyline(latlngs, { color: '#f00', opacity: 1, weight: 3 })])
      this.createMarker(evts[0], this.tools.myDetailsIcon('start')).addTo(this.segmentedTrajetLayer)
      this.createMarker(evts[evts.length - 1], this.tools.myDetailsIcon('end')).addTo(this.segmentedTrajetLayer)
      if (latlngs.length > 1) {
        this.mapModal.fitBounds(latlngs)
      }
      else {
        this.mapModal.setView(new L.LatLng(evts[0].latitude, evts[0].longitude))
      }
    }
    this.segmentedTrajetLayer.addTo(this.mapModal)
    this.invalidate()
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
      this.mapModal = this.tools.createMap(this.mapModal, 'map', this.car, this.provider, this.showCollapsControle, this.showFullScreenControle, this.showPositionControle, this.showClusterControle, false)
      this.loadZones()
    }, 100);
  }

  centerMap() {
    let bounds = this.events.map((e) => {
      return [e.latitude, e.longitude]
    })
    if (bounds.length > 0) {
      if (bounds.length > 1) {
        this.mapModal.fitBounds(bounds)
      } else {
        this.mapModal.setView(new L.LatLng(bounds[0][0], bounds[0][1]))
      }
    }
  }

  toggleMapFullscreen() {
    if (!this.tools.isFullScreen) {
      this.tools.openFullscreen(document.getElementById("map"))
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
          this.MyPositionMarker.removeFrom(this.mapModal)
          this.MyPositionMarker.addTo(this.mapModal)
          this.isMyPositionVisible = true
          this.mapModal.fitBounds([[p.coords.latitude, p.coords.longitude]])
        } else {
          this.MyPositionMarker.removeFrom(this.mapModal)
          this.isMyPositionVisible = false
          this.centerMap()
          positionCtl.classList.replace("icon-close", "icon-target")
        }
      }, null, options)
    }
  }

  resetResume() {
    this.resume = { dureeOFF: "0h:0min", dureeON: "0h:0min", dureeMoving: "0h:0min", maxVitesse: 0, odometer: 0, kmParcoure: 0, fuelLevel: 0, consomation: 0, consomationMoyenne: "0" }
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
    this.mapModal?.invalidateSize(true)
  }

  resetSize() {
    this.size[0] = 40
    this.size[1] = 60
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
        this.mapModal.on('overlayadd', (e) => {
          // console.log('overlayadd', e.layer);
          if (e.layer._latlng && !e.layer._radius)
            this.mapModal.setView(e.layer._latlng, 15)
          else this.mapModal.fitBounds(e.layer.getBounds())
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
    L.control.layers(null, layers, { collapsed: true, position: "topleft" }).addTo(this.mapModal);
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
  }

  round2d(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }
}

