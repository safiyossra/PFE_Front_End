import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataService } from '../../../services/data.service';
import { TabsComponent } from '../../rapports/tabs.component';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-data-table',
  styleUrls: ['my-data-table.component.scss'],
  templateUrl: 'my-data-table.component.html',
})
export class MyDataTableComponent implements AfterViewInit {
  @Input() data:any;
  
  @Input() displayedColumns:any = [this.tabsComponent.selectedparam1, this.tabsComponent.selectedparam2, this.tabsComponent.selectedparam3, this.tabsComponent.selectedparam4];
  public statistique:any = [ ];

  dataSource: MatTableDataSource<any>=new MatTableDataSource();
  public pageSizeOptions = [5,10,25,50,100];

  public selectedPageSize = 10;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService:DataService,private http: HttpClient, private tabsComponent:TabsComponent){
   

   // this.dataService.updateResultList([this.tabsComponent.selectedparam1, this.tabsComponent.selectedparam2, this.tabsComponent.selectedparam3, this.tabsComponent.selectedparam4])
    //this.displayedColumns = this.getColumns()
  }

  getColumns(){
    this.dataService.resultList$.subscribe((result) =>{
      this.displayedColumns = result
    })

    return this.displayedColumns
  }

  ngAfterViewInit() { 

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

  ngOnInit() {


  }
}

export interface PeriodicElement {
  Date: String;
  Km: number;
  DureeAr: number;
  Consom: number;
  DureeCond: number;
  NbrAr: number;
  TemprMax: number;
  TemprMin: number;
  TemprMoy: number;
  VitMax: number;
  VitMin: number;
  VitMoy: number;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
