import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { util } from 'src/app/tools/utils';

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
  @Input() tableID?= "TrajetEco"
  @Input() selectedMapDevice: any; //displayColumns,
  @Input() columnNames?: any[]= ["Depart", "Arrivé","Adresse Depart", "Adresse Arivée", "Km Parcourue", "Conduite (min)", "Eco-Index", "Accélération", "Freinage", "Virage", "Max Vitesse (km/h)", "# Arrets", "Arret (min)", "Consom (L)", "Consom (%)", "Max Temp(°C)","Vehicule"]
  @Input() columns?: any[]=  ["timeStart", "timeEnd","addi", "addf", "k", "dc", "eco", "acc", "br", "cor", "v", "na", "da", "c", "cm", "t","device"];
  
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

  constructor(private tools: util) { }


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
        // console.log(d);
        this.dataSource = new MatTableDataSource(d)
        this.displayedColumns = this.columns
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.currentPage = 0;
      }
    }
  }

  openLocation(timeStart, timeEnd,selectedMapDevice,type) {
    // console.log(timeStart, timeEnd);
    var end = type==1?timeEnd:""
    let out = { "timeStart": timeStart, "timeEnd": end, "selectedMapDevice": selectedMapDevice }
    this.positionClick.emit(out)
  }

  openMapPoints() {
    this.openPointsClick.emit(this.selectedMapDevice)
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex

    if(event.pageSize != this.selectedPageSize)
      this.currentPage = 0;

    this.selectedPageSize = event.pageSize
  }

  showArretcheckbox() {
    this.showArretChange.emit(this.isArret)
  }
}

