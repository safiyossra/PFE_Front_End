import { EntretienPneu } from './../../../../models/entretien-pneu';
import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Constant } from 'src/app/tools/constants';

@Component({
  selector: 'app-my-pneu-table',
  templateUrl: './my-pneu-table.component.html',
  styleUrls: ['./my-pneu-table.component.scss']
})

export class MyPneuTableComponent implements OnChanges, AfterViewInit {

  //  AfterContentChecked, AfterContentInit
  @Input() data: [];

  public displayedColumns = ["actions", "deviceName", "NumSerie", "EtatPneu", "KmAcquisition", "DateDebut", "DateFin", "PositionPneu", "Fournisseurs", "ModelePneu", "Montant", "creationTime"]
  // @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];

  @Output() modify?: EventEmitter<any> = new EventEmitter();
  @Output() delete?: EventEmitter<any> = new EventEmitter();
  @Output() cloturer?: EventEmitter<any> = new EventEmitter();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // dataSource = ELEMENT_DATA;
  columnNames = ["actions", "Véhicule", "N° série", "Etat Pneu", "Km Acquisition", "Date debut", "Date fin", "Position Pneu", "Fournisseurs", "Modele Pneu", "Montant", "DATE DE CRÉATION"]
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;

  constructor(public cts: Constant) { }

  ngOnInit(): void {

  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d /*&& d.length > 0*/) {

        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getOperationById(id) {
    for (let i = 0; i < this.cts.planOperations.length; i++) {
      if (this.cts.planOperations[i].id == id) return this.cts.planOperations[i].name
    }
    return 0
  }
  getBgColorForStatus(s) {
    return s == "closed" ? 'bg-success' : s == 'obsolete' ? 'bg-danger' : ''
  }
  getStatusName(s) {
    return s == "closed" ? 'Clôturée' : s == 'obsolete' ? 'Dépassé' : 'En Cours'
  }

  getTypeDeclenchement(t) {
    return t == 1 ? 'Par KM' : 'Par Date'
  }

  getValue(c, row) {
    switch (c) {
      case 'value':
        return row["typeDeclenchement"] == 1 ? row["decKmValue"] : row["decDateValueString"]
      case 'status':
        return this.getStatusName(row[c])
      case 'typeDeclenchement':
        return this.getTypeDeclenchement(row[c])
      case 'operation':
        return this.getOperationById(row[c])
      case 'actions':
        return ''
      default:
        return row[c]
    }
  }

  modif(ev) {
    this.modify.emit(ev)
  }
  supp(ev) {
    this.delete.emit(ev)
  }
  del(ev) {
    this.delete.emit(ev)
  }


}
