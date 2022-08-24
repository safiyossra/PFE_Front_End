import { catchError } from 'rxjs/operators';
import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { util } from 'src/app/tools/utils';
import { throwError } from 'rxjs';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'details-table',
  styleUrls: ['details-table.component.scss'],
  templateUrl: 'details-table.component.html',
})
export class DetailsTableComponent implements OnChanges, OnInit {
  @Output() positionClick?: EventEmitter<any> = new EventEmitter();
  @Output() exportEvents?: EventEmitter<any> = new EventEmitter();
  @Input() url: string
  @Input() selectedMapDevice: any;
  @Input() capacity: any;
  @Input() exportEvts: any;
  @Input() tableID = "Detaill";
  @Input() geo:boolean = false;
  // public columnNames = ["Date","Status","Pushpin Code","Lat/Lon","Vitesse(km/h)","Distance en kilométrage","Carburant %","Fuel Vol(L)","Carburant Total(L)","Adresse","Insert Date"]
  // Pushpin Code , Carburant %,
  public columnNames = this.geo ? ["Zone", "date entré", "adresse avant", "odometre avant", "date sortie", "adresse aprés", "odometre aprés", "durée dans la zone"] : ["Date", "Status", "Lat/Lon", "Vitesse(km/h)", "Kilométrage"/*,"Carburant %"*/, "Fuel Vol(L)", "Carburant Total(L)", "Adresse", "Insert Date"]
  public pageSizeOptions = [10, 15, 20, 30, 50, 100, 200, 500, 1000, 2000];
  // public data: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public isLoading: boolean = false
  public displayedColumns: any = this.geo ?  ["zoneName", "dateDepStr", "addressDep", "odometerDep", "dateArrStr", "addressArr", "odometerArr", "dureeStr"] :  ["timestamp", "status", "latlon", "speedKPH", "odometerKM",/* "",*/"fuelLevel", "fuelTotal", "address", "creationTime"]//["date","status","latlon","speed","odom","fuelvol","carbtotal","address"]
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public numPages: number = 0;
  loadDonnee: any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService, private tools: util, private router: Router) { }

  ngOnInit(): void {
    this.columnNames = this.geo ? ["Zone", "date entré", "adresse avant", "odometre avant", "date sortie", "adresse aprés", "odometre aprés", "durée dans la zone"] : ["Date", "Status", "Lat/Lon", "Vitesse(km/h)", "Kilométrage"/*,"Carburant %"*/, "Fuel Vol(L)", "Carburant Total(L)", "Adresse", "Insert Date"]
    this.displayedColumns = this.geo ?  ["zoneName", "dateDepStr", "addressDep", "odometerDep", "dateArrStr", "addressArr", "odometerArr", "dureeStr"] :  ["timestamp", "status", "latlon", "speedKPH", "odometerKM",/* "",*/"fuelLevel", "fuelTotal", "address", "creationTime"]//["date","status","latlon","speed","odom","fuelvol","carbtotal","address"]
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  OnInit() {
    this.dataSource.paginator = this.paginator;
  }

  // onRowClicked(row: any) {
  //   console.log('Row clicked: ', row);
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      let change = changes['url'].currentValue
      if (change != "") {
        this.url = change;
        this.currentPage = 0;
        this.loadData();
      }
    }
    if (changes['exportEvts']) {
      let change = changes['exportEvts'].currentValue
      if (change && change.type)
        this.export(change.type)
    }
  }

  pageSizeChange(ev){
    console.log(ev);
  }

  loadData() {
    this.isLoading = true;

    var route = this.router

    var urlTmp = this.url + "&limE=" + this.selectedPageSize + "&page=" + (this.currentPage+1)

    this.geo ? this.dataService.getDetails(urlTmp+"&geozone=true")
    .pipe(
      catchError(err => {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
        else if (err.status == 400) {
          console.log(err);
        }
        return throwError(err);
      })
    )
    .subscribe({
      next: (d: any) => {
        console.log("geoZone",d.data);
        this.dataSource = new MatTableDataSource(d.data)
        this.loadDonnee = d.data;
        this.loadDonnee.forEach((e) => {
          e.dateDepStr = e.dateDep != '' ? this.tools.formatDate(this.tools.timeStampToDate(e.dateDep)) : '';
          e.dateArrStr = e.dateArr != '' ? this.tools.formatDate(this.tools.timeStampToDate(e.dateArr)) : '';
          e.dureeStr = (new Date(e.duree).toISOString().slice(11, 19));
        })
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = d.total
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    }) :

    this.dataService.getDetails(urlTmp).subscribe({
      next: (d: any) => {
        this.dataSource = new MatTableDataSource(d.data)
        this.loadDonnee = d.data;
        this.loadDonnee.forEach((e) => {
          e.timestamp = this.tools.formatDate(new Date(Number.parseInt(e.timestamp) * 1000));
          e.creationTime = this.tools.formatDate(new Date(Number.parseInt(e.creationTime) * 1000));
          e.status = this.tools.getStatusName(e.statusCode)
          e.fuelLevel = this.round2d(e.fuelLevel * this.capacity)
        })
        console.log("events", this.loadDonnee);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = d.total
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    });
  }
  round2d(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }
  pageChanged(event: PageEvent) {
    // console.log({ event })
    this.selectedPageSize = event.pageSize
    this.currentPage = event.pageIndex
    this.loadData()
  }

  openLocation(e) {
    // console.log("openLocation");
    // console.log(e);
    let out = { "timeStart": e, "selectedMapDevice": this.selectedMapDevice }
    this.positionClick.emit(out)
  }

  export(type) {
    console.log("export(type)");
    console.log(type);
    if (this.loadDonnee && this.loadDonnee.length) {
      let out = { data: this.loadDonnee, type: type }
      this.exportEvents.emit(out)
    }
  }
}

