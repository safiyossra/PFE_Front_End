import { Component, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, Injector, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vehicule } from 'src/app/models/vehicule';
import { util } from 'src/app/tools/utils';
import { MapComponent } from '../../map/map.component';

@Component({
  selector: 'my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})


export class MyTableComponent implements AfterViewInit, OnChanges, OnInit {

  isFullScreen: boolean;
  @Input() showFullScreenControle?: Boolean = true
  @Input() showColumnsControle?: Boolean = true
  @Input() showCollapsControle?: Boolean = true
  @Input() vehicules: Vehicule[]

  displayedColumns: string[] = ['#', 'name', 'speed', 'fuelLevel'];

  public dataSource = new MatTableDataSource<Vehicule>();

  public pageSizeOptions = [5, 10, 15, 25];

  public selectedPageSize = 15;
  // public maxSize: number = 5;
  public totalItems: number;
  public currentPage: number = 1;
  public numPages: number = 0;

  _parent: any

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _injector: Injector, private tools: util) {
    document.onfullscreenchange = () => this.chkScreenMode();
  }

  ngOnInit(): void {
    // this.dataSource.filterPredicate = function (record, filter) {
    //   return record.name.indexOf(filter) != -1;
    // }
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource<Vehicule>(this.vehicules)
    this.totalItems = this.dataSource.data.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<Vehicule>(changes.vehicules.currentValue)
    this.totalItems = this.dataSource.data.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  onRowDoubleClicked(row: any) {
    console.log('Row double clicked: ', row);
  }

  get typesCount() {
    let typesCount = [0, 0, 0, 0]
    this.vehicules.map(vehicule => {
      if (vehicule.statusCode == 61714) {
        typesCount[0] += 1;
      } else if (vehicule.statusCode == 62465) {
        typesCount[1] += 1;
      } else if (vehicule.statusCode == 62467) {
        typesCount[2] += 1;
      } else {
        typesCount[3] += 1;
      }
    })

    return typesCount
  }

  toggleListFullscreen() {
    if (!this.isFullScreen) {
      this.tools.openFullscreen(document.getElementById("list-vehicules"))
    }
    else {
      this.tools.closeFullscreen()
    }
  }

  chkScreenMode() {
    var fullScreenCtl = document.getElementById("list-fullscreenControl")
    if (document.fullscreenElement) {
      //fullscreen
      fullScreenCtl.style.backgroundPosition = "64% 96%";
      fullScreenCtl.setAttribute("title", "Exit FullScreen");
      this.isFullScreen = true;
    } else {
      //not in full screen
      fullScreenCtl.style.backgroundPosition = "55% 2%";
      fullScreenCtl.setAttribute("title", "Enter FullScreen");
      this.isFullScreen = false;
    }
  }
}
