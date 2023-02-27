import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-order-form-table',
  templateUrl: './order-form-table.component.html',
  styleUrls: ['./order-form-table.component.scss']
})
export class OrderFormTableComponent implements OnChanges {
  @Input() data=[];
  // @Input() columnNames?: any[]
  public displayedColumns = ["actions","groupID","displayName","description","nbrvehicules"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Input() isEditPermission? = false

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames =["Actions","Identifiant","Nom","Description","Nombre de Véhicules"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() modify?: EventEmitter<any> = new EventEmitter();
  @Output() delete?: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClicked(row: any) {
    // console.log('Row clicked: ', row);
  }

  modif(ev) {
    this.modify.emit(ev)
  }

  supp(ev) {
    this.delete.emit(ev)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d && d.length>0) {
        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    if(changes['isEditPermission']){
      this.isEditPermission = changes['isEditPermission'].currentValue
      if(this.isEditPermission){
        this.displayedColumns = ["actions","groupID","displayName","description","nbrvehicules"]
        this.columnNames = ["Actions","Identifiant","Nom","Description","Nombre de Véhicules"];
      }else{
        this.displayedColumns = ["groupID","displayName","description","nbrvehicules"]
        this.columnNames = ["Identifiant","Nom","Description","Nombre de Véhicules"];
      }
    }
  }
}

