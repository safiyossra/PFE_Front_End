import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Device } from '../models/device';
import { Driver } from '../models/driver';
import { Groupevehicules } from '../models/groupevehicules';
import { Consommation } from '../models/Consommation';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient, private JWT: JwtService) {
  }

  getVehicule(extra = "") {
    let SERVER_URL = environment.apiUrl + "vehicule" + extra;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getStatistique(urlParams) {
    let SERVER_URL = environment.apiUrl + "statistique" + urlParams;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getRapportSynthetiques(urlParams) {
    let SERVER_URL = environment.apiUrl + "synthetiques" + urlParams;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getAllTrajets(urlParams) {
    let SERVER_URL = environment.apiUrl + "trajet-jour" + urlParams + "&k&na&da&dc&c&t&v&addi&addf";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getPoseFuel(urlParams) {
    let SERVER_URL = environment.apiUrl + "poseFuel" + urlParams;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  //fonction de detail
  getDetails(urldetails) {
    let SERVER_URL = environment.apiUrl + "eventspagination" + urldetails;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getEvolution(urldetails) {
    let SERVER_URL = environment.apiUrl + "eventsEvolution" + urldetails;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  // fonction de AlertPlanEntretien
  getPlanEntretien(urlplan) {
    let SERVER_URL = environment.apiUrl + "planentretien" + urlplan;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  // fonction de notifications
  getNotifications(urlNotif) {
    let SERVER_URL = environment.apiUrl + "notif" + urlNotif;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getNotifRules(p) {
    let SERVER_URL = environment.apiUrl + "getNotifRules" + p;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  addRule(rule) {
    let SERVER_URL = environment.apiUrl + "createRule";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(rule) }

    })
  }

  updateRule(rule) {
    let SERVER_URL = environment.apiUrl + "editRule";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(rule) }

    })
  }

  delRule(rule) {
    let SERVER_URL = environment.apiUrl + "deleteRule" + rule;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getGroupedUnseenNotifs() {
    let SERVER_URL = environment.apiUrl + "getGroupedUnseenNotifs";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getDeviceData(urld) {
    let SERVER_URL = environment.apiUrl + "gestionvehicules" + urld;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getDriverData(urldriver) {
    let SERVER_URL = environment.apiUrl + "gestiondriver" + urldriver;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getGroupeVehicules(urlgrp) {
    let SERVER_URL = environment.apiUrl + "groupevehicules" + urlgrp;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getUsers(urluser) {
    let SERVER_URL = environment.apiUrl + "gestionusers" + urluser;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  addUsers(user: User) {
    let SERVER_URL = environment.apiUrl + "createUser";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(user) }

    })
  }

  updateUsers(user: User) {
    let SERVER_URL = environment.apiUrl + "editUser";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(user) }

    })
  }

  delUsers(u) {
    let SERVER_URL = environment.apiUrl + "deleteUser" + u;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  updateDevice(vehicule: Device) {
    let SERVER_URL = environment.apiUrl + "editVehicule";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { v: JSON.stringify(vehicule) }

    })
  }

  addDriver(driver: Driver) {
    let SERVER_URL = environment.apiUrl + "addDrivers";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { d: JSON.stringify(driver) }

    })
  }

  updateDriver(driver: Driver) {
    let SERVER_URL = environment.apiUrl + "editDrivers";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { d: JSON.stringify(driver) }

    })
  }

  delDriver(d) {
    let SERVER_URL = environment.apiUrl + "deleteDrivers" + d;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  addDevicesGroup(group: Groupevehicules) {
    let SERVER_URL = environment.apiUrl + "addGroupeVehicules";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { g: JSON.stringify(group) }
    })
  }

  updateDevicesGroup(group: Groupevehicules) {
    let SERVER_URL = environment.apiUrl + "editGroupeVehicules";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { g: JSON.stringify(group) }

    })
  }

  delDevicesGroup(g) {
    let SERVER_URL = environment.apiUrl + "deleteGroupeVehicules" + g;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  // get Consommation
  getConsommation(urlplan) {
    let SERVER_URL = environment.apiUrl + "consommation" + urlplan;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  // create consommation
  addConsommation(consommation: Consommation) {
    let SERVER_URL = environment.apiUrl + "addConsommation";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { c: JSON.stringify(consommation) }
    })
  }

  // edit consommation
  editConsommation(consommation: Consommation) {
    let SERVER_URL = environment.apiUrl + "editConsommation";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { c: JSON.stringify(consommation) }
    })
  }

  // delete consommation
  deleteConsommation(id) {
    let SERVER_URL = environment.apiUrl + "deleteConsommation" + id;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

}
