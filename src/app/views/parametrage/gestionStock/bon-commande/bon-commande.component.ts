import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Stock } from 'src/app/models/stock';

@Component({
  selector: 'app-bon-commande',
  templateUrl: './bon-commande.component.html',
  styleUrls: ['./bon-commande.component.scss']
})
export class BonCommandeComponent implements OnChanges {

  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() data=[];
  // @Input() columnNames?: any[]
  public displayedColumns = ["actions","DateMvt","NumBon","id_Store"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Input() isEditPermission? = false

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames =["Actions","Date de Mouvment","Document","dépot"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;
  showSecondTable = false;
  secondTableColumns = ['DateMvt', 'NumBon','id_Store'] ;

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

  dele(ev) {
    this.delete.emit(ev)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d /*&& d.length>0*/) {
        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    if(changes['isEditPermission']){
      this.isEditPermission = changes['isEditPermission'].currentValue
      if(this.isEditPermission){
        this.displayedColumns = ["actions","DateMvt","NumBon","id_Store"]
        this.columnNames = ["Actions","Date de Mouvment","Document","dépot"];
      }else{
        this.displayedColumns = ["actions","DateMvt","NumBon","id_Store"]
        this.columnNames = ["Actions","Date de Mouvment","Document","dépot"];
      }
    }
  }

toggleTable() {
  this.showSecondTable = !this.showSecondTable;
}
selectedTab = 0
typeSelected = []
openAlert: boolean = false
st: Stock = new Stock();
selectTab(i) {
  this.selectedTab = i
}

}


