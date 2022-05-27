import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
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
  @Input() data: any;
  @Input() columnNames?: any[]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 25, 50, 100];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public displayedColumns: any = []
  public selectedPageSize = 10;
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
    if (changes['data'] || changes['columnNames']) {
    let d = changes['data'].currentValue
    if (d && d.length>0) {
    this.dataSource = new MatTableDataSource(d)
    this.displayedColumns = this.columns
    this.totalItems = this.dataSource.data.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }
  }
}
}

