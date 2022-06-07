import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from './../../environments/environment'

import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor(private http: HttpClient, private JWT: JwtService) { }

  getData() {
    let SERVER_URL = environment.apiUrl + "zones";
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
