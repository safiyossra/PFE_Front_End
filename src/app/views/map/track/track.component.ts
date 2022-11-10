import { AfterViewInit, Component,OnDestroy, OnInit } from '@angular/core';
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import 'leaflet-routing-machine';
import { NgZone } from '@angular/core';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { Vehicule } from 'src/app/models/vehicule';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit, AfterViewInit,OnDestroy {

  provider = new OpenStreetMapProvider();
  showFullScreenControle: Boolean = true
  showPositionControle: Boolean = true
  isFirstTime = true
  token: any
  isPermitted = true
  exp = 0
  // ---------------- MAP -----------------
  isMyPositionVisible: Boolean = false
  MyPositionMarker: L.Marker
  map: any
  default = {
    latitude: 35.75,
    longitude: -5.83,
  }
  fullScreenControl: L.Control;
  resetControl: L.Control;
  positionControl: L.Control;

  vehicules = []
  selectedVehicule: any;

  myMarkers = []
  selectedVehicleIndex: -1;

  inter: any
  interTimer: any
  layerMarkers: any
  isTrajetDrew = false
  loading = false

  constructor(private activatedRoute: ActivatedRoute, public tools: util, private vehiculeService: VehiculeService, public ngZone: NgZone) {
    this.token = this.activatedRoute.snapshot.paramMap.get('token')
  }

  ngOnInit(): void {
    if (this.token && this.token.length > 10) { this.loadData() }
    else {
      // this.ngZone.run(() => {
      this.isPermitted = false;
      // });
    }
  }

  ngAfterViewInit(): void {
    if (this.isPermitted) {
      setTimeout(() => {
        this.createMap()
      }, 100)
      this.inter = setInterval(() => {
        this.loadData()
      }, 2000)
    }
  }

  createMap() {
    const zoomLevel = 12
    this.map = L.map('map', {
      center: [this.default.latitude, this.default.longitude], zoom: zoomLevel, attributionControl: false, zoomControl: false,
      markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true
    })
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
      let FullScreenControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('mapfullScreenControl');
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

    ////////////////////////////////////////////////////////////
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);

    L.control.scale().addTo(this.map);

    // this.initMarkers()

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
    console.log("toggleMyPosition");
    if (navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition((p) => {
        console.log(p.coords);
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
          positionCtl.classList.replace("icon-close", "icon-target")
        }
      }, null, options)
    }
  }

  clearMarkersFromMap() {
    this.myMarkers = []
    if (this.layerMarkers && this.map.hasLayer(this.layerMarkers)) {
      this.layerMarkers.removeFrom(this.map)
    }
  }

  loadData() {
    // var ngZone = this.ngZone
    if (this.isPermitted) {
      this.vehiculeService.getVehicle4Track("token=" + this.token).subscribe({
        next: (res) => {
          console.log(res);
          const data = res['DeviceList']
          this.exp = Math.floor(res["exp"] + res["period"] - new Date().getTime() / 1000)
          let vehicules = []
          data.forEach(e => {
            let l = e['EventData'].length - 1 ?? -1
            if (l > -1) {
              const vData = e['EventData'][l]
              vehicules.push(
                new Vehicule(e["Device"] ?? "", e["Device_desc"] ?? "", vData['Timestamp'] ?? 0, vData["StatusCode"]?.toString(), vData["Address"] ?? "",
                  vData["Odometer"] ?? "", vData["acceleration"] ?? "", e["SimCard"] ?? "", e["DeviceCode"] ?? "", vData["GPSPoint_lat"] ?? 0,
                  vData["GPSPoint_lon"] ?? 0, vData['Heading'] ?? 0, vData['Speed'] ?? 0, e['Icon'], vData['FuelLevel_Liter'] ?? 0, '----')
              )
            }
          });
          this.isFirstTime = this.vehicules.length == 0
          this.vehicules = vehicules
          // console.log(this.vehicules)
          vehicules = []
          if (this.isFirstTime) {
            this.initTimer()
            this.initMarkers()
          } else {
            this.updateMarkers()
          }
        }, error(err) {
          //  ngZone.run(() => {
          //   console.log("anim complete");
          this.permitted = false;
          // });

          console.log("err.status", err.status, this.permitted);
        }
      })
    }
  }

  initMarkers() {
    this.vehicules.forEach((veh, index) => {
      this.myMarkers.push(
        L.marker([veh.lat, veh.lng], {
          icon: this.tools.myIcon(veh, veh.statusCode, veh.icon,true),
        })
          .bindPopup(this.tools.formatPopUpContent(veh), {
            closeButton: false,
            offset: L.point(0, -20)
          }))
    });
    if (this.map) {
      // this.centerMap()
      this.center()
      this.layerMarkers = L.layerGroup(this.myMarkers)
      this.layerMarkers.addTo(this.map)
    } else {
      let inter = setInterval(() => {
        if (this.map) {
          // this.centerMap()
          this.center()
          this.layerMarkers = L.layerGroup(this.myMarkers)
          this.layerMarkers.addTo(this.map)
          clearInterval(inter)
        }
      }, 100)
    }
    this.invalidate()
    this.loading = false
  }

  updateMarkers() {
    for (let i = 0; i < this.myMarkers.length; i++) {
      if (this.vehicules[i]) {
        let v = this.vehicules[i]
        this.myMarkers[i].setLatLng([v.lat, v.lng])
        this.myMarkers[i].setIcon(this.tools.myIcon(v, v.statusCode, v.icon, true))
        this.myMarkers[i].setPopupContent(this.tools.formatPopUpContent(v))
      }
    }
    // this.cluster.refreshClusters()
    this.center()
  }

  centerMap() {
    let bounds = this.myMarkers.map((e) => {
      return e.getLatLng()
    })
    this.map.fitBounds(bounds)
  }

  center() {
    if (this.myMarkers.length > 0) {
      this.map.setView(this.myMarkers[0].getLatLng())
    }
  }

  invalidate() {
    this.map?.invalidateSize(true)
  }

  initTimer() {
    this.interTimer = setInterval(() => {
      this.exp = this.exp - 1      
    }, 1000)
  }
  
  ngOnDestroy(): void {
    this.destroy()
  }

  destroy() {
    if (this.inter) {
      clearInterval(this.inter);
      this.inter = null;
    }
    if (this.interTimer) {
      clearInterval(this.interTimer);
      this.interTimer = null;
    }
  }
}