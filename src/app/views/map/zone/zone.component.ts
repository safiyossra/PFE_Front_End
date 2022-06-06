import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ZoneService } from './../../../services/zone.service'
import { Zone, ZoneType } from './../../../models/zone'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
    description: '',
    color: '#000'
  }

  fullScreenControl: L.Control;
  resetControl: L.Control;
  positionControl: L.Control;
  // ---------------- MAP -----------------

  // ---------------- Zones ------------------
  zones: Zone[]
  public dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['description', 'creationTime'];
  showColumnsControle: Boolean = true

  @ViewChild(MatSort) sort: MatSort;

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

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);

  }
  // ---------------- Zones ------------------


  constructor(private tools: util, private fb: FormBuilder, private zoneService: ZoneService) {
    this.circle = fb.group({
      latitude: new FormControl(this.default.latitude),
      longitude: new FormControl(this.default.longitude),
      radius: new FormControl(this.default.radius),
      description: new FormControl(this.default.description),
      color: new FormControl('#4dbd74'),
    })

    this.point = fb.group({
      latitude: new FormControl(this.default.latitude),
      longitude: new FormControl(this.default.longitude),
      description: new FormControl(this.default.description),
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
      description: new FormControl(this.default.description),
      color: new FormControl('#ffc107')

    })
  }

  get polygonPoints() {
    return this.polygon.controls['points'] as FormArray
  }

  ngOnInit(): void {
    this.loadZones()
  }

  loadZones() {
    this.zoneService.getData().subscribe({
      next: (res: any) => {
        var zones = []
        res.map((element: any) => {
          var zone = new Zone()
          zone.accountID = element.accountID
          zone.clientID = element.clientID
          zone.groupID = element.groupID
          zone.description = element.description
          zone.isActive = element.isActive
          zone.shapeColor = element.shapeColor
          zone.radius = element.radius
          zone.zoneType = element.zoneType
          zone.latitude1 = element.latitude1
          zone.longitude1 = element.longitude1
          zone.latitude2 = element.latitude2
          zone.longitude2 = element.longitude2
          zone.latitude3 = element.latitude3
          zone.longitude3 = element.longitude3
          zone.latitude4 = element.latitude4
          zone.longitude4 = element.longitude4
          zone.latitude5 = element.latitude5
          zone.longitude5 = element.longitude5
          zone.latitude6 = element.latitude6
          zone.longitude6 = element.longitude6
          zone.latitude7 = element.latitude7
          zone.longitude7 = element.longitude7
          zone.latitude8 = element.latitude8
          zone.longitude8 = element.longitude8
          zone.latitude9 = element.latitude9
          zone.longitude9 = element.longitude9
          zone.latitude10 = element.latitude10
          zone.longitude10 = element.longitude10
          zone.creationTime = element.creationTime * 1000

          zones.push(zone)
        });

        this.zones = zones
        console.log(this.zones.length);

        this.dataSource = new MatTableDataSource(this.zones)
        this.dataSource.sort = this.sort
      }
    })

  }

  changeDisplayedColumn(newColumnList) {
    this.displayedColumns = newColumnList
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
        this.map.fitBounds(this.myPolygon.getBounds())
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


  polygonPointOnchanges(): void {
    this.polygonPoints.valueChanges.subscribe(val => {
      var latlngs = []
      val.forEach((point: any, index) => {
        if (point.latitude != null && point.longitude != null) {
          latlngs.push(new L.LatLng(point.latitude, point.longitude))
        }
      });

      this.myPolygon.setLatLngs(latlngs)
      this.myCircle.setStyle({ color: this.polygon.value.color })
      this.map.fitBounds(this.myPolygon.getBounds())

    })
  }

  resetPoint() {
    this.point.reset({
      latitude: this.default.latitude,
      longitude: this.default.longitude,
      description: this.default.description,
      color: '#63c2de',
    })
  }

  resetCircle() {
    this.circle.reset({
      latitude: this.default.latitude,
      longitude: this.default.longitude,
      radius: this.default.radius,
      description: this.default.description,
      color: '#4dbd74',
    })
  }

  resetPolygon() {
    this.polygon.reset({
      points: [
        {
          latitude: [this.default.latitude],
          longitude: [this.default.longitude]
        },
        {
          latitude: [this.default.latitude + 1],
          longitude: [this.default.longitude]
        },
        {
          latitude: [this.default.latitude],
          longitude: [this.default.longitude - 1]
        },
      ],
      description: this.default.description,
      color: '#ffc107'
    })
  }

  resetZone() {
    switch (this.selectedType) {
      case 'point':
        console.log('reset point');
        this.resetPoint()
        break;

      case 'circle':
        console.log('reset circle');
        this.resetCircle()
        break;

      case 'polygon':
        console.log('reset polygon');
        this.resetPolygon()
        break;

      default:
        console.log('default reset');
        break;
    }
  }

  addZone() {

  }

  updateZone() {

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

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.filterValues['name'] = filterValue

    this.dataSource.filter = filterValue
    // this.dataSource.filter = JSON.stringify(this.filterValues)

    // this.applyFilter()
  }

}
