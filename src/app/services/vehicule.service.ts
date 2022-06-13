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

  getData() {
    let SERVER_URL = environment.apiUrl + "list";
    let jwt = this.JWT.get();
    // if (jwt) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + jwt,
      'Accept': 'application/json'
    });
    // http://app.sendatrack.com:8080/events7/data.jsonx?a=actitrans&p=senda65432&u=support&g=all&l=2
    return this.http.get(SERVER_URL, {
      headers: headers
    })
    // } else {
    //   return this.route.navigate(['login']);
    // }
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
