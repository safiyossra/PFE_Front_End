import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from './../../environments/environment'

import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor(private http: HttpClient, private JWT: JwtService) { }

  getData(param="") {
    let SERVER_URL = environment.apiUrl + "zones"+param;
    let jwt = this.JWT.get();

    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });

    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  getPoi() {
    let SERVER_URL = environment.apiUrl + "zones?zoneType"; //?zoneType=4
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });

    return this.http.get(SERVER_URL, {
      headers: headers
    })
  }

  addZone(zone) {
    let SERVER_URL = environment.apiUrl + "addZone";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(zone) }

    })
  }

  updateZone(zone) {
    let SERVER_URL = environment.apiUrl + "editZone";
    let jwt = this.JWT.get();
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    return this.http.get(SERVER_URL, {
      headers: headers,
      params: { u: JSON.stringify(zone) }

    })
  }

  delZone(zone) {
    let SERVER_URL = environment.apiUrl + "deleteZone" + zone;
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
