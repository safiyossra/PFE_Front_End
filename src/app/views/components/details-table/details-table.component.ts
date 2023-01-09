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
export class DetailsTableComponent implements OnChanges {
  @Output() positionClick?: EventEmitter<any> = new EventEmitter();
  @Output() exportEvents?: EventEmitter<any> = new EventEmitter();
  @Output() openPointsClick?: EventEmitter<any> = new EventEmitter();
  @Input() url: string
  @Input() selectedMapDevice: any;
  @Input() capacity: any;
  @Input() offset: any;
  @Input() drivers: any;
  @Input() exportEvts: any;
  @Input() tableID = "Detaill";
  // public columnNames = ["Date","Status","Pushpin Code","Lat/Lon","Vitesse(km/h)","Distance en kilométrage","Carburant %","Fuel Vol(L)","Carburant Total(L)","Adresse","Insert Date"]
  // Pushpin Code , Carburant %,
  public columnNames = ["Date", "Status", "Lat/Lon", "Vitesse(km/h)", "Kilométrage"/*,"Carburant %"*/, "Fuel Vol(L)", "Carburant Total(L)", "Adresse", "Conducteur"]//, "Insert Date"
  public pageSizeOptions = [10, 15, 20, 30, 50, 100, 200, 500, 1000, 2000, 4000, 6000, 8000];
  // public data: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public isLoading: boolean = false
  public displayedColumns: any = ["timestamp", "status", "latlon", "speedKPH", "odometerKM",/* "",*/"fuelLevel", "fuelTotal", "address", "driverID"]//, "creationTime"
  //["date","status","latlon","speed","odom","fuelvol","carbtotal","address"]
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public numPages: number = 0;
  loadDonnee: any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService, private tools: util, private router: Router) { }

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
    if (changes['drivers']) {
      let change = changes['drivers'].currentValue
      if (change) {
        this.drivers = change;
      }
    }
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

  loadData() {
    this.isLoading = true;

    var route = this.router

    var urlTmp = this.url + "&limE=" + this.selectedPageSize + "&page=" + (this.currentPage + 1)

      this.dataService.getDetails(urlTmp).subscribe({
        next: (d: any) => {
          this.dataSource = new MatTableDataSource(d.data)
          this.loadDonnee = d.data;
          this.loadDonnee.forEach((e) => {
            e.timestamp = this.tools.formatDate(this.tools.timeStampToDate(e.timestamp));
            // e.creationTime = this.tools.formatDate(this.tools.timeStampToDate(e.creationTime));
            e.status = this.tools.getStatusName(e.statusCode)
            e.driverID = this.tools.getDriverName(this.drivers,e.driverID)
            e.odometerKM = this.round2d(e.odometerKM + this.offset)
            e.fuelLevel = this.round2d(e.fuelLevel * this.capacity)
          })
          console.log("events", this.loadDonnee);
          // console.log("events", this.loadDonnee);
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
    this.currentPage = event.pageIndex

    if(event.pageSize != this.selectedPageSize)
      this.currentPage = 0;

    this.selectedPageSize = event.pageSize
    this.loadData()
  }

  openLocation(e) {
    // console.log("openLocation");
    // console.log(e);
    let out = { "timeStart": e, "selectedMapDevice": this.selectedMapDevice }
    this.positionClick.emit(out)
  }

  export(type) {
    // console.log("export(type)");
    // console.log(type);
    if (this.loadDonnee && this.loadDonnee.length) {
      let out = { data: this.loadDonnee, type: type }
      this.exportEvents.emit(out)
    }
  }
}

