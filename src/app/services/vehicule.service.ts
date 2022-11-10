import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from './../../environments/environment'

import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  constructor(private http: HttpClient, private route: Router, private JWT: JwtService) { }

  getData(extra = "") {
    let SERVER_URL = environment.apiUrl + "list?" + extra;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    // http://app.sendatrack.com:8080/eventsApp/data.jsonx?a=actitrans&p=senda65432&u=support&g=all&l=2
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getVehicle4Track(extra = "") {
    let SERVER_URL = environment.apiUrl + "getVehicle4Track?" + extra;
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    // http://app.sendatrack.com:8080/eventsApp/data.jsonx?a=actitrans&p=senda65432&u=support&g=all&l=2
    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getVehiculeEvents(api) {
    // + "map-events?d=" + id;
    let SERVER_URL = environment.apiUrl + api
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }

  getVehiculeEventsByTimestamps(api, timestamps) {
    // + "map-events?d=" + id;
    let SERVER_URL = environment.apiUrl + api
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { "t": timestamps }
    })
  }

  getDashboardStats(p: string) {
    let SERVER_URL = environment.apiUrl + "dashboard-stats?p=" + p;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });

    return this.http.get(SERVER_URL, {
      headers: headers,
    })

  }

  getIndexes(params: string) {
    let SERVER_URL = environment.apiUrl + "EcoDriving" + params;
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });

    return this.http.get(SERVER_URL, {
      headers: headers,
    })
  }


  getVehicule() {
    let SERVER_URL = environment.apiUrl + "vehicule";
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
