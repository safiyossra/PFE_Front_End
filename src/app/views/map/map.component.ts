import { AfterViewInit, Component, OnInit, HostListener, Inject, Input } from '@angular/core'
import { VehiculeService } from 'src/app/services/vehicule.service'
import { util } from '../../tools/utils'
import * as L from 'leaflet'

import { Vehicule } from '../../models/vehicule'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})


export class MapComponent implements AfterViewInit {


  @Input() showFullScreenControle?: Boolean = true
  @Input() showPositionControle?: Boolean = true
  isMyPositionVisible: Boolean = false
  MyPositionMarker: L.Marker
  map: any
  car = {
    lat: 35.75,
    lng: -5.83
  }
  marker: any
  markers: L.Marker[] = []
  vehicules: Vehicule[] = []

  fullScreenControl: L.Control;
  resetControl: L.Control;
  positionControl: L.Control;
  typesCount = [0, 0, 0, 0]

  inter: any

  selectedVehiculeIndex = -1


  angle = 0

  animatedMarker: any

  constructor(private vehiculeService: VehiculeService, private tools: util) {
  }

  ngAfterViewInit() {
    this.loadData()
    setTimeout(() => {
      this.createMap()
      this.inter = setInterval(() => {
        this.loadData()
      }, 10000)
      // setInterval(() => {
      //   this.updateMarkers()
      // }, 500);
    }, 100);
  }


  createMap() {
    const zoomLevel = 12
    this.map = L.map('map', { attributionControl: false, zoomControl: false, markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true })
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

    let ResetControl = L.Control.extend({
      onAdd(map: L.Map) {
        return L.DomUtil.get('resetConrtol');
      },
      onRemove(map: L.Map) { }
    });
    this.resetControl = new ResetControl({
      position: "topleft"
    }).addTo(this.map);

    L.control.zoom().addTo(this.map)

    if (this.showFullScreenControle) {
      let FullScreenControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('fullScreenControl');
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

    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);
    L.control.scale().addTo(this.map);
  }

  myIcon(vehicule: any, status: number, vehiculeType: string) {
    let icon = status == 61714 ? `assets/img/vehicules/${vehiculeType}/blue_final.png` : `assets/img/vehicules/${vehiculeType}/red_final.png`
    return L.divIcon({
      html: `<div class="center-marker"></div>` +
        `<img class="my-icon-img rotate-${Math.round(vehicule.heading)}" src="${icon}">` +
        `<span class="my-icon-title">${vehicule.name}</span>`,
      iconSize: [50, 50],
      // iconAnchor: [25, 20],
      className: 'marker-transition my-div-icon',

    })
  }

  initMarkers() {
    this.vehicules.forEach((veh, index) => {
      this.markers.push(
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
            this.rowClicked(index)
          })
        // .on('mouseout', (event) => {
        //   event.target.closePopup()
        // })
      )
    });

    if (this.map) {
      this.centerMap()
      L.layerGroup(this.markers).addTo(this.map)
    } else {
      let inter = setInterval(() => {
        if (this.map) {
          this.centerMap()
          L.layerGroup(this.markers).addTo(this.map)
          clearInterval(inter)
        }
      }, 100)
    }


  }

  updateMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.vehicules[i]) {
        this.markers[i].setLatLng([this.vehicules[i].lat, this.vehicules[i].lng])
        // this.markers[i].setRotationAngle(this.vehicules[i].heading)
        this.markers[i].setIcon(
          this.myIcon(this.vehicules[i], this.vehicules[i].statusCode, 'car')
        )
        this.markers[i].setPopupContent(`` +
          `<div>Device: ${this.vehicules[i].name}</div>` +
          `<div>Speed: ${this.vehicules[i].speed} Km/h</div>` +
          `<div>Status: ${this.vehicules[i].statusCode} </div>` +
          `<div>Heading: ${this.vehicules[i].heading} </div>` +
          `<div>Fuel Level: ${this.vehicules[i].fuelLevel * 100}%</div>` +
          ``
        )
      }
    }
    this.center()
  }

  reset() {
    this.selectedVehiculeIndex = -1
    const elems = document.getElementsByClassName('my-div-icon')

    for (let index = 0; index < elems.length; index++) {
      elems.item(index).classList.remove('marker-transition')
    }
    this.centerMap()
  }

  loadData() {
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


        const isFirstTime = this.vehicules.length == 0
        this.vehicules = vehicules
        vehicules = []
        if (isFirstTime) {
          this.initMarkers()
        } else {
          this.updateMarkers()
        }
      }
    })
    this.setTypesCount()
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
      return e.getLatLng()
    })
    this.map.fitBounds(bounds)
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
          this.centerMap()
          positionCtl.classList.replace("icon-close", "icon-target")
        }
      }, null, options)
    }
  }

  rowClicked(event) {
    const elems = document.getElementsByClassName('my-div-icon')

    for (let index = 0; index < elems.length; index++) {
      elems.item(index).classList.remove('marker-transition')
    }

    this.selectedVehiculeIndex = event
    this.map.setView(this.markers[this.selectedVehiculeIndex].getLatLng(), 15)

  }

  rowDoubleClicked(event) {
    const elems = document.getElementsByClassName('my-div-icon')

    for (let index = 0; index < elems.length; index++) {
      elems.item(index).classList.remove('marker-transition')
    }

    this.selectedVehiculeIndex = event
    this.map.setView(this.markers[this.selectedVehiculeIndex].getLatLng(), 15)

    // for (let index = 0; index < elems.length; index++) {
    //   elems.item(index).classList.add('marker-transition')
    // }
  }
}
