import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() showFullScreenControle?: Boolean = true
  @Input() showPositionControle?: Boolean = true
  // ---------------- MAP -----------------
  isMyPositionVisible: Boolean = false
  MyPositionMarker: L.Marker
  map: any

  default = {
    latitude: 35.75,
    longitude: -5.83,
    radius: 10000,
    color: '#000'
  }

  fullScreenControl: L.Control;
  resetControl: L.Control;
  positionControl: L.Control;
  // ---------------- MAP -----------------

  // ---------------- Zones ------------------
  zoneTypes = [
    {
      name: 'point',
      icon: 'fa fa-map-pin', // cil-chevron-double-down
    },
    {
      name: 'polygon',
      icon: 'fa fa-pencil-square-o', // cil-square
    },
    {
      name: 'circle',
      icon: 'fa fa-circle',
    }
  ]

  selectedType: any

  point: FormGroup
  myPoint: L.Marker

  circle: FormGroup
  myCircle: L.Circle

  polygon: FormGroup
  myPolygon: L.Polygon

  // ---------------- Zones ------------------


  constructor(private tools: util, private fb: FormBuilder) {
    this.circle = fb.group({
      latitude: new FormControl(this.default.latitude),
      longitude: new FormControl(this.default.longitude),
      radius: new FormControl(this.default.radius),
      color: new FormControl('#4dbd74'),
    })

    this.point = fb.group({
      latitude: new FormControl(this.default.latitude),
      longitude: new FormControl(this.default.longitude),
      color: new FormControl('#63c2de'),
    })

    this.polygon = fb.group({
      points: fb.array([
        this.fb.group({
          latitude: [this.default.latitude],
          longitude: [this.default.longitude]
        }),
        this.fb.group({
          latitude: [this.default.latitude + 1],
          longitude: [this.default.longitude]
        }),
        this.fb.group({
          latitude: [this.default.latitude],
          longitude: [this.default.longitude - 1]
        }),

      ]),
      color: new FormControl('#ffc107')

    })
  }

  get polygonPoints() {
    return this.polygon.controls['points'] as FormArray
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMap()
    }, 100)
    this.circleOnChanges()
    this.pointOnChanges()
    this.polygonPointOnchanges()
  }

  initShapes() {
    this.myCircle = L.circle([this.circle.value.latitude, this.circle.value.longitude], { radius: this.circle.value.radius, color: this.circle.value.color })
    this.myPoint = L.marker([this.point.value.latitude, this.point.value.longitude], { icon: L.icon({ iconUrl: 'assets/img/markers/pin_n.png', iconSize: [50, 50], iconAnchor: [25, 50] }) })
    this.myPolygon = L.polygon(this.polygonPoints.value.map(point => [point.latitude, point.longitude]))
  }

  onTypeChange(event: any) {
    console.log(event.value);
    switch (event.value) {
      case 'point':
        if (this.map.hasLayer(this.myCircle)) {
          this.myCircle.removeFrom(this.map)
        }
        if (this.map.hasLayer(this.myPolygon)) {
          this.myPolygon.removeFrom(this.map)
        }

        this.myPoint.addTo(this.map)
        this.map.setView(this.myPoint.getLatLng(), 12)

        break;

      case 'circle':
        if (this.map.hasLayer(this.myPoint)) {
          this.myPoint.removeFrom(this.map)
        }
        if (this.map.hasLayer(this.myPolygon)) {
          this.myPolygon.removeFrom(this.map)
        }

        this.myCircle.addTo(this.map)
        this.map.fitBounds(this.myCircle.getBounds())
        break;

      case 'polygon':
        console.log('polygon selected');

        if (this.map.hasLayer(this.myCircle)) {
          this.myCircle.removeFrom(this.map)
        }
        if (this.map.hasLayer(this.myPoint)) {
          this.myPoint.removeFrom(this.map)
        }

        this.myPolygon.addTo(this.map)
        // this.map.fitBounds(this.myPolygon.getBounds())
        break;

      default:
        console.log('default selected');
        if (this.map.hasLayer(this.myPoint)) {
          this.myPoint.removeFrom(this.map)
        }
        if (this.map.hasLayer(this.myPolygon)) {
          this.myPolygon.removeFrom(this.map)
        }
        if (this.map.hasLayer(this.myCircle)) {
          this.myCircle.removeFrom(this.map)
        }

        break;
    }

  }

  circleOnChanges(): void {
    this.circle.valueChanges.subscribe(val => {
      if (val.latitude != null && val.longitude != null && val.radius != null) {
        console.log('not Null');
        this.myCircle.setLatLng([val.latitude, val.longitude])
        this.myCircle.setRadius(val.radius)
        this.myCircle.setStyle({ color: val.color })
        this.map.fitBounds(this.myCircle.getBounds())
      } else {
        console.log('Null');
      }

    });

  }

  pointOnChanges(): void {
    this.point.valueChanges.subscribe(val => {
      if (val.latitude != null && val.longitude != null) {
        console.log('not Null');
        this.myPoint.setLatLng([val.latitude, val.longitude])
        this.map.setView(this.myPoint.getLatLng())
      } else {
        console.log('Null');
      }
    });
  }

  polygonPointOnchanges(): void {
    this.polygonPoints.valueChanges.subscribe(val => {
      var latlngs = []
      val.forEach((point, index) => {
        console.log('latitude ' + (index + 1) + ' : ' + point.latitude + ' - longitude ' + index + ': ' + point.longitude);
        if (point.latitude != null && point.longitude != null) {
          latlngs.push([point.latitude, point.longitude])
        }
      });

      this.myPolygon.setLatLngs(latlngs)

      this.map.fitBounds(this.myPolygon.getBounds())
    })
  }

  addPoint() {
    console.log('addPoint');
    if (this.polygonPoints.length < 10) {
      const pointForm = this.fb.group({
        latitude: [0],
        longitude: [0]
      });

      this.polygonPoints.push(pointForm);
    }
  }

  deletePoint(pointIndex: number) {
    console.log('delete : ' + pointIndex);
    if (this.polygonPoints.length > 3) {
      this.polygonPoints.removeAt(pointIndex);
    }
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

    this.initShapes()

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


}
