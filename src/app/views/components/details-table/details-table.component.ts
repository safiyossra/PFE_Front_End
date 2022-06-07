import { DatePipe } from '@angular/common';
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
  providers: [DatePipe]
})
export class DetailsTableComponent implements OnChanges {
  @Input() url: string
 // public columnNames = ["Date","Status","Pushpin Code","Lat/Lon","Vitesse(km/h)","Distance en kilométrage","Carburant %","Fuel Vol(L)","Carburant Total(L)","Adresse","Insert Date"]
  // Pushpin Code , Carburant %, 
 public columnNames = ["Date","Status","Lat/Lon", "Vitesse(km/h)","Kilométrage"/*,"Carburant %"*/,"Fuel Vol(L)","Carburant Total(L)","Adresse","Insert Date"] 
  public pageSizeOptions = [10, 15, 20, 30, 50, 100];
  public data: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public isLoading: boolean = false
  public displayedColumns: any = ["timestamp","statusCode", "latlon", "speedKPH","odometerKM",/* "",*/"fuelLevel","fuelTotal","address", "creationTime"]//["date","status","latlon","speed","odom","fuelvol","carbtotal","address"]
  public selectedPageSize = 10;
  public maxSize: number = 5;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public numPages: number = 0;
  loadDonnee: any;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService, private datePipe:DatePipe) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  OnInit() {
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
        console.log(d);

        this.dataSource = new MatTableDataSource(d.data)
        this.loadDonnee = d.data;
        console.log(d.data);
        
        this.loadDonnee.forEach((e) => {
                //e.timestamp = new Date(Number.parseInt(e.timestamp) * 1000).toLocaleDateString();
                // e.creationTime = new Date(Number.parseInt(e.creationTime) * 1000).toLocaleDateString();
                //e.odometerKM = Math.round(Number.parseInt(e.odometerKM));
                //e.latitude = Math.round(Number.parseInt(e.latitude))+"/"+Math.round(Number.parseInt(e.longitude));
                e.timestamp = this.datePipe.transform( new Date(Number.parseInt(e.timestamp) * 1000),'Y-M-d | h:mm:ss');
                e.creationTime = this.datePipe.transform( new Date(Number.parseInt(e.creationTime) * 1000),'Y-M-d | h:mm:ss');                  
               // e.odometerKM = e.odometerKM.toFixed(2);
               // e.latitude = e.latitude.toFixed(2)+"/"+e.longitude.toFixed(2);
                if (e.statusCode == 61714) {e.statusCode="En Route";}
                if (e.statusCode == 62465) {e.statusCode="Moteur ON";}
                if (e.statusCode == 62467) {e.statusCode="Moteur OFF";}
              })
        console.log(this.loadDonnee);
        
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

  openLocation(e){
console.log(e);

  }


}

