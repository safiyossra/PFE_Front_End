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
  public displayedColumns = [ "actions", 'id', 'driverName','deviceName', 'fournisseur', 'numCarte', 'numBon',  'qte', 'pleinOnStr', 'montant',  'montantTTC', 'kmPrecedent', 'kmEncours', 'consoM', 'dateFill', 'observation', ]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100];
  @Input() isEditPermission? = false

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames = [ "Actions",'id','Chauffeur', 'Vehicule', 'Fournisseur', 'N Carte', 'N Bon','Qte','Plein','Montant','Montant TTC', 'KM Precedent', 'KM Encours', 'Consommation Moy (%)', 'Date', 'Observation'];
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

  modifyEvent(row: any) {
    this.modify.emit(row);
  }
  deleteEvent(row: any) {
    this.delete.emit(row);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d) {
        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    if(changes['isEditPermission']){
      this.isEditPermission = changes['isEditPermission'].currentValue
      if(this.isEditPermission){
        this.displayedColumns =[ "actions", 'id', 'driverName','deviceName', 'fournisseur', 'numCarte', 'numBon',  'qte', 'pleinOnStr', 'montant',  'montantTTC', 'kmPrecedent', 'kmEncours', 'consoM', 'dateFill', 'observation' ]
        this.columnNames = [ "Actions",'id','Chauffeur', 'Vehicule', 'Fournisseur', 'N Carte', 'N Bon','Qte','Plein','Montant','Montant TTC', 'KM Precedent', 'KM Encours', 'Consommation Moy (%)', 'Date', 'Observation'];
      }else{
        this.displayedColumns = ['id', 'driverName','deviceName', 'fournisseur', 'numCarte', 'numBon',  'qte', 'pleinOnStr', 'montant',  'montantTTC', 'kmPrecedent', 'kmEncours', 'consoM', 'dateFill', 'observation' ]
        this.columnNames = ['id','Chauffeur', 'Vehicule', 'Fournisseur', 'N Carte', 'N Bon','Qte','Plein','Montant','Montant TTC', 'KM Precedent', 'KM Encours', 'Consommation Moy (%)', 'Date', 'Observation'];
      }
    }
  }
}

