import { Component, AfterViewInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { VehiculeService } from 'src/app/services/vehicule.service';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'modal-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class ModalMapComponent implements AfterViewInit, OnDestroy {
  map: any
  car = {
    lat: 35.75,
    lng: -5.83
  }

  provider = new OpenStreetMapProvider();
  trajets: any[] = []
  loadingTrajet = false
  @Input() mapID: string
  @Input() ToInvalidate?: string
  @Input() vehiculeID: string
  @Input() startTime: string
  @Input() endTime: string
  @Input() timestamps?: any
  @Input() positionChanged?: any
  @Input() showFullScreenControle?: Boolean = true
  @Input() showPositionControle?: Boolean = true
  layer: any
  MyPositionMarker: L.Marker
  isMyPositionVisible: Boolean = false
  fullScreenControl: L.Control;
  positionControl: L.Control;
  selectedVid: string
  selectedStartTime: string
  selectedEndTime: string
  selectedTimestamps: string
  OneZoomLevel = 17
  timer: any
  events: any;
  constructor(private vehiculeService: VehiculeService, private router: Router, private tools: util,) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("map changes");
    // console.log(changes);
    if (changes['vehiculeID'] || changes['startTime'] || changes['endTime'] || changes['timestamps']) {
      console.log("1 --> we have changes")
      this.resetPolyline();
      // if (changes['timestamps'])
      this.selectedTimestamps = changes['timestamps']?.currentValue
      if (changes['vehiculeID'])
        this.selectedVid = changes['vehiculeID'].currentValue
      if (changes['startTime']) {
        this.selectedStartTime = changes['startTime'].currentValue
      }
      if (changes['endTime']) {
        this.selectedEndTime = changes['endTime'].currentValue
      }
      if (this.selectedVid != "" && (this.selectedStartTime != "" || this.selectedEndTime != "") && !changes['timestamps']) {
        var url = this.selectedVid + "&st=" + this.selectedStartTime + "&3days=true"
        this.loadData(url + (this.selectedEndTime != "" ? "&et=" + this.selectedEndTime : ""), this.selectedEndTime == "")
      } else if (this.selectedTimestamps && this.selectedTimestamps != "" && this.selectedVid != "") {
        this.loadDataByTimestams(this.selectedVid, this.selectedTimestamps)
      }
    }

    else if (changes['positionChanged']) {
      if (this.events && this.events.length > 1) {
        this.resetPolyline();
        var url = this.selectedVid + "&st=" + this.selectedStartTime + "&3days=true"
        this.loadData(url + (this.selectedEndTime != "" ? "&et=" + this.selectedEndTime : ""), this.selectedEndTime == "")
      }
      else {
        this.map.setView([this.events[0].latitude, this.events[0].longitude], this.OneZoomLevel)
      }
    }

    setTimeout(() => {
      this.invalidate()
    }, 200);
  }

  loadData(url: string, isOne: boolean) {
    url = isOne ? "oneEvent?d=" + url : "map-events?d=" + url
    // console.log("loadData");
    // console.log(url);
    this.loadingTrajet = true
    var route = this.router
    this.vehiculeService.getVehiculeEvents(url).subscribe({
      next: (res: any) => {
        // console.log("getVehiculeEvents");
        // console.log(res);
        this.events = res;
        let events = res
        if (events.length == 1)
          this.addMarker(events[0])
        else if (events.length > 1)
          this.paintPolyline(events)
        this.loadingTrajet = false
      }, error(err) {
        this.loadingTrajet = false
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    }
    )
  }

  loadDataByTimestams(d, timestamps) {
    // console.log("loadDataByTimestams", d, timestamps);
    if (timestamps.length) {
      let url = "EventsByTimestamps?d=" + d
      this.loadingTrajet = true
      var route = this.router
      this.vehiculeService.getVehiculeEventsByTimestamps(url, timestamps.join(',')).subscribe({
        next: (res: any) => {
          // console.log("getVehiculeEvents");
          // console.log("res ", res);
          this.events = res;
          let events = res
          if (events.length > 0)
            this.addMarkers(events)
          this.loadingTrajet = false
        }, error(err) {
          this.loadingTrajet = false
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      }
      )
    }

  }

  createArretsMarkers(e) {
    this.addMarker(e)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createMap()
    }, 100);

  }

  createMap() {
    const zoomLevel = 12
    this.map = L.map(this.mapID, { attributionControl: false, zoomControl: false, markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true })
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
    googleHybrid.addTo(this.map)
    L.control.zoom().addTo(this.map)
    if (this.showFullScreenControle) {
      // console.log(this.mapID + 'fullScreenControl');

      let FullScreenControl = this.control(this.mapID + 'fullScreenControl')
      this.fullScreenControl = new FullScreenControl({
        position: "topleft"
      }).addTo(this.map);
    }
    if (this.showPositionControle) {
      let PositionControl = this.control(this.mapID + 'positionControl')
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

    ////////////////////////////////////////////////////////////
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);
    L.control.scale().addTo(this.map);
    this.invalidate()
  }

  control(id: string) {
    return L.Control.extend({
      onAdd(map: L.Map) {
        return L.DomUtil.get(id);
      },
      onRemove(map: L.Map) { }
    });
  }

  centerMap() {
    // let bounds = this.markers.map((e) => {
    //   return e.getLatLng()
    // })
    // this.map.fitBounds(bounds)
  }

  toggleMapFullscreen() {
    if (!this.tools.isFullScreen) {
      this.tools.openFullscreen(document.getElementById(this.mapID))
    }
    else {
      this.tools.closeFullscreen()
    }
  }

  toggleMyPosition() {
    // console.log("toggleMyPosition");
    if (navigator.geolocation) {
      // console.log("geolocation");
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition((p) => {
        // console.log("getCurrentPosition");
        // console.log(p.coords);
        var positionCtl = document.getElementById(this.mapID + "positionControl")
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

  paintPolyline(events: any) {
    var latlngs = []
    this.invalidate()
    latlngs = events.map(ev => [ev.latitude, ev.longitude])
    if (latlngs.length > 0) {
      this.map.fitBounds(latlngs)
    }
    this.layer = L.layerGroup([L.polyline(latlngs, { color: '#20a8d8', opacity: 1, weight: 4 })])
    events.forEach((ev, i) => {
      if (i != 0 && i != (events.length - 1)) {
        if (ev.statusCode == 62465 || ev.statusCode == 62467) {
          this.createMarker(ev, ev.statusCode == 62465 ? this.tools.myDetailsIcon('stop') : this.tools.myDetailsIcon('park')).addTo(this.layer)
        }
      }
    });

    this.createMarker(events[0], this.tools.myDetailsIcon('start')).addTo(this.layer)
    this.createMarker(events[events.length - 1], this.tools.myDetailsIcon('end')).addTo(this.layer)
    this.layer.addTo(this.map)
  }

  createMarker(ev: any, icon: any) {
    let time = new Date(ev.timestamp * 1000)
    return L.marker([ev.latitude, ev.longitude], {
      icon: icon
    }).bindPopup(`` +
      `<div>Heure: ${this.tools.formatedTime(time)}</div>` +
      `<div>Status: ${ev.statusCode} </div>` +
      `<div>Carburant: ${ev.fuelTotal} </div>`
      , {
        closeButton: false,
        offset: L.point(0, -20)
      })
  }

  addMarker(ev: any) {
    this.invalidate()
    this.map.setView([ev.latitude, ev.longitude], this.OneZoomLevel)
    this.layer = L.layerGroup([this.createMarker(ev, ev.statusCode == 62465 ? this.tools.myDetailsIcon('stop') : (ev.statusCode == 61714 ? this.tools.myDetailsIcon('moving') : this.tools.myDetailsIcon('park')))])
    this.layer.addTo(this.map)
  }

  addMarkers(ev: any) {
    this.invalidate()
    if (ev.length > 1) {
      var latlngs = ev.map(ev => [ev.latitude, ev.longitude]);
      if (latlngs.length > 0) {
        this.map.fitBounds(latlngs);
      }
    }
    else {
      this.map.setView([ev[0].latitude, ev[0].longitude], this.OneZoomLevel)
    }
    let markers = ev.map(e => {
      return this.createMarker(e, e.statusCode == 62465 ? this.tools.myDetailsIcon('stop') : (e.statusCode == 61714 ? this.tools.myDetailsIcon('moving') : this.tools.myDetailsIcon('park')))
    })
    this.layer = L.layerGroup(markers)
    this.layer.addTo(this.map)
  }
  invalidate() {
    if (this.map) {
      // if (!this.timer) {
      //   this.timer = setInterval(() =>
      this.map?.invalidateSize(true);
      // , 2000);
      // }
    }
  }

  resetPolyline() {
    if (this.layer && this.map.hasLayer(this.layer)) {
      this.layer.removeFrom(this.map)
    }
  }
  // -----------------------------------------------------------------------------//

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

}
