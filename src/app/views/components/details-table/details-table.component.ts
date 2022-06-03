import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'details-table',
  styleUrls: ['details-table.component.scss'],
  templateUrl: 'details-table.component.html',
})
export class DetailsTableComponent implements OnChanges {
  @Input() url: string
  public columnNames = ["Time Stamp","Odometer (KM)","Status Code","Speed"]
  public pageSizeOptions = [10, 15, 20, 30, 50, 100];
  public data: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public isLoading: boolean = false
  public displayedColumns: any = ["timestamp","odometerKM","statusCode","speedKPH"]
  public selectedPageSize = 10;
  public maxSize: number = 5;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public numPages: number = 0;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      let change = changes['url'].currentValue
      if (change != "") {
        this.url=change
        this.loadData()
      }
    }
  }

  loadData(){
    this.isLoading = true;
    var urlTmp = this.url+"&limE="+this.selectedPageSize+"&page="+this.currentPage
    this.dataService.getDetails(urlTmp).subscribe({
      next: (d:any) => {
        this.dataSource = new MatTableDataSource(d.data)
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length =  d.total
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
    })

  }

  pageChanged(event: PageEvent) {
    console.log({ event })
    this.selectedPageSize = event.pageSize
    this.currentPage = event.pageIndex
    this.loadData()
  }
}

