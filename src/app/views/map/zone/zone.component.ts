import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ZoneService } from './../../../services/zone.service'
import { Zone, ZoneType } from './../../../models/zone'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TileStyler } from '@angular/material/grid-list/tile-styler';

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


  fullScreenControl: L.Control;
  resetControl: L.Control;
  positionControl: L.Control;


  // ---------------- MAP -----------------

  // ---------------- Zones ------------------
  zones: Zone[]

  default = {
    latitude: 35.75,
    longitude: -5.83,
    radius: 10000,
    description: '',
    color: '#000'
  }

  mode = 'list'

  dataSource = new MatTableDataSource();
  columns: string[] = ['actions', 'description', 'creationTime', 'groupID', 'clientID'];
  displayedColumns: string[] = ['actions', 'description', 'creationTime'];
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

  zone: FormGroup
  zoneModel: Zone
  myZone: any

  myMarkers = []

  zoneDisplayed = false
  selectedZoneIndex = -1

  clearZoneFromMap() {
    if (this.myZone && this.map.hasLayer(this.myZone)) {
      this.myZone.removeFrom(this.map)
    }
  }

  onRowClicked(index: any, zone: any) {
    this.clearZoneFromMap()
    if (this.selectedZoneIndex != index) {
      this.selectedZoneIndex = index
      switch (zone.zoneType) {
        case ZoneType.circle:
          console.log('this is a Circle')
          if (!this.myZone || !(this.myZone instanceof L.Circle)) {
            this.myZone = L.circle(zone.latLngs[0], { radius: zone.radius })
          } else {
            this.myZone.setLatLng(zone.latLngs[0])
            this.myZone.setRadius(zone.radius)
          }
          this.myZone.addTo(this.map)
          this.map.fitBounds(this.myZone)
          break;

        case ZoneType.point:
          console.log('this is a Point')
          if (!this.myZone || !(this.myZone instanceof L.Marker)) {
            this.myZone = L.marker(zone.latLngs[0])
          } else {
            this.myZone.setLatLng(zone.latLngs[0])
          }
          this.myZone.addTo(this.map)
          this.map.setView(this.myZone.getLatLng())
          break;

        case ZoneType.polygon:
          console.log('this is a Polygon')
          if (!this.myZone || !(this.myZone instanceof L.Polygon)) {
            this.myZone = L.polygon(zone.latLngs)
          } else {
            this.myZone.setLatLngs(zone.latLngs)
          }
          this.myZone.addTo(this.map)
          this.map.fitBounds(this.myZone.getBounds())
          break;

        default:
          console.log('Uknown Type');
          break;
      }
    } else {
      this.selectedZoneIndex = -1
    }

  }
  // ---------------- Zones ------------------
  constructor(private tools: util, private fb: FormBuilder, private zoneService: ZoneService) {
    this.zone = fb.group({
      description: new FormControl(),
      radius: new FormControl(),
      color: new FormControl('#63c2de'),
      points: fb.array([
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
        this.fb.group({
          latitude: null,
          longitude: null,
        }),
      ]),
    })
  }

  get zonePoints() {
    return this.zone.controls['points'] as FormArray
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
    this.zoneChanges()
  }

  onTypeChange(event: any) {
    switch (event.value) {
      case 'point':
        this.resetZoneForm()
        if (this.myZone && this.map.hasLayer(this.myZone)) {
          this.myZone.removeFrom(this.map)
        }

        this.zone.patchValue({
          radius: 5
        })

        let centerPoint = L.latLng(this.zone.value.points[0][0], this.zone.value.points[0][0])
        this.myZone = L.marker(centerPoint, { icon: L.icon({ iconUrl: 'assets/img/markers/pin_n.png', iconSize: [50, 50], iconAnchor: [25, 50] }) })
        break;

      case 'circle':
        this.resetZoneForm()
        if (this.myZone && this.map.hasLayer(this.myZone)) {
          this.myZone.removeFrom(this.map)
        }

        this.zone.patchValue({
          radius: 500
        })

        let centerCircle = L.latLng(this.zone.value.points[0][0], this.zone.value.points[0][0])
        this.myZone = L.circle(centerCircle, { color: this.zone.value.color })
        break;

      case 'polygon':
        this.resetZoneForm()
        if (this.myZone && this.map.hasLayer(this.myZone)) {
          this.myZone.removeFrom(this.map)
        }

        this.zone.patchValue({
          radius: 5
        })

        this.myZone = L.polygon(this.zone.value.points.map((p: any) => L.latLng(p[0], p[1])), { color: this.zone.value.color })

        break;

      default:
        console.log('default selected');
        if (this.myZone && this.map.hasLayer(this.myZone)) {
          this.myZone.removeFrom(this.map)
        }

        break;
    }

  }

  resetZoneForm(fullReset: Boolean = false) {
    if (fullReset) {
      this.selectedType = null
      this.zone.reset({
        color: '#4dbd74'
      })
      this.clearZoneFromMap()
    } else {
      this.zone.reset({
        description: this.zone.value.description,
        color: '#4dbd74'
      })
    }
  }

  zoneChanges(): void {
    this.zone.valueChanges.subscribe(val => {
      var points = val.points

      // points.forEach((p, i) => {
      //   if (p.latitude != null && p.longitude != null) {
      //     this.myMarkers[i].setLatLng(L.latLng(p.latitude, p.longitude))
      //     console.log(this.myMarkers[i].getLatLng());
      //     if (this.myMarkers[i].getLatLng() != null) {
      //       this.myMarkers[i].addTo(this.map)
      //     }
      //   } else {
      //     if (this.map.hasLayer(this.myMarkers[i])) {
      //       this.myMarkers[i].removeFrom(this.map)
      //     }

      //   }
      // });

      this.clearZoneFromMap()

      switch (this.selectedType) {
        case 'circle':
          let centerCircle = L.latLng(points[0].latitude, points[0].longitude)

          if (!this.myZone) {
            this.myZone = L.circle(centerCircle, { color: this.zone.value.color })
          }

          if (centerCircle != null && centerCircle.lat != null && centerCircle.lng != null && val.radius != null) {
            console.log('not Null');
            this.myZone.setLatLng(centerCircle)
            this.myZone.setRadius(val.radius)
            this.myZone.setStyle({ color: val.color })

            if (this.map.hasLayer(this.myZone)) {
              this.map.fitBounds(this.myZone.getBounds())
            } else {
              this.myZone.addTo(this.map)
              this.map.fitBounds(this.myZone.getBounds())
            }
          } else {
            if (this.myZone && this.map.hasLayer(this.myZone)) {
              this.myZone.removeFrom(this.map)
            }
          }

          break;

        case 'point':
          let centerPoint = L.latLng(points[0].latitude, points[0].longitude)

          if (!this.myZone) {
            this.myZone = L.marker(centerPoint, { icon: L.icon({ iconUrl: 'assets/img/markers/pin_n.png', iconSize: [50, 50], iconAnchor: [25, 50] }) })
          }


          if (centerPoint != null && centerPoint.lat != null && centerPoint.lng != null && val.radius != null) {
            console.log('not Null');
            this.myZone.setLatLng(centerPoint)
            this.map.setView(this.myZone.getLatLng())
            if (this.map.hasLayer(this.myZone)) {
              this.map.setView(this.myZone.getLatLng())
            } else {
              this.myZone.addTo(this.map)
              this.map.setView(this.myZone.getLatLng())
            }
          } else {
            if (this.myZone && this.map.hasLayer(this.myZone)) {
              this.myZone.removeFrom(this.map)
            }
          }
          break;

        case 'polygon':
          var latlngs = []
          points.forEach((point: any, index) => {
            if (point.latitude != null && point.longitude != null) {
              latlngs.push(L.latLng(point.latitude, point.longitude))
            }
          });

          if (!this.myZone) {
            this.myZone = L.polygon(latlngs, { color: this.zone.value.color })
          }

          if (this.myZone && latlngs.length > 0) {
            this.myZone.setLatLngs(latlngs)
            this.myZone.setStyle({ color: val.color })
            if (this.map.hasLayer(this.myZone)) {
              this.map.fitBounds(this.myZone.getBounds())
            } else {
              this.myZone.addTo(this.map)
              this.map.fitBounds(this.myZone.getBounds())
            }
          }
          else {
            if (this.myZone && this.map.hasLayer(this.myZone)) {
              this.myZone.removeFrom(this.map)
            }
          }

          break;

        default:
          break;
      }

    })
  }

  addZone() {

  }

  updateZone() {

  }


  resetZonePoint(pointIndex: number) {
    this.zonePoints.controls[pointIndex].patchValue({
      latitude: null,
      longitude: null,
    })
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

    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(this.map);
    L.control.scale().addTo(this.map);

    // this.initMarkers()

    this.map.doubleClickZoom.disable();
    this.map.on('dblclick', (event) => {
      if (this.mode != 'list') {
        this.selectedZoneIndex = -1
        switch (this.selectedType) {
          case 'point':
            this.generatePoint(event.latlng)

            break;
          case 'circle':
            this.generateCircle(event.latlng)
            break;
          case 'polygon':
            this.generatePolygon(event.latlng)
            break;

          default:
            break;
        }
      }
    })

  }


  generatePolygon(center) {
    let radiusMts = 5500;
    let bounds = L.latLng(center.lat, center.lng).toBounds(radiusMts);

    let rectanlePoints = L.rectangle(bounds).getLatLngs()[0];

    let points = []

    let dist = Math.abs((rectanlePoints[0].lat - rectanlePoints[1].lat) / 4)

    let startPoint = [center.lat, center.lng]
    points.push([startPoint[0] - 3 * dist, startPoint[1] + dist])
    points.push([startPoint[0] - 3 * dist, startPoint[1]])
    points.push([startPoint[0] - 3 * dist, startPoint[1] - 1 * dist])
    points.push([startPoint[0] - 1 * dist, startPoint[1] - 3 * dist])
    points.push([startPoint[0] + 1 * dist, startPoint[1] - 3 * dist])
    points.push([startPoint[0] + 3 * dist, startPoint[1] - 1 * dist])
    points.push([startPoint[0] + 3 * dist, startPoint[1]])
    points.push([startPoint[0] + 3 * dist, startPoint[1] + 1 * dist])
    points.push([startPoint[0] + 1 * dist, startPoint[1] + 3 * dist])
    points.push([startPoint[0] - 1 * dist, startPoint[1] + 3 * dist])

    this.clearZoneFromMap()
    this.zone.patchValue({
      points: points.map(p => {
        return {
          latitude: p[0],
          longitude: p[1]
        }
      })
    })

    this.myZone.setLatLngs(points.map(p => L.latLng(p[0], p[1])))
    this.myZone.setStyle({ color: this.zone.value.color })
    this.map.fitBounds(this.myZone.getBounds())
    this.myZone.addTo(this.map)
  }

  generateCircle(center) {
    let radius = this.zone.value.radius

    this.zonePoints.controls[0].patchValue({
      latitude: center.lat,
      longitude: center.lng,
    })

    this.myZone.setLatLng([center.lat, center.lng])
    this.myZone.setRadius(radius)
    this.myZone.addTo(this.map)
    this.map.fitBounds(this.myZone.getBounds())

  }

  generatePoint(center) {
    this.zonePoints.controls[0].patchValue({
      latitude: center.lat,
      longitude: center.lng,
    })

    this.myZone.setLatLng([center.lat, center.lng])
    this.myZone.addTo(this.map)
    this.map.setView(this.myZone.getLatLng())

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

    this.dataSource.filter = filterValue
  }

  selectTab(tab) {
    console.log(tab + ' : selected');
    this.mode = tab
    switch (tab) {
      case 'list':
        this.clearZoneFromMap()
        this.selectedType = ''
        break;

      default:
        break;
    }

  }

  editZone(zone: Zone) {
    this.mode = 'edit'

    this.clearZoneFromMap()
    this.selectedType = ZoneType[zone.zoneType]
    this.zone.patchValue({
      description: zone.description,
      radius: zone.radius,
      color: zone.shapeColor == null || zone.shapeColor == '' ? '#63c2de' : zone.shapeColor,
      points: [
        {
          latitude: zone.latitude1,
          longitude: zone.longitude1
        },
        {
          latitude: zone.latitude2,
          longitude: zone.longitude2
        },
        {
          latitude: zone.latitude3,
          longitude: zone.longitude3
        },
        {
          latitude: zone.latitude4,
          longitude: zone.longitude4
        },
        {
          latitude: zone.latitude5,
          longitude: zone.longitude5
        },
        {
          latitude: zone.latitude6,
          longitude: zone.longitude6
        },
        {
          latitude: zone.latitude7,
          longitude: zone.longitude7
        },
        {
          latitude: zone.latitude8,
          longitude: zone.longitude8
        },
        {
          latitude: zone.latitude9,
          longitude: zone.longitude9
        },
        {
          latitude: zone.latitude10,
          longitude: zone.longitude10
        },
      ]
    })

  }

  initMarkers() {
    var points = this.zone.value.points

    points.forEach(p => {
      let marker = L.marker(L.latLng(p.latitude, p.longitude), { draggable: true })
      marker.on('dragend', function (event) {
        var marker = event.target;
        var position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
      });
      this.myMarkers.push(marker)
    })

    console.log(this.myMarkers);

  }


}
