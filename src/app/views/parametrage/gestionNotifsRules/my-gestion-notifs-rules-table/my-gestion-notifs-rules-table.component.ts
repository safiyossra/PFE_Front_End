import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-gestion-notifs-rules-table',
  styleUrls: ['my-gestion-notifs-rules-table.component.scss'],
  templateUrl: 'my-gestion-notifs-rules-table.component.html',
})
export class MyGestionNotifsRulesTableComponent implements OnChanges {
  @Input() data = [];
  // @Input() columnNames?: any[]
  public displayedColumns = ["actions", "ruleID", "description", "notifyEmail", "isCronRule"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Output() modify?: EventEmitter<any> = new EventEmitter();
  @Output() delete?: EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnNames = ["Actions", "Identifiant", "Description", "Email", "Cron Rule"]
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;
  loadDonnee: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor() { }


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

  supp(ev) {
    this.delete.emit(ev)
    if (confirm("Are you sure to delete " + ev)) { console.log("Implement delete functionality here"); }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d && d.length > 0) {
        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
  }

  formatAge(seconds) {
    if (isNaN(seconds)) return "Jamais"
    // return age
    //days 
    let days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    //hours 
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    //minutes 
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    //output 
    return `${days > 0 ? days + " Jours, " : ''}${hours > 0 ? hours + " Heurs, " : ''}${minutes > 0 ? minutes + " minutes, " : ''}${seconds > 0 ? seconds + " seconds" : ''}`;
  }
}

