import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-data-table',
  styleUrls: ['my-data-table.component.scss'],
  templateUrl: 'my-data-table.component.html',
})
export class MyDataTableComponent implements OnChanges {
  @Output() positionClick?: EventEmitter<any> = new EventEmitter();
  @Output() openPointsClick?: EventEmitter<any> = new EventEmitter();
  @Output() showArretChange?: EventEmitter<any> = new EventEmitter();
  @Input() data: any = [];
  @Input() isTrajet?= 1;
  @Input() tableID?= "myTable";
  @Input() selectedMapDevice: any; //displayColumns,
  @Input() columnNames?= ["Depart", "Arrivé", "Adresse Depart", "Adresse Arivée", "Km Parcourue", "Durée de conduite (min)", "Max Vitesse (km/h)", "# Arrets", "Consom Fuel (L)", "Consom (%)", "Consom (MAD)", "Consom Théorique (L)","Odomètre","Fuel"]
  @Input() columns?=  ["timeStart", "timeEnd", "addi", "addf", "k", "dc", "v", "na", "c", "cm", "cd", "ct","odo","ft"];


  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];

  isArret = false;
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
      if (d) {//&& d.length > 0
        // console.log("ngOnChanges data");
        // console.log(d);
        this.dataSource = new MatTableDataSource(d)
        this.displayedColumns = this.columns
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.selectedPageSize = 15;
        this.currentPage = 0;
      }
    }
  }

  openLocation(timeStart, timeEnd) {
    // console.log(timeStart, timeEnd);
    let out = { "timeStart": timeStart, "timeEnd": timeEnd, "selectedMapDevice": this.selectedMapDevice }
    this.positionClick.emit(out)
  }

  openMapPoints() {
    this.openPointsClick.emit(this.selectedMapDevice)
  }

  showArretcheckbox() {
    this.showArretChange.emit(this.isArret)
  }
}

