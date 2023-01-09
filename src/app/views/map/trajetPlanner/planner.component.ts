import { DataService } from 'src/app/services/data.service';
import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { util } from '../../../tools/utils'
import { ZoneService } from '../../../services/zone.service'
import * as L from 'leaflet'
import 'leaflet-routing-machine';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { FormBuilder } from '@angular/forms';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { Router } from '@angular/router';

interface IItemGPS {
  gps: string;
  val: string;
}
@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit, AfterViewInit {

  provider = new OpenStreetMapProvider();
  @Input() showFullScreenControle?: Boolean = true
  @Input() showPositionControle?: Boolean = true
  // ---------------- MAP -----------------
  isMyPositionVisible: Boolean = false
  MyPositionMarker: L.Marker
  map: any
  default = {
    latitude: 35.75,
    longitude: -5.83,
  }
  fullScreenControl: L.Control;
  positionControl: L.Control;
  // radius = 1000
  // radiusOptions: Number[] = [500, 1000, 1500, 2000, 4000, 6000, 10000, 20000];
  POIs = []
  selectedPois = []
  selectedPOI: any

  myMarkers = []
  // POIForm: FormGroup

  layerMarkers: any
  isTrajetDrew = false
  loading = false

  directionControl: any
  gpsPoi: IItemGPS[] = [
  ];
  // ---------------- Zones ------------------
  constructor(private dataService: DataService, private tools: util, private zoneService: ZoneService, private vehiculeService: VehiculeService, private fb: FormBuilder, private router: Router) {
    // this.POIForm = fb.group({
    //   radius: new FormControl(this.radius)
    // })
  }
  @HostListener('document:click', ['$event'])
  handledeleteGPSClick(e: MouseEvent) {
    const target = e.srcElement || e.target;
    if ((<Element>target).classList.contains('deleteGPS')) {
      // console.log(target);
      var gps = (<Element>target).getAttribute("data-gps")
      this.deleteGPSPOI2(gps)
    }
  }

  ngOnInit(): void {
    L.Icon.Default.imagePath = "assets/"
    this.loadPOIs()
    // this.radiusChange()
  }

  loadPOIs() {
    var route = this.router
    this.zoneService.getPoi().subscribe({
      next: (res: any) => {
        var POIs = []
        res.map((e: any) => {
          var poi = { name: e.description, val: e.latitude1 + ';' + e.longitude1 }
          POIs.push(poi)
        });
        this.POIs = POIs
        // console.log(this.POIs);
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMap()
    }, 100)
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
    this.map.on('baselayerchange', (e) => {
      this.tools.setMapType(e.name)
    })
    this.map.doubleClickZoom.disable();
    this.map.on('dblclick', (ev) => {
      this.addPOI2gpsPOI(ev.latlng.lat + ";" + ev.latlng.lng)
    })

    // -------------------------------------------- ROUTING ---------------------------------------
    this.directionControl = L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: `http://router.project-osrm.org/route/v1/`,
        language: 'fr'
      }),
      showAlternatives: true,
      lineOptions: { styles: [{ color: 'black', weight: 9, stroke: true, opacity: .15 }, { color: 'white', weight: 6, stroke: true, opacity: .8 }, { color: 'blue', weight: 3, stroke: true, opacity: 1 }], extendToWaypoints: true, missingRouteTolerance: 0 },
      altLineOptions: { styles: [{ color: 'black', weight: 9, stroke: true, opacity: .15 }, { color: 'white', weight: 6, stroke: true, opacity: .8 }, { color: 'red', weight: 2, stroke: true, opacity: 1 }], extendToWaypoints: true, missingRouteTolerance: 0 },
      show: true,
      addWaypoints: false,
      routeWhileDragging: false,
      plan: L.Routing.plan([], {
        draggableWaypoints: false,
        routeWhileDragging: false,
        createMarker: function () { return null; },
      }),
    })

  }

  clearRoutesFromMap() {
    this.directionControl?.remove()
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

  // radiusChange() {
  //   this.POIForm.controls['radius'].valueChanges.subscribe(val => {
  //     this.radius = val
  //     console.log("radiusChange");
  //   })
  // }

  onPoiChange(ev: any) {
    this.selectedPOI = ev
  }

  centerMap() {
    let bounds = this.myMarkers.map((e) => {
      return e.getLatLng()
    })
    this.map.fitBounds(bounds)
  }

  invalidate() {
    this.map?.invalidateSize(true)
  }

  getDistanceBetweenPoints(l1: any, l2: any) {
    var p = 0.017453292519943295;
    var a = 0.5 -
      Math.cos((l2.lat - l1.lat) * p) / 2 +
      Math.cos(l1.lat * p) *
      Math.cos(l2.lat * p) *
      (1 - Math.cos((l2.lng - l1.lng) * p)) /
      2;
    return 1000 * 12742 * Math.asin(Math.sqrt(a));
  }

  addGPSPOI() {
    if (this.selectedPOI != undefined)
      this.addPOI2gpsPOI(this.selectedPOI)
  }

  addPOI2gpsPOI(v) {
    if (!this.gpsPOIexists(v)) {
      var name = this.getPOIbyVal(v)
      var gps = { gps: v, val: name }
      this.gpsPoi = [...this.gpsPoi, gps];
    }
    this.drawMarkers()
    // console.log(this.gpsPoi);
  }

  deleteGPSPOI(v) {
    var gps = v.initData.gps
    this.gpsPoi = this.gpsPoi.filter(v => v.gps !== gps);
    this.drawMarkers()
  }

  deleteGPSPOI2(gps) {
    this.gpsPoi = this.gpsPoi.filter(v => v.gps !== gps);
    this.drawMarkers()
  }

  gpsPOIexists(v) {
    for (var i = 0; i < this.gpsPoi.length; i++) {
      if (this.gpsPoi[i].gps == v) {
        return true;
      }
    }
    return false;
  }

  onPointClick(v) {
    var gps = v.initData.gps.split(";")
    this.map.fitBounds([[gps[0], gps[1]]])
  }

  getPOIbyVal(v) {
    var gps = v.split(";");
    var desc = gps[0].substring(0, 9) + ";" + gps[1].substring(0, 9)
    for (var i = 0; i < this.POIs.length; i++) {
      if (this.POIs[i].val == v) {
        desc = this.POIs[i].name + " | " + desc;
        break;
      }
    }
    return desc;
  }

  drawMarkers() {
    this.clearMarkersFromMap()
    this.gpsPoi.forEach((e) => {
      var gps = e.gps.split(";")
      this.myMarkers.push(
        L.marker([Number.parseFloat(gps[0]), Number.parseFloat(gps[1])])
          .bindPopup(this.tools.formatPopUpContentPOI(e.val, e.gps), {
            closeButton: false,
            offset: L.point(0, -2)
          }))
    });
    if (this.map) {
      // this.centerMap()
      this.layerMarkers = L.layerGroup(this.myMarkers)
      this.layerMarkers.addTo(this.map)
    } else {
      let inter = setInterval(() => {
        if (this.map) {
          // this.centerMap()
          this.layerMarkers = L.layerGroup(this.myMarkers)
          this.layerMarkers.addTo(this.map)
          clearInterval(inter)
        }
      }, 100)
    }
    this.invalidate()
  }

  clearMarkersFromMap() {
    this.myMarkers = []
    if (this.layerMarkers && this.map.hasLayer(this.layerMarkers)) {
      this.layerMarkers.removeFrom(this.map)
    }
  }

  sortableChanged(e) {
    this.drawDirection()
  }

  drawDirection() {
    this.clearRoutesFromMap()
    if (this.gpsPoi.length > 1) {
      var latlngs = this.gpsPoi.map((v) => {
        var gps = v.gps.split(";")
        return L.latLng(Number.parseFloat(gps[0]), Number.parseFloat(gps[1]))
      })
      this.directionControl.setWaypoints(latlngs)
      this.directionControl.addTo(this.map)
    }
  }
}
