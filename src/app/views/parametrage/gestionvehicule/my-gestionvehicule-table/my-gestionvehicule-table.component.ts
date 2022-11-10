import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { util } from 'src/app/tools/utils';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-gestionvehicule-table',
  styleUrls: ['my-gestionvehicule-table.component.scss'],
  templateUrl: 'my-gestionvehicule-table.component.html',
})
export class MyGestionvehiculeTableComponent implements OnChanges {
  @Input() data = [];
  // @Input() columnNames?: any[]
  public displayedColumns = ["actions", "deviceID", "description", "uniqueID", "lastOdometerKM", "fuel", "deviceCode", "simPhoneNumber", "creationTime"]
  @Input() columns?: any[]
  @Input() isEditPermission? = false
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Output() modify?: EventEmitter<any> = new EventEmitter();
  @Output() offset?: EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnNames = ["Actions", "Device", "Véhicule", "ID unique", "Odomètre (km)", "Total Carburant (L)", "device Code", "Tel", "Création date"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;
  loadDonnee: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dataService: DataService, private tools: util) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  modif(ev) {
    this.modify.emit(ev)
  }

  modifyOffset(ev){
    this.offset.emit(ev);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d) {//&& d.length > 0
        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    if(changes['isEditPermission']){
      this.isEditPermission = changes['isEditPermission'].currentValue
      if(this.isEditPermission){
        this.displayedColumns = ["actions", "deviceID", "description", "uniqueID", "lastOdometerKM", "fuel", "deviceCode", "simPhoneNumber", "creationTime"]
        this.columnNames =["Actions", "Device", "Véhicule", "ID unique", "Odomètre (km)", "Total Carburant (L)", "device Code", "Tel", "Création date"];
      }else{
        this.displayedColumns =["deviceID", "description", "uniqueID", "lastOdometerKM", "fuel", "deviceCode", "simPhoneNumber", "creationTime"]
        this.columnNames = ["Device", "Véhicule", "ID unique", "Odomètre (km)", "Total Carburant (L)", "device Code", "Tel", "Création date"];
      }
    }
  }


}

