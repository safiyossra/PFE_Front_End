import { Injectable ,ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { TabsComponent } from '../views/rapports/tabs.component';

@Injectable({
  providedIn: 'root'
})

export class DataService {

    constructor(private http: HttpClient){
   

      }
  private resultList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  public resultList$: Observable<any[]> = this.resultList.asObservable();

  updateResultList(updatedList) {
    this.resultList.next(updatedList);
  }

  getVehicule(){
    let headers = new HttpHeaders({
        'Accept': 'application/json',
      });
     return  this.http.get('http://backup.sendatrack.com/sendatrack/public/vehicule',{headers:headers})
  }
  dataSource: MatTableDataSource<any>=new MatTableDataSource();
  public totalItems: number = 0;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getStatistique(){  
    let headers = new HttpHeaders({
      'Accept': 'application/json',
    });
    return this.http.get('http://backup.sendatrack.com/sendatrack/public/statistique?d=dacia&st=1647298800&et=1647647999&dc&k&da&c',{headers:headers})
  } //urlParams
 }
