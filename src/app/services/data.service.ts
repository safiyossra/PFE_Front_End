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

  generateTrackToken(extra = "") {
    let SERVER_URL = environment.apiUrl + "generateTrackToken" + extra;
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
    let SERVER_URL = environment.apiUrl + "planEntretien" + urlplan;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  addPlanEntretien(plan) {
    let SERVER_URL = environment.apiUrl + "addPlanEntretien";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(plan) }

    })
  }

  updatePlanEntretien(plan) {
    let SERVER_URL = environment.apiUrl + "editPlanEntretien";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(plan) }

    })
  }

  delPlanEntretien(plan) {
    let SERVER_URL = environment.apiUrl + "deletePlanEntretien" + plan;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  updateStatusPlanEntretien(plan) {
    let SERVER_URL = environment.apiUrl + "updateStatusPlanEntretien" + plan;
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

  updateDeviceOffset(vehicule: any) {
    let SERVER_URL = environment.apiUrl + "editVehicule?offset=true";
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

  /********** Add schema for device ******** */
  addShema(axe: any) {
    let SERVER_URL = environment.apiUrl + "addSchema";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { schema: JSON.stringify(axe) }

    })
  }

  /********** Get schema for device ******** */
  getSchema(url) {
    let SERVER_URL = environment.apiUrl + "schema" + url;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,

    })
  }

  /********** Delete axe for device ******** */
  deleteAxe(axe) {
    let SERVER_URL = environment.apiUrl + "deleteAxe";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { axe: JSON.stringify(axe) }
    })
  }

  /******** Add Document for Device ******* */
  AddOrUpdateDeviceDocument(endPoint,doc) {
    let SERVER_URL = environment.apiUrl + endPoint;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { doc: JSON.stringify(doc) }

    })
  }

  /******** Delete Document for Device ******* */
  deleteDeviceDocument(doc) {
    let SERVER_URL = environment.apiUrl + "deleteDocVehicule";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { doc: JSON.stringify(doc) }

    })
  }


  /******** Add Pneu for Device ******* */
  addPneu(pneu) {
    let SERVER_URL = environment.apiUrl + "addPneu";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { pneu: JSON.stringify(pneu) }

    })
  }

  /******** get All changements pneu ******* */
  getChangemantsPneu(deviceID) {

    let SERVER_URL = environment.apiUrl + "changementsPneu" + deviceID;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }

  /******** Delete changements pneu ******* */
  deleteCangementPneu(idPneu) {
    let SERVER_URL = environment.apiUrl + "deleteChangementPneu" + idPneu;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,

    })
  }


  /******** Edit changements pneu ******* */
  updateCangementPneu(Pneu) {
    let SERVER_URL = environment.apiUrl + "editChangementPneu";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { pneu: JSON.stringify(Pneu) }
    })
  }


  /******** get All Device Documents ******* */
  getDeviceDocuments(url) {
    let SERVER_URL = environment.apiUrl + "getDocVehicule" + url;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }


  /******** Add Driver Document ******* */
  addDriverDocument(doc) {
    let SERVER_URL = environment.apiUrl + "addDriverDocuments";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { doc: JSON.stringify(doc) }

    })
  }

  /******** Get Driver Document ******* */
  getDriverDocument(driverID) {
    let SERVER_URL = environment.apiUrl + "getDriverDocuments" + driverID;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }

  
  getStream() {
    let SERVER_URL = 'http://api.tvmaze.com/search/shows?q=golden%20girls';
    // let params: {
    //   modules: 'A comma-delimited list of one or more insights to request.',
    //   id: 'An ID that uniquely identifies a video. The Video object\'s videoId field contains the ID that you set this parameter to.'
    // };
    let headers: {
      'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
      'X-RapidAPI-Host': 'bing-video-search1.p.rapidapi.com'
    }
    return this.http.get(SERVER_URL, {
      headers: headers,
      // params: params
    })
  }


  /****************** Accidents Services **************** */
  saveAccident(accident) {
    let SERVER_URL = environment.apiUrl + "saveAccident";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { accident: JSON.stringify(accident) }

    })
  }

  getAccident() {
    let SERVER_URL = environment.apiUrl + "getAccidents";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get<any>(SERVER_URL, {
      headers: headers,
    }
    )
  }


  deleteAccident(id) {
    let SERVER_URL = environment.apiUrl + "deleteAccident" + id;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    }
    )
  }

  saveAccidentComment(comment, accident) {
    let SERVER_URL = environment.apiUrl + "saveAccidentComment" + accident;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { comment: JSON.stringify(comment) }

    })
  }

  getAccidentCommnet(accidentID) {
    let SERVER_URL = environment.apiUrl + "getAccidentComments" + accidentID;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get<any>(SERVER_URL, {
      headers: headers,
    })
  }

  deleteAccidentComment(id) {
    let SERVER_URL = environment.apiUrl + "deleteAccidentComment" + id;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    }

    )
  }

  /*************** Assurance Services ***************** */

  savePlanAssurance(plan) {
    let SERVER_URL = environment.apiUrl + "saveAssurance";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { plan: JSON.stringify(plan) }

    })
  }

  getPlanAssurance() {
    let SERVER_URL = environment.apiUrl + "getPlan";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get<any>(SERVER_URL, {
      headers: headers,
    })
  }

  deletePlanAssurance(assuranceID) {
    let SERVER_URL = environment.apiUrl + "deletePlan" + assuranceID;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get<any>(SERVER_URL, {
      headers: headers,
    })
  }

  editPlanAssurance(plan) {
    let SERVER_URL = environment.apiUrl + "editPlan";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get<any>(SERVER_URL, {
      headers: headers,
      params: { plan: JSON.stringify(plan) }
    })
  }



  getEtapes() {
    let SERVER_URL = environment.apiUrl + "getEtapes";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }
  saveEtape(etape) {
    let SERVER_URL = environment.apiUrl + "saveEtape";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { etape: JSON.stringify(etape) }
    })
  }

  // get docVehicule by idVehicule && type assurance
  getAssuranceVehicule(deviceID) {
    let SERVER_URL = environment.apiUrl + "getAssuranceVehicule" + deviceID;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }

}
