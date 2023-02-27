import { formatDate, DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { } from '@angular/core';
import { Constant } from 'src/app/tools/constants';

var userPermissions: any;
var accountPermissions: any;
@Injectable({
  providedIn: 'root'
})

export class util {
  isFullScreen: boolean;
  constructor(@Inject(DOCUMENT) private document: any, @Inject(LOCALE_ID) private locale: string, private cst: Constant) {
  }

  public isAuthorized(key: any, permission: any) {
    key = key.split("_");
    var val = undefined
    var vala = undefined
    if (!userPermissions || !accountPermissions) {
      this.getPermissions()
    }
    // console.log(userPermissions ,accountPermissions);
    // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    if (key.length > 1) {
      val = userPermissions[key[0]][key[1]]
      vala = accountPermissions[key[0]][key[1]]
    } else if (key.length == 1) { val = userPermissions[key[0]]; vala = accountPermissions[key[0]]; }
    if (vala == undefined || val == undefined) return true;///false
    var index = this.cst.permissions.indexOf(val);
    var indexa = this.cst.permissions.indexOf(vala);
    var indexP = this.cst.permissions.indexOf(permission);
    if (indexa >= indexP && indexP != 0) {
      if (index >= indexP && indexP != 0) {
        return true;
      }
    }
    return true;/////////////false
  };

  public setPermissions(uPermissions: any, aPermissions: any) {
    this.resetPermissions()
    uPermissions = this.encodePermissions(uPermissions);
    localStorage.setItem('rm', uPermissions);
    aPermissions = this.encodePermissions(aPermissions);
    localStorage.setItem('ram', aPermissions);
  }

  resetPermissions() {
    userPermissions = null
    accountPermissions = null
  }

  public getPermissions() {
    var permissions = this.decodePermissions(localStorage.getItem('rm') ?? '');
    var apermissions = this.decodePermissions(localStorage.getItem('ram') ?? '');
    if (permissions == undefined || !permissions || permissions == '') {
      permissions = this.cst.defaultPermissions;
    }
    if (apermissions == undefined || !apermissions || apermissions == '') {
      apermissions = this.cst.defaultAccountPermissions;
    }
    userPermissions = permissions;
    accountPermissions = apermissions;
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

  formatDuree(seconds, _default = "Expiré") {
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
    var emails = mail.split(";")
    for (let index = 0; index < emails.length; index++) {
      const email = emails[index];
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return false
    }
    }
    
    return true
  }

  ValidatePhone(phone) {
    // if (/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{6})(?: *x(\d+))?\s*$/.test(phone)) {
    if (/\d{10,15}/.test(phone)) {
      return true
    }
    return false
  }
  // fonction tranformer
  getHeadingString(heading) {
    if (!isNaN(heading) && (heading >= 0.0)) {
      var h = Math.round(heading / 45.0) % 8;
      //return DIRECTION[(h > 7)? 0 : h];
      switch (h) {
        case 0: return "N";
        case 1: return "NE";
        case 2: return "E";
        case 3: return "SE";
        case 4: return "S";
        case 5: return "SW";
        case 6: return "W";
        case 7: return "NW";
      }
      return "N"; // default
    } else {
      return "";
    }
  }

  formatAge2(seconds) {
    let table = []
    if (isNaN(seconds)) return "Jamais"
    // return age
    //days
    if (seconds > 0) {
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
    } else return seconds + 's'

  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
