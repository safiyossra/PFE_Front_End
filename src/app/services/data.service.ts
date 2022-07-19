import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { JwtService } from './jwt.service';
import {  Observable} from 'rxjs';
import { User } from '../models/user';


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

  addUsers(user: User) {
    let SERVER_URL = environment.apiUrl + "createUser";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params:{u: JSON.stringify(user)}
      
    })
  }

  delUsers(user: User) {
    let SERVER_URL = environment.apiUrl + "deleteUser";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params:{u: JSON.stringify(user)}
      
    })
  }

  // private apiURL = "http://localhost:8000/api/AddUser/";

  // httpOptions = {
  //    headers: new HttpHeaders({
  //      'Content-Type': 'application/json'
  //    })
  // }
  // create(user): Observable<User> {
  //   return this.http.post<User>(this.apiURL, JSON.stringify(user), this.httpOptions)
  //   .pipe(
  //    // catchError(this.errorHandler)
  //   )
  // }
}
