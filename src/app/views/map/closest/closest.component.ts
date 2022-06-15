import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { util } from '../../../tools/utils'
import { ZoneService } from '../../../services/zone.service'
import * as L from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { Vehicule } from 'src/app/models/vehicule';

@Component({
  selector: 'app-closest',
  templateUrl: './closest.component.html',
  styleUrls: ['./closest.component.scss']
})
export class ClosestComponent implements OnInit, AfterViewInit {

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
  resetControl: L.Control;
  positionControl: L.Control;
  modeTypes = [
    {
      name: 'Position sur la carte',
      val: 'poc'
    },
    {
      name: 'Point d\'intérêt',
      val: 'poi'
    }
  ]
  radius = 1000
  selectedType = 'poc'
  POIs = []
  selectedPoi = []
  myMarkers = []
  selectedVehicleIndex: -1;
  POIForm: FormGroup
  searchedPosition = { address: "", lat: null, lng: null }

  myZone: any
  layerMarkers: any
  isTrajetDrew = false
  loading = false

  startAddress: any = "";
  endAddress: any = "";
  startPosition: any = "";
  endPosition: any = "";
  distanceItineraire: string = "";
  dureeItineraire: string = "";
  // ---------------- Zones ------------------
  constructor(private tools: util, private zoneService: ZoneService, private vehiculeService: VehiculeService, private fb: FormBuilder) {
    this.POIForm = fb.group({
      radius: new FormControl(this.radius)
    })
  }

  ngOnInit(): void {
    this.loadPOIs()
    this.radiusChange()
  }

  loadPOIs() {
    this.zoneService.getPoi().subscribe({
      next: (res: any) => {
        var POIs = []
        res.map((e: any) => {
          var poi = { name: e.description, val: e.latitude1 + ';' + e.longitude1 }
          console.log(poi);

          POIs.push(poi)
        });
        this.POIs = POIs
      }
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMap()
    }, 100)
    // this.zoneChanges()
  }

  onTypeChange(event: any) {
    this.clearZoneFromMap()
    this.searchedPosition = { address: "", lat: null, lng: null }
    // switch (event.value) {
    //   case 'poi':

    //     break;

    //   case 'poc':

    //     break;
    //   default:
    //     break;
    // }
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
    const searchControl = GeoSearchControl({
      provider: this.provider,
      // showMarker: true,
      // style: 'bar',
      // position: "topleft",
      // retainZoomLevel: false, // optional: true|false  - default false
      // animateZoom: true, // optional: true|false  - default true
      // autoClose: true, // optional: true|false  - default false
      searchLabel: 'Entrez une adresse', // optional: string      - default 'Enter address'
      // keepResult: false, // optional: true|false  - default false
      updateMap: false, // optional: true|false  - default true
    });
    searchControl.addTo(this.map)

    ////////////////////////////////////////////////////////////
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);

    L.control.scale().addTo(this.map);

    // this.initMarkers()

    this.map.doubleClickZoom.disable();
    this.map.on('dblclick', (ev) => {
      if (this.selectedType == 'poc') {
        this.clearZoneFromMap()
        if (ev.latlng.lat != null) {
          this.searchedPosition = { address: "", lat: ev.latlng.lat, lng: ev.latlng.lng }
          this.paintZone(this.searchedPosition)
        } else {
          this.searchedPosition = { address: "", lat: null, lng: null }
        }
      }
    })

  }

  drawDirection() {
    if (this.selectedVehicleIndex != -1) {
      let lat = this.myMarkers[this.selectedVehicleIndex].lat;
      let lng = this.myMarkers[this.selectedVehicleIndex].lng;
      if (
        this.endPosition &&
        lat == this.endPosition.lat &&
        lng == this.endPosition.lng &&
        this.isTrajetDrew
      ) {
        this.isTrajetDrew = !this.isTrajetDrew;
      } else {
        this.isTrajetDrew = true;
        this.endPosition = { lat: lat, lng: lng };
        // this.startAddress = this.searchedPosition.address;
      }
    }
  }

  clearDirection() {


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

  paintZone(position: any) {
    let centerPoint = L.latLng(position.lat, position.lng)
    let m = L.marker(centerPoint, { icon: L.icon({ iconUrl: 'assets/img/markers/pin_n.png', iconSize: [50, 50], iconAnchor: [25, 50] }) }).
      bindPopup(`<div><strong>Addresse</strong>: ${position.address}</div>`, { closeButton: false, offset: L.point(0, -20) })
    var circle = L.circle(centerPoint, { radius: this.radius, color: '#20a8d8', opacity: .8, weight: 2 })
    this.myZone = L.layerGroup([circle, m])
    this.myZone.addTo(this.map)
    this.map.fitBounds(circle.getBounds())
  }

  onAddresseChange(e: any) {
    console.log(e);
    this.clearZoneFromMap()
    if (e != null) {
      this.searchedPosition = { address: e.label, lat: e.y, lng: e.x }
      this.paintZone(this.searchedPosition)
    } else {
      this.searchedPosition = { address: "", lat: null, lng: null }
    }
  }

  radiusChange() {
    this.POIForm.controls['radius'].valueChanges.subscribe(val => {
      this.radius = val
      this.clearZoneFromMap()
      if (this.searchedPosition.lat != "" && this.searchedPosition.lng != "") {
        this.paintZone(this.searchedPosition)
      }
    })
  }

  clearZoneFromMap() {
    if (this.myZone && this.map.hasLayer(this.myZone)) {
      this.myZone.removeFrom(this.map)
    }
    this.clearMarkersFromMap()
  }

  clearMarkersFromMap() {
    this.myMarkers = []
    if (this.layerMarkers && this.map.hasLayer(this.layerMarkers)) {
      this.layerMarkers.removeFrom(this.map)
    }
  }

  onPoiChange(ev: any) {
    console.log('this is a poi', ev)
    if (this.selectedType == 'poi') {
      this.clearZoneFromMap()
      if (ev != []) {
        let latlng = ev.split(';')
        this.searchedPosition = { address: "", lat: Number.parseFloat(latlng[0]), lng: Number.parseFloat(latlng[1]) }
        this.paintZone(this.searchedPosition)
      } else {
        this.searchedPosition = { address: "", lat: null, lng: null }
      }
    }
  }

  showClosest() {
    this.clearMarkersFromMap()
    this.loading = true
    if (this.searchedPosition.lat != null && this.searchedPosition.lng != null && this.radius > 2) {
      this.vehiculeService.getData().subscribe({
        next: (res) => {
          const data = res['DeviceList']
          let vehicules = []
          data.forEach(e => {
            let l = e['EventData'].length - 1 ?? 0
            if (l > 0) {
              const vData = e['EventData'][1]
              vehicules.push(
                new Vehicule(
                  {
                    id: e["Device"] ?? "",
                    name: e["Device_desc"] ?? "",
                    timestamp: vData['Timestamp'] ?? 0,
                    statusCode: vData["StatusCode"]?.toString(),
                    lat: vData["GPSPoint_lat"] ?? 0,
                    lng: vData["GPSPoint_lon"] ?? 0,
                    heading: vData['Heading'] ?? 0,
                    speed: vData['Speed'] ?? 0,
                    fuelLevel: e['FuelLevel'] ?? 0,
                  }
                )
              )
            }
          });
          console.log(vehicules)
          this.createMarkers(vehicules)
        }
      })
    }
  }

  createMarkers(vehicules: any) {
    vehicules.forEach((veh, index) => {
      if (this.isClose(veh.lat, veh.lng)) {
        this.myMarkers.push(
          L.marker([veh.lat, veh.lng], {
            icon: this.myIcon(veh, veh.statusCode, 'car'),
          })
            .bindPopup(`` +
              `<div>Device: ${veh.name}</div>` +
              `<div>Speed: ${veh.speed} Km/h</div>` +
              `<div>Status: ${veh.statusCode} </div>` +
              `<div>Heading: ${veh.heading} </div>` +
              `<div>Fuel Level: ${veh.fuelLevel * 100}%</div>`, {
              closeButton: false,
              offset: L.point(0, -20)

            }).on('click', (event) => {
              this.markerClicked([veh.lat, veh.lng])
            }))
      }
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
    this.loading = false
  }

  centerMap() {
    let bounds = this.myMarkers.map((e) => {
      return e.getLatLng()
    })
    this.map.fitBounds(bounds)
  }

  myIcon(vehicule: any, status: number, vehiculeType: string, isSelected: boolean = false) {
    let icon = status == 61714 ? `assets/img/vehicules/${vehiculeType}/blue_final.png` : `assets/img/vehicules/${vehiculeType}/red_final.png`
    return L.divIcon({
      html: `<div class="center-marker"></div>` +
        `<img class="my-icon-img rotate-${Math.round(vehicule.heading)}" src="${icon}">` +
        `<span class="my-icon-title">${vehicule.name}</span>`,
      iconSize: [50, 50],
      // iconAnchor: [25, 20],
      className: 'marker-transition my-div-icon' + (isSelected ? ' marker-selected' : ''),

    })
  }

  invalidate() {
    this.map.invalidateSize(true)
  }

  markerClicked(p: any) {
    console.log(p);
  }

  isClose(lat: any, lng: any) {
    let distance = this.getDistanceBetweenPoints({ lat: lat, lng: lng }, { lat: this.searchedPosition.lat, lng: this.searchedPosition.lng })
    console.log(lat, lng, this.searchedPosition, distance);
    if (distance <= this.radius) {
      return true
    }
    return false
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
}
