import { formatDate, DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl } from 'leaflet-geosearch';

import { Constant } from 'src/app/tools/constants';

var userPermissions: any;
@Injectable({
  providedIn: 'root'
})
export class util {
  isFullScreen: boolean;
  constructor(@Inject(DOCUMENT) private document: any, @Inject(LOCALE_ID) private locale: string, private cst: Constant) {
    document.onfullscreenchange = ($event: any) => this.chkScreenMode($event.target['id']);
  }

  public isAuthorized(key: any, permission: any) {
    key = key.split("_");
    var val = undefined
    if (!userPermissions) {
      this.getPermissions()
    }
    if (key.length > 1)
      val = userPermissions[key[0]][key[1]]
    else if (key.length == 1) val = userPermissions[key[0]];
    if (val == undefined) return true;
    var index = this.cst.permissions.indexOf(val);
    var indexP = this.cst.permissions.indexOf(permission);
    if (index >= indexP && indexP != 0)
      return true;
    return false;
  };

  public setPermissions(userPermissions: any) {
    this.resetPermissions()
    userPermissions = this.encodePermissions(userPermissions);
    localStorage.setItem('rm', userPermissions);
  }

  resetPermissions() {
    userPermissions = null
  }

  public getPermissions() {
    var permissions = this.decodePermissions(localStorage.getItem('rm') ?? '');
    if (permissions == undefined || !permissions || permissions == '') {
      permissions = this.cst.defaultPermissions;
    }
    userPermissions = permissions;
  }

  public encodePermissions(userPermissions: any) {
    return btoa(JSON.stringify(userPermissions));
  }

  public decodePermissions(userPermissions: any) {
    try {
      return JSON.parse(atob(userPermissions));
    } catch (error) {
      return undefined
    }

  }

  public openFullscreen(elem: any) {
    // console.log(elem);

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }
  /* Close fullscreen */
  public closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  chkScreenMode(id) {
    // var idElem = (id == 'map') || (id == 'mapDetail') ? id+'fullScreenControl' : 'list-fullscreenControl'
    // console.log(id);
    var idElem = id + 'fullScreenControl'
    // console.log(idElem);
    var fullScreenCtl = document.getElementById(idElem)
    if (document.fullscreenElement) {
      //fullscreen
      fullScreenCtl.style.backgroundPosition = "64% 96%";
      fullScreenCtl.setAttribute("title", "Exit FullScreen");
      this.isFullScreen = true;
    } else {
      //not in full screen
      fullScreenCtl.style.backgroundPosition = "55% 2%";
      fullScreenCtl.setAttribute("title", "Enter FullScreen");
      this.isFullScreen = false;
    }
  }

  myIcon(vehicule: any, status: number, vehiculeType: string, isSelected: boolean = false, noTransition: boolean = false) {
    let img = this.getImage(vehiculeType)
    let icon = status == 61714 ? `assets/img/vehicules/${img}-on.png` : `assets/img/vehicules/${img}-off.png`
    return L.divIcon({
      html: `<div class="center-marker"></div>` +
        `<img class="my-icon-img rotate-${Math.round(vehicule.heading)}" src="${icon}">` +
        `<span class="my-icon-title">${vehicule.name}</span>`,
      iconSize: [60, 60],
      // iconAnchor: [25, 20],
      className: (noTransition ? '' : 'marker-transition ') + 'my-div-icon' + (isSelected ? ' marker-selected' : ''),
    })
  }

  myTrajetIcon(status: string) {
    let icon = `assets/img/markers/${status}.png`
    return L.divIcon({
      html: `<img class="my-icon-img" src="${icon}">`,
      iconSize: (status == 'start' || status == 'end') ? [50, 50] : [30, 30],
      iconAnchor: (status == 'start' || status == 'end') ? [25, 50] : [15, 30],
      className: (status == 'start' || status == 'end') ? 'important-marker' : ''
    })
  }

  myDetailsIcon(status: string) {
    let icon = `assets/img/markers/${status}.png`
    return L.divIcon({
      html: `<img class="my-icon-img" src="${icon}">`,
      iconSize: (status == 'start' || status == 'end' || status == 'park') ? [50, 50] : [40, 40],
      iconAnchor: (status == 'start' || status == 'end') ? [25, 50] : [20, 40],
      className: (status == 'start' || status == 'end') ? 'important-marker' : ''
    })
  }

  formatPopUpContent(v) {
    let img = v.icon!=undefined?'<img src="assets/img/vehicules/'+this.getImage(v.icon)+'-img.png">':"Info"
    let time = this.formatDate(new Date(v.timestamp * 1000))

    let age = this.getAge(v.timestamp)
    let ageString = this.formatAge(age)
    return `<table class="infoBoxTable">
            <tbody>
              <tr class="infoBoxRow"
                style="background-color: #3598dc !important;color: #FFFFFF !important;">
                <td>${img}&nbsp; </td>
                <td class="infoBoxCell" style="vertical-align: bottom;">
                <b style='vertical-align: sub;'>${v.name}</b>
                <a href='https://www.google.com/maps/?q=${v.lat},${v.lng}' class='float-right' target='_blank'> <i class="fa fa-share text-light" style="font-size: x-large;"></i></a>
                <b style="margin-right: 10px;" class="float-right" >
                <i class="${this.getStatusClass(v.statusCode)}" style="vertical-align: bottom;"></i>${(this.getStatusName(v.statusCode))}</b></td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">Age:</td>
                <td class="infoBoxCell"> ${ageString}</td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">Date:</td>
                <td class="infoBoxCell"> ${time}</td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">GPS:</td>
                <td class="infoBoxCell"> ${v.lat} / ${v.lng} </td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">Vitesse: </td>
                <td class="infoBoxCell"> ${v.speed} Km/H</td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">Odomètre:</td>
                <td class="infoBoxCell">${v.odometer} Km</td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">Adresse: </td>
                <td class="infoBoxCell"> ${v.address}</td>
              </tr>
              <tr class="infoBoxRow">
                <td class="infoBoxCellTitle">Fuel Level:</td>
                <td class="infoBoxCell"> ${v.fuelLevel} L</td>
              </tr>
            </tbody>
          </table>`
  }
  // // 👇️ format as "YYYY-MM-DD hh:mm:ss"
  formatDate(date: Date) {
    return formatDate(date, 'Y-M-d HH:mm:ss', this.locale);
  }
  formatDateVer(date: Date) {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', this.locale);
  }
  // // 👇️ format as "hh:mm:ss"
  formatedTime(date: Date) {
    return formatDate(date, 'HH:mm:ss', this.locale);
  }
  formatDateForInput(date: Date) {
    return formatDate(date, 'yyyy-MM-dd', this.locale);
  }

  getAge(timestamp) {
    let now = Math.round(new Date().getTime() / 1000)
    return timestamp > 0 ? (now - timestamp) : "nan"
  }

  formatAge(seconds) {
    if (isNaN(seconds)) return "Jamais"
    // return age
    //days
    let days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    //hours
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    //minutes
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    //output
    return `${days > 0 ? days + " Jours " : ''}${hours > 0 ? hours + " Heurs " : ''}${minutes > 0 ? minutes + " minutes " : ''}${Math.floor(seconds) > 0 ? Math.floor(seconds) + " seconds" : ''}`;
  }

  formatDuree(seconds,_default = "Expiré") {
    if (isNaN(seconds)) return _default
    // return age
    //days
    let days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    //hours
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    //minutes
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - minutes * 60);
    //output
    return `${days > 0 ? days + " Jours, " : ''}${(hours < 10 ? '0' + hours : hours) + "h "}${(minutes < 10 ? '0' + minutes : minutes) + "min "}${seconds < 10 ? '0' + seconds : seconds + "s"}`;
  }

  timeStampToDate(ts) {
    if (ts / Math.pow(10, 12) >= 1) {
      ts;
    }
    else if (ts / Math.pow(10, 9) >= 1) {
      ts *= 1000
    }
    else if (ts / Math.pow(10, 7) >= 1) {
      ts *= 100000
    }
    else if (ts / Math.pow(10, 5) >= 1) {
      ts *= 10000000
    }

    return new Date(ts);
  }

  dateToTimestamp(date) {
    return Date.parse(date) / 1000 as number;
  }

  getDriverName(drivers, driverID) {
    for (let i = 0; i < drivers.length; i++) {
      if (drivers[i].driverID == driverID) return drivers[i].displayName
    }
    return ""
  }

  getStatusName(status: any) {
    if (status == 61714) { return "En Route"; } else
      if (status == 62465) { return "Moteur ON"; } else
        return "Moteur OFF";
  }

  getStatusColor(status: any) {
    if (status == 61714) { return "text-green"; } else
      if (status == 62465) { return "text-blue"; } else
        return "text-red";
  }

  getStatusClass(status: any) {
    if (status == 61714) { return "fa fa-circle text-green status-cercle"; } else
      if (status == 62465) { return "fa fa-dot-circle-o text-green status-cercle"; } else
        if (status == 62467) { return "fa fa-circle text-red status-cercle"; } else
          return "fa fa-question-circle text-dark status-cercle";
  }

  createMap(map, mapId, car, provider, showCollapsControle = true, showFullScreenControle = true, showPositionControle = true, showClusterControle = false, showResetControle = false) {
    const zoomLevel = 12
    map = L.map(mapId, { attributionControl: false, zoomControl: false, markerZoomAnimation: true, zoomAnimation: true, fadeAnimation: true })
      .setView([car.lat, car.lng], zoomLevel)

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
    switch (this.getMapType()) {
      case 'Google Hybrid':
        googleHybrid.addTo(map)
        break;
      case 'Google Terrain':
        googleTerrain.addTo(map)
        break;
      case 'Google Satellite':
        googleSat.addTo(map)
        break;
      case 'Dark':
        dark.addTo(map)
        break;

      default:
        googleStreets.addTo(map)
        break;
    }

    if (showCollapsControle) {
      let ExpandControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('list-Expand');
        },
        onRemove(map: L.Map) { }
      });
      new ExpandControl({
        position: "topleft"
      }).addTo(map);
    }
    if (showResetControle) {
      let ResetControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('resetConrtol');
        },
        onRemove(map: L.Map) { }
      });
      new ResetControl({
        position: "topleft"
      }).addTo(map);
    }
    L.control.zoom().addTo(map)


    if (showFullScreenControle) {
      let FullScreenControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('mapfullScreenControl');
        },
        onRemove(map: L.Map) { }
      });
      new FullScreenControl({
        position: "topleft"
      }).addTo(map);
    }
    if (showPositionControle) {
      let PositionControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('positionControl');
        },
        onRemove(map: L.Map) { }
      });
      new PositionControl({
        position: "topleft"
      }).addTo(map);
    }
    ////////////////////////////////////////////////////////////
    GeoSearchControl({
      provider: provider,
      showMarker: false,
      // style: 'bar',
      position: "topleft",
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: true, // optional: true|false  - default false
      searchLabel: 'Entrez une adresse', // optional: string      - default 'Enter address'
      // keepResult: false, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    }).addTo(map)

    ////////////////////////////////////////////////////////////

    if (showClusterControle) {
      let ResetControl = L.Control.extend({
        onAdd(map: L.Map) {
          return L.DomUtil.get('clusterConrtol');
        },
        onRemove(map: L.Map) { }
      });
      new ResetControl({
        position: "topleft"
      }).addTo(map);
    }
    L.control.layers(baseMaps, null, { collapsed: true, position: "topleft" }).addTo(map);
    L.control.scale().addTo(map);
    map.on('baselayerchange', (e) => {
      this.setMapType(e.name)
    })
    return map;
  }
  getImageId(vehiculeType) {
    return this.cst.motor.includes(vehiculeType) ? "moto" : this.cst.truck.includes(vehiculeType) ? "remolque" : this.cst.sprinter.includes(vehiculeType) ? "bus" : this.cst.remorque.includes(vehiculeType) ?
      "trailer" : this.cst.camions.includes(vehiculeType) ? "fleetGreen" : this.cst.truck_head.includes(vehiculeType) ? "volvo2" : "default"
  }

  getClassByAge(age) {
    if (age != undefined) {
      if (age < 0) return "cil-warning bg-warning"
      if (age <= 180) return "cil-check bg-success"
      if (age <= 3600) return "cil-loop bg-primary"
      if (age > 3600) return "cil-history bg-secondary"
    }
    return "cil-report-slash bg-danger";
  }

  getImage(vehiculeType) {
    return this.cst.motor.includes(vehiculeType) ? "motor" : this.cst.truck.includes(vehiculeType) ? "truck" : this.cst.sprinter.includes(vehiculeType) ? "sprinter" : this.cst.remorque.includes(vehiculeType) ?
      "remork" : this.cst.camions.includes(vehiculeType) ? "camion" : this.cst.truck_head.includes(vehiculeType) ? "truck-head" : "car"
  }

  setMapType(type) {
    localStorage.setItem('mapType', type);
  }

  getMapType() {
    return localStorage.getItem('mapType') ?? 'Google Street';
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  ValidatePhone(phone) {
    // if (/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{6})(?: *x(\d+))?\s*$/.test(phone)) {
      if (/\d{10,15}/.test(phone)) {
        return (true)
    }
    return (false)
  }
  // fonction tranformer

  formatAge2(seconds) {
    let table = []
    if (isNaN(seconds)) return "Jamais"
    // return age
    //days
    let days = Math.floor(seconds / (24 * 3600));
    if (days > 0) table.push(days + 'J,')
    seconds -= days * 24 * 3600;
    //hours
    let hours = Math.floor(seconds / 3600);
    if (hours > 0) table.push(hours + 'H')
    seconds -= hours * 3600;
    //minutes
    let minutes = Math.floor(seconds / 60);
    if (minutes > 0) table.push(minutes + 'min')
    seconds -= minutes * 60;

    if (seconds > 0) table.push(seconds + 's')
    //output
    // console.log("table =======> ", table);
    if (table.length > 2)
      return table[0] + table[1];
    else
      return table[0];
  }
}
