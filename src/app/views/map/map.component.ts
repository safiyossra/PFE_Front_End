import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { VehiculeService } from 'src/app/services/vehicule.service'
import { util } from '../../tools/utils'
import * as L from 'leaflet'
import { Vehicule } from '../../models/vehicule'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Router } from '@angular/router'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})


export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() showFullScreenControle?: boolean = true
  @Input() showPositionControle?: boolean = true
  @Input() showCollapsControle?: boolean = true

  provider = new OpenStreetMapProvider();
  isFirstTime = true
  public position_left: string = "0%"
  public size = [25, 75]
  isMyPositionVisible: boolean = false
  MyPositionMarker: L.Marker
  map: any
  car = {
    lat: 35.75,
    lng: -5.83
  }
  marker: any
  markers: L.Marker[] = []
  vehicules: Vehicule[] = []
  typesCount = [0, 0, 0, 0]

  inter: any

  selectedVehiculeIndex = -1
  constructor(private vehiculeService: VehiculeService, private tools: util, private router: Router) {

  }
  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.map = this.tools.createMap(this.map, 'map', this.car, this.provider, this.showCollapsControle, this.showFullScreenControle, this.showPositionControle)
      this.inter = setInterval(() => {
        this.loadData()
      }, 5000)
    }, 100);
  }

  initMarkers() {
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
    this.center()
  }

  reset() {
    this.selectedVehiculeIndex = -1
    const elems = document.getElementsByClassName('my-div-icon')

    for (let index = 0; index < elems.length; index++) {
      elems.item(index).classList.remove('marker-transition')
      elems.item(index).classList.remove('marker-selected')
    }
    this.centerMap()
  }

  loadData() {
    var route = this.router
    this.vehiculeService.getData().subscribe({
      next: (res) => {
        const data = res['DeviceList']
        console.log("DeviceList", data);
        let vehicules = []
        data.forEach(e => {
          let l = e['EventData'].length - 1 ?? -1
          if (l > -1) {
            const vData = e['EventData'][l]
            vehicules.push(
              new Vehicule(e["Device"] ?? "", e["Device_desc"] ?? "", vData['Timestamp'] ?? 0, vData["StatusCode"]?.toString(), vData["Address"] ?? "",
                vData["Odometer"] ?? "", vData["acceleration"] ?? "", e["SimCard"] ?? "", e["DeviceCode"] ?? "", vData["GPSPoint_lat"] ?? 0,
                vData["GPSPoint_lon"] ?? 0, vData['Heading'] ?? 0, vData['Speed'] ?? 0, e['Icon'], e['FuelLevel'] ?? 0)
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

  rowClicked(event) {
    const elems = document.getElementsByClassName('my-div-icon')

    for (let index = 0; index < elems.length; index++) {
      elems.item(index).classList.remove('marker-transition')
      elems.item(index).classList.remove('marker-selected')
    }

    this.selectedVehiculeIndex = event
    elems.item(this.selectedVehiculeIndex).classList.add('marker-selected')
    this.map.setView(this.markers[this.selectedVehiculeIndex].getLatLng(), 15)
  }

  rowDoubleClicked(event) {
    const elems = document.getElementsByClassName('my-div-icon')

    for (let index = 0; index < elems.length; index++) {
      elems.item(index).classList.remove('marker-transition')
    }

    this.selectedVehiculeIndex = event
    this.map.setView(this.markers[this.selectedVehiculeIndex].getLatLng(), 15)

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

  resetSize(e) {
    this.size[0] = 25
    this.size[1] = 75
    this.invalidate()
  }
  onDragEnd(e) {
    this.size = [e.sizes[0], e.sizes[1]]
    this.invalidate()
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
}

