import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-gestioncarburant-table',
  styleUrls: ['my-gestioncarburant-table.component.scss'],
  templateUrl: 'my-gestioncarburant-table.component.html',
})
export class MyGestioncarburantTableComponent implements OnChanges {
  @Input() data = [];
  // @Input() columnNames?: any[]
  public displayedColumns = ['id',
    'driverID',
    'deviceID',
    'dateFill',
    'montant',
    'numCarte',
    'qte',
    'kmPrecedent',
    'kmEncours',
    'fournisseur',
    'observation',
    'montantTTC',
    'numBon',
    'pleinOn',
    'consoM']
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames = ['id',
    'Chauffeur',
    'Vehicule',
    'Date',
    'Montant',
    'N Carte',
    'Qte',
    'KM Precedent',
    'KM Encours',
    'Fournisseur',
    'Observation',
    'Montant TTC',
    'N Bon',
    'Plein',
    'Consommation Moy'];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() modify?: EventEmitter<any> = new EventEmitter();
  @Output() delete?: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClicked(row: any) {
    this.modify.emit(row);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d && d.length > 0) {
        this.dataSource = new MatTableDataSource(d)
        // this.displayedColumns = this.columns
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
  }
}

