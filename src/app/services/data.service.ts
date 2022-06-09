import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from './../../environments/environment';
import { JwtService } from './jwt.service';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient, private JWT: JwtService) {


  }
  private resultList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  public resultList$: Observable<any[]> = this.resultList.asObservable();

  updateResultList(updatedList) {
    this.resultList.next(updatedList);
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
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public totalItems: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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


  getAllTrajets(urlParams) {
    let SERVER_URL = environment.apiUrl + "trajet-jour" + urlParams+"&k&na&da&dc&c&t&v&cr&addi&addf";
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

}
