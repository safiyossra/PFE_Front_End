import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-synthetiques-table',
  styleUrls: ['my-synthetiques-table.component.scss'],
  templateUrl: 'my-synthetiques-table.component.html',
})
export class MySynthetiquesTableComponent implements OnChanges {
  @Input() data = [];
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public displayedColumns = ["d", "km", "v", "c", "cm", "cd", "ct"];
  columnNames = ["Véhicule", "KM Parcourue", "Vitesse Maximale (Km/h)", "Consommation (L)", "Consommation (%)", "Consommation (MAD)", "Consommation Theorique (%)"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 0;
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

  // onRowClicked(row: any) {
  //   console.log('Row clicked: ', row);
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      // console.log("data");
      // console.log(d);
      if (!d || d.length == 0) { d = [] }
      this.dataSource = new MatTableDataSource(d)
      this.totalItems = this.dataSource.data.length
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
  }
}

