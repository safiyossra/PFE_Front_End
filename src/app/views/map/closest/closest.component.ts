import { DataService } from 'src/app/services/data.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { util } from '../../../tools/utils'
import { ZoneService } from '../../../services/zone.service'
import * as L from 'leaflet'
import 'leaflet-routing-machine';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { Vehicule } from 'src/app/models/vehicule';
import { Router } from '@angular/router';
import { Zone, ZoneType } from './../../../models/zone'

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
    },
    {
      name: 'Vehicules',
      val: 'vehicules'
    }
  ]
  radius = 1000
  radiusOptions: Number[] = [500, 1000, 1500, 2000, 4000, 6000, 10000, 20000];
  selectedType = 'poc'
  POIs = []
  selectedPoi = []

  vehicules = []
  selectedVehicule: any;

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
  directionControl: any

  // ---------------- Zones ------------------
  constructor(private dataService: DataService, private tools: util, private zoneService: ZoneService, private vehiculeService: VehiculeService, private fb: FormBuilder, private router: Router) {
    this.POIForm = fb.group({
      radius: new FormControl(this.radius)
    })
  }

  ngOnInit(): void {
    this.loadZones()
    this.loadVehicules()
    this.radiusChange()
  }

  // loadPOIs() {
  //   var route = this.router
  //   this.zoneService.getPoi().subscribe({
  //     next: (res: any) => {
  //       var POIs = []
  //       res.forEach((e: any) => {
  //         var poi = { name: e.description, val: e.latitude1 + ';' + e.longitude1 }
  //         POIs.push(poi)
  //       });
  //       this.POIs = POIs
  //       // console.log(this.POIs);

  //     }, error(err) {
  //       if (err.status == 401) {
  //         route.navigate(['login'], { queryParams: { returnUrl: route.url } });
  //       }
  //     }
  //   })

  // }

  loadZones() {
    this.zoneService.getData().subscribe({
      next: (res: any) => {
        var zones: Zone[] = []
        var POIs = []
        res.forEach((e: any) => {
          if (e.isActive = 1) {
            var zone = new Zone()
            zone.description = e.description
            zone.isActive = e.isActive
            zone.iconName = e.iconName
            zone.radius = e.radius
            zone.zoneType = e.zoneType
            zone.latitude1 = e.latitude1
            zone.longitude1 = e.longitude1
            zone.latitude2 = e.latitude2
            zone.longitude2 = e.longitude2
            zone.latitude3 = e.latitude3
            zone.longitude3 = e.longitude3
            zone.latitude4 = e.latitude4
            zone.longitude4 = e.longitude4
            zone.latitude5 = e.latitude5
            zone.longitude5 = e.longitude5
            zone.latitude6 = e.latitude6
            zone.longitude6 = e.longitude6
            zone.latitude7 = e.latitude7
            zone.longitude7 = e.longitude7
            zone.latitude8 = e.latitude8
            zone.longitude8 = e.longitude8
            zone.latitude9 = e.latitude9
            zone.longitude9 = e.longitude9
            zone.latitude10 = e.latitude10
            zone.longitude10 = e.longitude10
            zones.push(zone)
            var val = e.latitude1 + ';' + e.longitude1;
            if (zone.zoneType == ZoneType.Polygon) {
              var lg = this.tools.computeCentroid(zone.latLngs)
              val = lg.lat + ';' + lg.lng
            }
            var poi = { name: e.description, val: val,type:zone.zoneType }
            POIs.push(poi)
          }
        });
        this.POIs = POIs
      }, error(err) {
        console.log(err);
      }
    })

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMap()
    }, 100)
  }

  onTypeChange(event: any) {
    this.clearZoneFromMap()
    this.searchedPosition = { address: "", lat: null, lng: null }
    this.selectedVehicule = null;
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
      if (this.selectedType == 'poc') {
        this.clearZoneFromMap()
        if (ev.latlng.lat != null) {
          this.searchedPosition = { address: "", lat: ev.latlng.lat, lng: ev.latlng.lng }
          this.paintZone(this.searchedPosition, this.selectedType.valueOf() == 'vehicules')
        } else {
          this.searchedPosition = { address: "", lat: null, lng: null }
        }
      }
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

  drawDirection(lat, lng) {
    this.clearRoutesFromMap()

    if (this.searchedPosition.lat != null && this.searchedPosition.lng != null) {
      this.directionControl.setWaypoints([
        L.latLng(this.searchedPosition.lat, this.searchedPosition.lng),
        L.latLng(lat, lng)
      ])
    }

    this.directionControl.addTo(this.map)
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

  paintZone(position: any, veh: boolean) {
    let centerPoint = L.latLng(position.lat, position.lng)
    let m = L.marker(centerPoint, { icon: veh ? this.tools.myIcon(this.selectedVehicule, this.selectedVehicule.statusCode, this.selectedVehicule.icon) : L.icon({ iconUrl: 'assets/img/markers/pin_n.png', iconSize: [50, 50], iconAnchor: [25, 50] }) })
      .bindPopup(veh ? this.tools.formatPopUpContent(this.selectedVehicule) : `<div><strong>Addresse</strong>: ${position.address}</div>`,
        veh ? {
          closeButton: false,
          offset: L.point(0, -20)
        } :
          {
            closeButton: false,
            offset: L.point(0, -20)
          })

    var circle = L.circle(centerPoint, { radius: this.radius, color: '#20a8d8', opacity: .8, weight: 2 })
    this.myZone = L.layerGroup([circle, m])
    this.myZone.addTo(this.map)
    this.map.fitBounds(circle.getBounds())
  }

  onAddresseChange(e: any) {
    this.clearZoneFromMap()
    if (e != null) {
      this.searchedPosition = { address: e.label, lat: e.y, lng: e.x }
      this.paintZone(this.searchedPosition, false)
    } else {
      this.searchedPosition = { address: "", lat: null, lng: null }
    }
  }

  radiusChange() {
    this.POIForm.controls['radius'].valueChanges.subscribe(val => {
      this.radius = val
      this.clearZoneFromMap()
      if (this.searchedPosition.lat != null && this.searchedPosition.lng != null) {
        this.paintZone(this.searchedPosition, this.selectedType == 'vehicules')
      }
    })
  }

  clearZoneFromMap() {
    if (this.myZone && this.map.hasLayer(this.myZone)) {
      this.myZone.removeFrom(this.map)
    }
    this.clearRoutesFromMap()
    this.clearMarkersFromMap()
  }

  clearMarkersFromMap() {
    this.myMarkers = []
    if (this.layerMarkers && this.map.hasLayer(this.layerMarkers)) {
      this.layerMarkers.removeFrom(this.map)
    }
  }

  loadVehicules() {
    var route = this.router
    this.dataService.getVehicule("?extra=true").subscribe({
      next: (res) => {
        this.vehicules = res as [];
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  onVehiculeChange(ev: any) {
    if (this.selectedType == 'vehicules') {
      this.clearZoneFromMap()
      if (ev != null) {
        var route = this.router
        this.vehiculeService.getData("extra=true&d=" + ev).subscribe({
          next: (res) => {
            let device = res['DeviceList'][0]

            let l = device.EventData.length - 1 ?? -1
            if (l > -1) {
              const vData = device.EventData[l]
              this.selectedVehicule = new Vehicule(device["Device"] ?? "", device["Device_desc"] ?? "", vData['Timestamp'] ?? 0, vData["StatusCode"]?.toString(), vData["Address"] ?? "",
                vData["Odometer"] ?? "", vData["acceleration"] ?? "", device["SimCard"] ?? "", device["DeviceCode"] ?? "", vData["GPSPoint_lat"] ?? 0,
                vData["GPSPoint_lon"] ?? 0, vData['Heading'] ?? 0, vData['Speed'] ?? 0, device['Icon'], device['FuelLevel'] ?? 0)

              this.searchedPosition = { address: this.selectedVehicule.address, lat: this.selectedVehicule.lat, lng: this.selectedVehicule.lng }
              this.paintZone(this.searchedPosition, true)
            }
            else
              this.searchedPosition = { address: "", lat: null, lng: null }

            // console.log(this.selectedVehicule);
          }, error(err) {
            if (err.status == 401) {
              route.navigate(['login'], { queryParams: { returnUrl: route.url } });
            }
          }
        })

      } else
        this.searchedPosition = { address: "", lat: null, lng: null }
    }
  }

  onPoiChange(ev: any) {
    if (this.selectedType == 'poi') {
      this.clearZoneFromMap()
      if (ev != null) {
        let latlng = ev.split(';')
        this.searchedPosition = { address: "", lat: Number.parseFloat(latlng[0]), lng: Number.parseFloat(latlng[1]) }
        this.paintZone(this.searchedPosition, false)
      } else {
        this.searchedPosition = { address: "", lat: null, lng: null }
      }
    }
  }

  showClosest() {
    this.clearMarkersFromMap()
    if (this.searchedPosition.lat != null && this.searchedPosition.lng != null && this.radius > 2) {
      this.loading = true

      var route = this.router
      this.vehiculeService.getData().subscribe({
        next: (res) => {
          const data = res['DeviceList']
          // console.log(data);

          let vehicules = []
          data.forEach(e => {
            let l = e['EventData'].length - 1 ?? -1
            if (l > -1) {
              const vData = e['EventData'][l]

              if (this.selectedType != 'vehicules')
                vehicules.push(
                  new Vehicule(e["Device"] ?? "", e["Device_desc"] ?? "", vData['Timestamp'] ?? 0, vData["StatusCode"]?.toString(), vData["Address"] ?? "",
                    vData["Odometer"] ?? "", vData["acceleration"] ?? "", e["SimCard"] ?? "", e["DeviceCode"] ?? "", vData["GPSPoint_lat"] ?? 0,
                    vData["GPSPoint_lon"] ?? 0, vData['Heading'] ?? 0, vData['Speed'] ?? 0, e['Icon'], e['FuelLevel'] ?? 0)
                );
              else if (e["Device"] != this.selectedVehicule.id)
                vehicules.push(
                  new Vehicule(e["Device"] ?? "", e["Device_desc"] ?? "", vData['Timestamp'] ?? 0, vData["StatusCode"]?.toString(), vData["Address"] ?? "",
                    vData["Odometer"] ?? "", vData["acceleration"] ?? "", e["SimCard"] ?? "", e["DeviceCode"] ?? "", vData["GPSPoint_lat"] ?? 0,
                    vData["GPSPoint_lon"] ?? 0, vData['Heading'] ?? 0, vData['Speed'] ?? 0, e['Icon'], e['FuelLevel'] ?? 0)
                );
            }
          });

          // console.log(vehicules);
          this.createMarkers(vehicules)
        }, error(err) {
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
      })
    }
  }

  createMarkers(vehicules: any) {
    vehicules.forEach((veh, index) => {
      if (this.isClose(veh.lat, veh.lng)) {
        this.myMarkers.push(
          L.marker([veh.lat, veh.lng], {
            icon: this.tools.myIcon(veh, veh.statusCode, veh.icon),
          })
            .bindPopup(this.tools.formatPopUpContent(veh), {
              closeButton: false,
              offset: L.point(0, -20)

            }).on('click', (event) => {
              this.drawDirection(veh.lat, veh.lng)
              // this.markerClicked([veh.lat, veh.lng])
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

  invalidate() {
    this.map?.invalidateSize(true)
  }

  markerClicked(p: any) {
    console.log(p);
  }

  isClose(lat: any, lng: any) {
    let distance = this.getDistanceBetweenPoints({ lat: lat, lng: lng }, { lat: this.searchedPosition.lat, lng: this.searchedPosition.lng })
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
