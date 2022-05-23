import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from './../../environments/environment'

import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  constructor(private http: HttpClient, private route: Router, private JWT: JwtService) { }

  getData() {
    let SERVER_URL = environment.apiUrl + "test";
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
}
