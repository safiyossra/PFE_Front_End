import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { util } from '../../../tools/utils'
import { ZoneService } from '../../../services/zone.service'
import * as L from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
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
  searchedPosition = {
    address: "",
    lat: 35.75,
    lng: -5.83,
  }
  // myZone: any
  isTrajetDrew = false

  startAddress: any = "";
  endAddress: any = "";
  startPosition: any = "";
  endPosition: any = "";
  distanceItineraire: string = "";
  dureeItineraire: string = "";
  marker;
  clearZoneFromMap() {
    // if (this.myZone && this.map.hasLayer(this.myZone)) {
    //   this.myZone.removeFrom(this.map)
    // }
  }

  onPoiChange(ev: any) {
    this.clearZoneFromMap()

    console.log('this is a poi', ev)
    if (this.selectedType == 'poi') {
      // this.myZone.setLatLng(ev.latLngs[0])
      // this.myZone.setRadius(ev.radius)
      // this.myZone.addTo(this.map)
      // this.map.fitBounds(this.myZone)
    }
  }
  // ---------------- Zones ------------------
  constructor(private tools: util, private zoneService: ZoneService) {
  }

  ngOnInit(): void {
    this.loadPOIs()
  }

  loadPOIs() {
    this.zoneService.getPoi().subscribe({
      next: (res: any) => {
        var POIs = []
        res.map((e: any) => {
          var poi = { name: e.description, val: { lat: e.latitude1, lng: e.longitude1 } }
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
    // this.resetZoneForm()
    switch (event.value) {
      case 'poi':
        // if (this.myZone && this.map.hasLayer(this.myZone)) {
        //   this.myZone.removeFrom(this.map)
        // }
        // let centerPoint = L.latLng(this.zone.value.points[0][0], this.zone.value.points[0][0])
        // this.myZone = L.marker(centerPoint, { icon: L.icon({ iconUrl: 'assets/img/markers/pin_n.png', iconSize: [50, 50], iconAnchor: [25, 50] }) })
        break;

      case 'poc':
        // if (this.myZone && this.map.hasLayer(this.myZone)) {
        //   this.myZone.removeFrom(this.map)
        // }

        // this.zone.patchValue({
        //   radius: 500
        // })

        // let centerCircle = L.latLng(this.zone.value.points[0][0], this.zone.value.points[0][0])
        // this.myZone = L.circle(centerCircle, { color: this.zone.value.color })
        break;
      default:
        // console.log('default selected');
        // if (this.myZone && this.map.hasLayer(this.myZone)) {
        //   this.myZone.removeFrom(this.map)
        // }

        break;
    }
  }

  resetZonePoint(pointIndex: number) {
    // this.zonePoints.controls[pointIndex].patchValue({
    //   latitude: null,
    //   longitude: null,
    // })
  }

  createMap() {
    const zoomLevel = 12
    this.map = L.map('map', { attributionControl: false, zoomControl: false, markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true })
      .setView([this.default.latitude, this.default.longitude], zoomLevel)

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
      // position: "topleft",
      // retainZoomLevel: false, // optional: true|false  - default false
      // animateZoom: true, // optional: true|false  - default true
      autoClose: true, // optional: true|false  - default false
      searchLabel: 'Entrer address', // optional: string      - default 'Enter address'
      // keepResult: false, // optional: true|false  - default false
      // updateMap: true, // optional: true|false  - default true
    });

    // const searchControl2 = GeoSearchControl({
    //   provider: provider,
    //   retainZoomLevel: false, // optional: true|false  - default false
    //   animateZoom: true, // optional: true|false  - default true
    //   autoClose: false, // optional: true|false  - default false
    //   searchLabel: 'Entrer address', // optional: string      - default 'Enter address'
    //   keepResult: false, // optional: true|false  - default false
    //   updateMap: true, // optional: true|false  - default true
    // });
    this.map.addControl(searchControl);

    ////////////////////////////////////////////////////////////
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);

    L.control.scale().addTo(this.map);

    // this.initMarkers()

    this.map.doubleClickZoom.disable();
    this.map.on('dblclick', (event) => {
      // this.selectedPoi = -1
      // switch (this.selectedType) {
      //   case 'point':
      //     this.generatePoint(event.latlng)

      //     break;
      //   case 'circle':
      //     this.generateCircle(event.latlng)
      //     break;
      //   case 'polygon':
      //     this.generatePolygon(event.latlng)
      //     break;

      //   default:
      //     break;
      // }
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
        this.startAddress = this.searchedPosition.address;
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

  // initMarkers() {
  //   var points = this.zone.value.points

  //   points.forEach(p => {
  //     let marker = L.marker(L.latLng(p.latitude, p.longitude), { draggable: true })
  //     marker.on('dragend', function (event) {
  //       var marker = event.target;
  //       var position = marker.getLatLng();
  //       marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
  //     });
  //     this.myMarkers.push(marker)
  //   })

  //   console.log(this.myMarkers);

  // }

  public onAddresseChange(address: any) {
    //setting address from API to local variable
    console.log(address);
    this.provider.search({ query: address }).then(function (result) {
      // do something with result;
      console.log("result");
      console.log(result);
    });
  }
}
