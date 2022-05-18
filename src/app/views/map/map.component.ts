import { AfterViewInit, Component, OnInit } from '@angular/core'
import { interval, Observable, Subscriber } from 'rxjs';
import { VehiculeService } from 'src/app/views/map/vehicule.service'

import * as L from 'leaflet'
import * as K from 'leaflet-marker-rotation'

import { Vehicule } from '../../models/vehicule'
import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { getTime } from 'date-fns';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})



export class MapComponent implements AfterViewInit {

  map: any
  car = {
    lat: 33.5,
    lng: -7.75
  }
  marker: any
  markers: K.RotatedMarker[] = []
  vehicules: Vehicule[] = []

  inter: any

  // myIcon = L.icon({
  //   iconSize: [25, 41],
  //   iconAnchor: [10, 41],
  //   popupAnchor: [2, -40],
  //   iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  //   shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
  // })

  selectedVehiculeIndex = -1


  angle = 0

  animatedMarker: any

  constructor(private vehiculeService: VehiculeService) { }

  ngAfterViewInit() {
    this.loadData()

    setTimeout(() => {
      this.createMap()
      this.inter = setInterval(() => {
        this.loadData()
      }, 5000)

      // setTimeout(() => {
      //   clearInterval(this.inter)
      // }, 10000);
    }, 100);
  }

  createMap() {
    const testCoord = {
      lat: 33.589886,
      lng: -7.603869
    }

    const zoomLevel = 12
    this.map = L.map('map', { attributionControl: false, inertia: true }).setView([this.car.lat, this.car.lng], zoomLevel)

    // https://leaflet-extras.github.io/leaflet-providers/preview/
    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    mainLayer.addTo(this.map)

  }

  myIcon(vehicule: any, status: number, vehiculeType: string) {
    let icon = status == 61714 ? `assets/img/vehicules/${vehiculeType}/blue150b2.png` : `assets/img/vehicules/${vehiculeType}/red1502.png`
    return L.divIcon({
      html: `<img class="my-icon-img" src="${icon}"><span class="my-icon-title">${vehicule.name}</span>`,
      iconSize: [30, 80],
      className: 'marker-transition my-div-icon'
    })
  }

  initMarkers() {
    this.vehicules.forEach((veh, index) => {
      this.markers.push(
        new K.RotatedMarker([veh.lat, veh.lng], {
          rotationAngle: veh.heading,
          rotationOrigin: "center",
          icon: this.myIcon(veh, veh.statusCode, 'car')
        }).bindPopup(`` +
          `<div>Device: ${veh.name}</div>` +
          `<div>Speed: ${veh.speed} Km/h</div>` +
          `<div>Status: ${veh.statusCode} </div>` +
          `<div>Heading: ${veh.heading} </div>` +
          `<div>Fuel Level: ${veh.fuelLevel * 100}%</div>`, {
          closeButton: false,
          offset: L.point(0, -20)

        }).on('dblclick', () => {
          console.log('double clicked : ' + index);
          this.selectedVehiculeIndex = index
          this.map.setView(this.markers[this.selectedVehiculeIndex].getLatLng(), 15)
        }).on('mouseover', (event) => {
          event.target.openPopup()
        }).on('mouseout', (event) => {
          event.target.closePopup()
        })
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
    this.markers.forEach(marker => {
      marker.getLatLng()
    })

    for (let i = 0; i < this.markers.length; i++) {
      if (this.vehicules[i]) {
        this.markers[i].setLatLng([this.vehicules[i].lat, this.vehicules[i].lng])
        this.markers[i].setRotationAngle(this.vehicules[i].heading)
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

    // let bounds = this.markers.map((e) => {
    //   return e.getLatLng()
    // })
    // this.map.fitBounds(bounds)
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
}
