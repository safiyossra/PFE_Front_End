import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
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


export class MyTableComponent implements OnChanges {

  @Input() showFullScreenControle?: Boolean = true
  @Input() showCollapsControle?: Boolean = true
  @Input() showColumnsControle?: Boolean = true
  @Input() vehicules: Vehicule[]


  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  @Output() rowDoubleClicked: EventEmitter<any> = new EventEmitter();
  @Output() shareClicked: EventEmitter<any> = new EventEmitter();
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

  // TODO
  customFilterPredicate() {
    const myFilterPredicate = (data: Vehicule, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return (
        data.statusCode.toString().indexOf(searchString.statusCode) !== -1 &&
        data.name
          .toString()
          .toLowerCase()
          .indexOf(searchString.name.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

    this.dataSource = new MatTableDataSource(changes.vehicules.currentValue)
    this.dataSource.filterPredicate = this.customFilterPredicate()
    this.totalItems = this.dataSource.data.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.applyFilter()///////////////////////////////////////////////////////
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {///////////////////////////////////////////////////////
      this.dataSource.paginator.firstPage();///////////////////////////////////////////////////////
    }///////////////////////////////////////////////////////
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("filterValue", filterValue);
    this.filterValues['name'] = filterValue
    this.applyFilter()///////////////////////////////////////////////////////
  }

  applySort(status) {
    switch (status) {
      case 'moving':
        this.filterValues['statusCode'] = '61714'
        break;

      case 'on':
        this.filterValues['statusCode'] = '62465'
        break;

      case 'off':
        this.filterValues['statusCode'] = '62467'
        break;

      // case 'other':
      //   this.filterValues['statusCode'] = ''
      //   break;

      default:
        this.filterValues['statusCode'] = ''
        break;
    }
    this.applyFilter()///////////////////////////////////////////////////////
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

  share_Clicked(row: any) {
    const isLargeNumber = (element) => element.id == row.id;
    let index = this.vehicules.findIndex(isLargeNumber)
    this.shareClicked.emit(index)
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

  isNaN2(v) {
    v = this.tools.getAge(v)
    return isNaN(v) || v > 21600 ? "fa fa-warning text-warning status-cercle" : "rounded-circle p-1 h6 cil-check bg-success mr-1";
  }
}
