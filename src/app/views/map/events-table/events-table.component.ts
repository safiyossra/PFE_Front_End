import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit, OnChanges {

  @Input() events: []
  @Input() displayedColumns: []
  @Input() columnNames: []
  @Input() pageSizeOptions?: []

  @Output() rowClick: EventEmitter<any> = new EventEmitter();
  @Output() rowDoubleClicked: EventEmitter<any> = new EventEmitter();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  dataSource = new MatTableDataSource()

  myPageSizeOptions = [5, 10, 15, 25];

  selectedPageSize = 15;
  // maxSize: number = 5;
  totalItems: number;
  currentPage: number = 1;
  numPages: number = 0;


  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes.events.currentValue)
    this.totalItems = this.dataSource.data.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onRowClicked(row: any) {
    // console.log('Row clicked: ', row);
    this.rowClick.emit(row.id)
  }

  onRowDoubleClicked(row: any) {
    // console.log('Row double clicked: ', row);
    this.rowDoubleClicked.emit(row.id)
  }
}
