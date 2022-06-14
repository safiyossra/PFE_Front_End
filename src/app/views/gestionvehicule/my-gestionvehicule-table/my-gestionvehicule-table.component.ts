import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-gestionvehicule-table',
  styleUrls: ['my-gestionvehicule-table.component.scss'],
  templateUrl: 'my-gestionvehicule-table.component.html',
})
export class MyGestionvehiculeTableComponent implements OnChanges {
  @Input() data=[];
  // @Input() columnNames?: any[]
  public displayedColumns =  ["id","v","date"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames =["Véhicule","Device","Num de Tel"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
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

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
  }

  ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['data']) {
  //   let d = changes['data'].currentValue
  //   if (d && d.length>0) {
  //     console.log("data");
      
  //     console.log(d);
  //     console.log(changes['columnNames']);
      
  //   this.dataSource = new MatTableDataSource(d)
  //   this.displayedColumns = this.columns
  //   this.totalItems = this.dataSource.data.length
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   }
  // }
}
}
