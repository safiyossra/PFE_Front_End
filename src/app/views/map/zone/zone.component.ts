import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { util } from '../../../tools/utils'
import * as L from 'leaflet'
import { ZoneService } from './../../../services/zone.service'
import { Zone, ZoneType } from './../../../models/zone'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import '@geoman-io/leaflet-geoman-free';
import { Router } from '@angular/router';
import { Constant } from 'src/app/tools/constants';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, AfterViewInit {

  provider = new OpenStreetMapProvider();
  @Input() showFullScreenControle?: boolean = true
  @Input() showPositionControle?: boolean = true
  // ---------------- MAP -----------------
  isMyPositionVisible: boolean = false
  MyPositionMarker: L.Marker
  map: any

  // ---------------- MAP -----------------

  // ---------------- Zones ------------------
  zones: Zone[]
  selectedZone: Zone = new Zone()
  isDrawing = false
  public size = [25, 75]
  default = {
    latitude: 35.75,
    longitude: -5.83,
    radius: 10000,
    description: '',
    color: '#000'
  }
  errorMsg = ""
  isLoading = false
  mode = 'list'

  dataSource = new MatTableDataSource();
  columns: string[] = ['actions', 'description', 'creationTime', 'groupID', 'clientID'];
  displayedColumns: string[] = ['actions', 'description', 'creationTime'];
  showColumnsControle: Boolean = true

  @ViewChild(MatSort) sort: MatSort;

  layer: any

  myMarkers = []

  zoneDisplayed = false
  selectedZoneIndex = -1

  // ---------------- Zones ------------------
  constructor(private tools: util, public cts: Constant, private zoneService: ZoneService, private router: Router) {
  }
  clearZoneFromMap() {
    if (this.layer && this.map.hasLayer(this.layer)) {
      this.layer.removeFrom(this.map)
    }
  }

  onRowClicked(index: any, zone: any) {
    this.clearZoneFromMap()
    if (this.selectedZoneIndex != index) {
      this.selectedZoneIndex = index
      var icon = "default"
      if (this.iconExists(zone.iconName)) {
        icon = zone.iconName
      }
      this.drawShape(this.getShapeFromZone(zone), icon)
    } else {
      this.selectedZoneIndex = -1
    }

  }

  ngOnInit(): void {
    this.loadZones()
  }

  loadZones() {
    var route = this.router
    this.isLoading = true
    this.zoneService.getData().subscribe({
      next: (res: any) => {
        var zones = []
        res.map((element: any) => {
          var zone = new Zone()
          zone.geozoneID = element.geozoneID
          zone.clientID = element.clientID
          zone.groupID = element.groupID
          zone.description = element.description
          zone.isActive = element.isActive
          zone.reverseGeocode = element.reverseGeocode
          zone.iconName = element.iconName
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
        this.dataSource = new MatTableDataSource(this.zones)
        this.dataSource.sort = this.sort
        this.isLoading = false
      }, error(err) {
        this.isLoading = false
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })

  }

  changeDisplayedColumn(newColumnList) {
    this.displayedColumns = newColumnList
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMap()
    }, 100)
  }

  resetZoneForm(fullReset = false) {
    if (fullReset) {
      var ID = this.selectedZone.geozoneID
      this.selectedZone = new Zone()
      this.selectedZone.geozoneID = ID
      this.showInitialDrawControls(this.map)
      this.clearZoneFromMap()
    }
  }

  apply() {
    if (this.mode == 'edit') {
      this.updateZone()
    }
    else {
      this.addZone()
    }
  }

  addZone() {
    var route = this.router
    this.errorMsg = ""
    if (!this.selectedZone.description || !this.selectedZone.latitude1 || !this.selectedZone.longitude1 || !this.selectedZone.radius) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.isLoading = true
      console.log(this.selectedZone);

      // this.zoneService.addZone(this.selectedZone).subscribe({
      //   next: (res) => {
      //     this.isLoading = false
      //     this.mode = 'list'
      //     this.loadZones()
      //   }
      //   , error(err) {
      //     console.log("err", err)
      //     this.isLoading = false
      //     if (err.status == 401) {
      //       route.navigate(['login'], { queryParams: { returnUrl: route.url } });
      //     }
      //     else if (err.status == 402) {
      //       this.errorMsg = "Erreur l'ajout est bloqué."
      //     }
      //   }
      // })
    }
  }

  updateZone() {
    var route = this.router
    this.errorMsg = ""
    console.log("this.selectedZone", this.selectedZone)
    if (!this.selectedZone.description || !this.selectedZone.latitude1 || !this.selectedZone.longitude1 || !this.selectedZone.radius) {
      this.errorMsg = "Veuillez remplir les champs obligatoires (*) ."
    } else {
      this.isLoading = true
      this.zoneService.updateZone(this.selectedZone).subscribe({
        next: (res) => {
          console.log("updateZone", res)
          this.isLoading = false
          this.mode = 'list'
          this.loadZones()
        }, error(err) {
          console.log("error", err)
          this.isLoading = false
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            this.errorMsg = "Erreur la modification est bloqué."
          }
        }
      })

    }
  }

  delete(id) {
    if (confirm("Are you sure to delete " + id)) {
      this.isLoading = true
      var route = this.router
      var u = "?id=" + id
      this.zoneService.delZone(u).subscribe({
        next: (res) => {
          console.log("delZone", res)
          this.isLoading = false
          this.loadZones()
        }, error(err) {
          this.isLoading = false
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
          else if (err.status == 402) {
            alert("Erreur, la suppression est bloqué")
          }
        }
      })
    }
  }

  createMap() {
    var car = {
      lat: this.default.latitude,
      lng: this.default.longitude
    }
    this.map = this.tools.createMap(this.map, 'map', car, this.provider, false, this.showFullScreenControle, this.showPositionControle, false)
    this.map.doubleClickZoom.disable();
    this.addDrawToMap()
  }

  addDrawToMap() {
    var map = this.map
    this.hideDrawControls(map)
    var icon = L.icon({
      iconUrl: 'assets/img/POI/default.png',
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });
    this.map.pm.setGlobalOptions({ hideMiddleMarkers: true, finishOn: 'dblclick', markerStyle: { icon: icon } });
    this.map.pm.setLang('fr');
    map.on('pm:create', (e: any) => {
      var res: any;
      this.layer = e.layer;
      res = this.getShape(map, undefined, undefined)
      this.updateZoneForm(e.shape)
      this.showAfterDrawControls(map)
      this.getZoneFromShape(res)
      this.isDrawing = false
      console.log(res);
      this.layer.on('pm:update', (e: any) => {
        var res = this.getShape(map, undefined, undefined)
        this.getZoneFromShape(res)
        this.isDrawing = false
        console.log(res);
      });
    });
    map.on('pm:remove', (e: any) => {
      this.showInitialDrawControls(map)
      this.isDrawing = true
      this.updateZoneForm(null)
      this.getZoneFromShape({ shape: null, coord: [], radius: 30, })
    });
    this.map.on('pm:drawstart', (e: any) => {
      var count = 10;
      this.isDrawing = true
      e.workingLayer.on('pm:vertexadded', (e: any) => {
        count--;
        if (count == 0) {
          this.triggerDblClick('map');
        }
      });
    });
  }

  getShape(map: any, layer: any, shape: any) {
    var res: any;
    var shapeInfo = map == undefined ? layer : map.pm.getGeomanDrawLayers()[0]
    var shape = map == undefined ? shape : shapeInfo.pm._shape;
    if (shape.toString() == 'Marker') {
      res = {
        shape: ZoneType.Marker,
        coord: [shapeInfo._latlng],
        radius: 30,
      };
    } else if (shape.toString() == 'Polygon' || shape.toString() == 'Rectangle') {
      res = {
        shape: ZoneType.Polygon,
        coord: shapeInfo._latlngs[0],
        radius: 30,
      };
    } else if (shape.toString() == 'Circle') {
      res = {
        shape: ZoneType.Circle,
        coord: [shapeInfo._latlng],
        radius: shapeInfo._mRadius,
      };
    }
    return res
  }

  drawShape(shape: any, iconString) {
    if (shape.shape == ZoneType.Circle) {
      var center = new L.LatLng(shape.coord[0][0], shape.coord[0][1])
      this.layer = L.circle(center, shape.radius);
      var bounds = center.toBounds(shape.radius * 2);
      this.map.fitBounds(bounds)
    } else if (shape.shape == ZoneType.Polygon) {
      this.layer = L.polygon(shape.coord)
      this.map.fitBounds(this.layer.getBounds())
    } else {
      var icon = L.icon({
        iconUrl: 'assets/img/POI/' + iconString + '.png',
        iconSize: [40, 50],
        iconAnchor: [20, 50]
      });
      this.layer = L.marker(new L.LatLng(shape.coord[0][0], shape.coord[0][1]), { icon: icon })//
      this.map.setView(new L.LatLng(shape.coord[0][0], shape.coord[0][1]), 15)
    }
    this.layer.addTo(this.map)
  }

  updateZoneForm(shape: any) {
    switch (shape) {
      case "Circle":
        this.selectedZone.zoneType = ZoneType.Circle
        break;
      case "Polygon":
        this.selectedZone.zoneType = ZoneType.Polygon
        break;
      case "Rectangle":
        this.selectedZone.zoneType = ZoneType.Polygon
        break;
      case "Marker":
        this.selectedZone.zoneType = ZoneType.Marker
        this.selectedZone.iconName = "default"
        break;
      default:
        this.selectedZone.zoneType = null
        break;
    }
  }

  getShapeFromZone(zone: Zone) {
    var res: any;
    console.log("zone.latLngs", zone.latLngs)
    var shape = zone.zoneType;
    if (shape == ZoneType.Marker) {
      res = {
        shape: shape,
        coord: [[zone.latitude1, zone.longitude1]],
        radius: 30,
      };
    } else if (shape == ZoneType.Polygon) {
      res = {
        shape: shape,
        coord: zone.latLngs,
        radius: 30,
      };
    } else if (shape == ZoneType.Circle) {
      res = {
        shape: shape,
        coord: [[zone.latitude1, zone.longitude1]],
        radius: zone.radius,
      };
    }
    return res
  }

  getZoneFromShape(shape: any) {
    this.selectedZone.setLatLngs(shape.coord)
    this.selectedZone.radius = shape.radius
  }

  triggerDblClick(map: any) {
    var event = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    document.getElementById(map)?.dispatchEvent(event);
  }

  showAfterDrawControls(map: any) {
    map.pm.addControls({
      position: 'topleft',
      drawPolyline: false,
      drawText: false,
      drawCircleMarker: false,
      cutPolygon: false,
      drawMarker: false,
      drawRectangle: false,
      drawPolygon: false,
      drawCircle: false,
      editControls: true,
    });
    var icon = L.icon({
      iconUrl: 'assets/img/POI/default.png',
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });
    map.pm.setGlobalOptions({ hideMiddleMarkers: true, finishOn: 'dblclick', markerStyle: { icon: icon } });
    map.pm.enableGlobalEditMode();
  }

  showInitialDrawControls(map: any) {
    map.pm.addControls({
      position: 'topleft',
      drawPolyline: false,
      drawText: false,
      drawCircleMarker: false,
      cutPolygon: false,
      drawMarker: true,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: true,
      editControls: true,
    });
    map.pm.enableGlobalEditMode();
    var icon = L.icon({
      iconUrl: 'assets/img/POI/default.png',
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });
    map.pm.setGlobalOptions({ hideMiddleMarkers: true, finishOn: 'dblclick', markerStyle: { icon: icon } });
  }

  hideDrawControls(map: any) {
    map.pm.addControls({
      position: 'topleft',
      drawPolyline: false,
      editControls: false,
      drawText: false,
      drawCircleMarker: false,
      cutPolygon: false,
      drawMarker: false,
      drawRectangle: false,
      drawPolygon: false,
      drawCircle: false,
    })
    map.pm.disableGlobalEditMode();
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

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue
  }

  selectTab(tab) {
    // console.log(tab + ' : selected');
    this.mode = tab
    switch (tab) {
      case 'list':
        this.selectedZone = new Zone()
        this.selectedZoneIndex = -1
        this.clearZoneFromMap()
        this.hideDrawControls(this.map)
        break;
      case 'edit':
        console.log("edit mode");
        // this.clearZoneFromMap()
        this.showAfterDrawControls(this.map)
        this.isDrawing = true
        break;
      case 'create':
        this.selectedZone = new Zone()
        this.clearZoneFromMap()
        this.showInitialDrawControls(this.map)
        break;
      default:
        break;
    }

  }

  onIconChange(e) {
    console.log(e, this.selectedZone);
    var icon = L.icon({
      iconUrl: 'assets/img/POI/' + e.value + '.png',
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });
    this.layer.setIcon(icon)
  }

  editZone(zone) {
    this.mode = 'edit'
    this.clearZoneFromMap()
    this.selectedZone = zone
    var icon = "default"
    if (this.iconExists(this.selectedZone.iconName)) {
      icon = this.selectedZone.iconName
    } else {
      this.selectedZone.iconName = "default"
    }
    this.drawShape(this.getShapeFromZone(zone), icon)
    this.layer.on('pm:update', (e: any) => {
      var res = this.getShape(undefined, e.layer, e.shape)
      this.getZoneFromShape(res)
      // console.log(res);
    });
    this.showAfterDrawControls(this.map)
  }

  iconExists(name: any) {
    return this.cts.zoneIcons.findIndex(elem => elem.name == name) != -1
  }

  onDragEnd(e) {
    this.size = [e.sizes[0], e.sizes[1]]
    this.invalidate()
  }

  resetSize(e) {
    this.size[0] = 25
    this.size[1] = 75
    this.invalidate()
  }

  invalidate() {
    this.map?.invalidateSize(true)
  }

  collapseClicked() {
    this.size[0] = 0
    this.size[1] = 100
    this.invalidate()
  }
}
