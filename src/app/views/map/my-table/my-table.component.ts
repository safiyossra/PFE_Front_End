import { stringify } from '@angular/compiler/src/util';
import { Component, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vehicule } from 'src/app/models/vehicule';
import { util } from 'src/app/tools/utils';

@Component({
  selector: 'my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})


export class MyTableComponent implements OnChanges, OnInit {

  @Input() showFullScreenControle?: Boolean = true
  @Input() showCollapsControle?: Boolean = true
  @Input() showColumnsControle?: Boolean = true
  @Input() vehicules: Vehicule[]


  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  @Output() rowDoubleClicked: EventEmitter<any> = new EventEmitter();
  @Output() collapse: EventEmitter<any> = new EventEmitter();

  displayedColumns: string[] = ['#', 'name', 'speed', 'actions'];

  public dataSource = new MatTableDataSource();

  // public pageSizeOptions = [5, 10, 15, 25];

  public selectedPageSize = 5;
  public maxSize: number = 5;
  public totalItems: number;
  public currentPage: number = 1;
  public numPages: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  filterValues = {
    name: '',
    statusCode: ''
  }

  constructor(private tools: util) {
  }

  ngOnInit(): void {

  }

  // TODO
  customFilterPredicate() {
    const myFilterPredicate = (
      data: Vehicule,
      filter: string
    ): boolean => {

      let searchString = JSON.parse(filter);

      // console.log('searchString');
      // console.log(searchString);
      return (
        data.statusCode.toString().trim().indexOf(searchString.statusCode) !== -1 &&
        data.name
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.name.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  // ngAfterViewInit(): void {
  //   this.dataSource = new MatTableDataSource<Vehicule>(this.vehicules)
  //   this.totalItems = this.dataSource.data.length
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes.vehicules.currentValue)
    this.totalItems = this.dataSource.data.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterValues['name']
    // if (this.dataSource.filter != null) {
    //   this.applyFilter()
    // }
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues['name'] = filterValue

    this.dataSource.filter = filterValue
    // this.dataSource.filter = JSON.stringify(this.filterValues)

    // this.applyFilter()
  }

  applySort(status) {
    switch (status) {
      case 'moving':
        this.filterValues['statusCode'] = '61714 | 61111'
        break;

      case 'on':
        this.filterValues['statusCode'] = '62465'
        break;

      case 'off':
        this.filterValues['statusCode'] = '62467'
        break;

      case 'other':
        this.filterValues['statusCode'] = ''
        break;

      default:
        this.filterValues['statusCode'] = ''
        break;
    }

    // this.applyFilter()
  }

  onRowClicked(row: any) {
    // console.log('Row clicked: ', row);
    const isLargeNumber = (element) => element.id == row.id;

    let index = this.vehicules.findIndex(isLargeNumber)
    this.rowClicked.emit(index)
  }

  onRowDoubleClicked(row: any) {
    // console.log('Row double clicked: ', row);
    const isLargeNumber = (element) => element.id == row.id;

    let index = this.vehicules.findIndex(isLargeNumber)
    this.rowDoubleClicked.emit(index)
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
    if (!this.tools.isFullScreen) {
      this.tools.openFullscreen(document.getElementById("list-vehicules"))
    }
    else {
      this.tools.closeFullscreen()
    }
  }

  collapseClicked() {
    this.collapse.emit()
  }

  changeDisplayedColumn(newColumnList) {
    this.displayedColumns = newColumnList
  }
}
