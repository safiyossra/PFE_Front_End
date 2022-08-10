import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-carburant-data-table',
  styleUrls: ['my-carburant-data-table.component.scss'],
  templateUrl: 'my-carburant-data-table.component.html',
})
export class MyCarburantDataTableComponent implements OnChanges {
  @Output() positionClick?: EventEmitter<any> = new EventEmitter();
  @Output() openPointsClick?: EventEmitter<any> = new EventEmitter();
  @Input() data: any = [];
  @Input() selectedMapDevice: any; //displayColumns,
  @Input() columnNames?= ["Date/Heure", "ID", "Vehicule", "Latitude/Longitude", "Carburant total (L)", "Carburant avant (L)", "Carburant après (L)", "Carburant diff (L)", "Carburant réel (L)", "Odomètre", "Adresse"];
  @Input() columns?= ["timestamp", "deviceID", "device", "latlng", "fuelTotal", "fuelstart", "fuelLevel", "deltaFuelLevel", "cr", "odometerKM", "address"];
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Input() showPoints ?= true;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public displayedColumns = this.columns
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 0;
  public numPages: number = 0;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d) {
        // console.log("ngOnChanges data");
        // console.log(d);
        this.dataSource = new MatTableDataSource(d)
        this.displayedColumns = this.columns
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
  }

  openLocation(timeStart) {
    // console.log(timeStart, timeEnd);
    let out = { "timeStart": timeStart, "timeEnd": timeStart, "selectedMapDevice": this.selectedMapDevice }
    this.positionClick.emit(out)
  }

  openMapPoints() {
    this.openPointsClick.emit(this.selectedMapDevice)
  }
}

