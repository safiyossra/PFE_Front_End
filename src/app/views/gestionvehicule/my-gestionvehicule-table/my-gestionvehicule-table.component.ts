import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';

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
  public displayedColumns =  ["actions","deviceID","description","simPhoneNumber"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100];
  @Output() modify?: EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames =["Actions","Véhicule","Device","Num de Tel"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;
  loadDonnee: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dataService: DataService, private datePipe: DatePipe) { }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  modif(ev){
    console.log("modif");
    console.log(ev);
    this.modify.emit(ev)

   // this.isLoading = true;
    var url = "?d="+ev
    this.dataService.getDeviceData(url).subscribe({
      next: (d: any) => {
        this.loadDonnee = d;
        this.loadDonnee.forEach((e) => {
          e.creationTime = this.formatDate(new Date(Number.parseInt(e.creationTime) * 1000));
        })
        console.log(this.loadDonnee);
       
        //this.isLoading = false;
      },
    })


  }
  
  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
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
}

formatDate(date: Date) {
  return this.datePipe.transform(date, 'MMM dd, HH:mm:ss');
}

}

