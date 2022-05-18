import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  constructor(private http: HttpClient) { }

  getData() {
    // return this.http.get('http://app.sendatrack.com:8080/events7/data.jsonx?a=demo&p=senda65432&u=support&g=all&l=2', {
    //   headers: new HttpHeaders({
    //   })
    // })
    return this.http.get('http://backup.sendatrack.com/iosen/api/test', {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })
    })
  }
}
