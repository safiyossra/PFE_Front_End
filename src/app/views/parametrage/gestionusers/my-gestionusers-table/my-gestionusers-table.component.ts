import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'my-gestionusers-table',
  styleUrls: ['my-gestionusers-table.component.scss'],
  templateUrl: 'my-gestionusers-table.component.html',
})
export class MyGestionusersTableComponent implements OnChanges {
  @Input() data = [];
  // @Input() columnNames?: any[]
  public displayedColumns = ["actions", "userID", "description", "roleID", "contactName", "contactEmail", "timeZone", "lastLoginTime"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Input() isEditPermission? = false
  @Output() modify?: EventEmitter<any> = new EventEmitter();
  @Output() delete?: EventEmitter<any> = new EventEmitter();
  @Output() editPassword?: EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnNames = ["Actions", "Identifiant", "Nom de l'utilisateur", "Role", "Nom du contact", "Adresse email", "Fuseau horaire", "Last Login"];
  public selectedPageSize = 15;
  public maxSize: number = 5;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public numPages: number = 0;
  loadDonnee: any;

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

  modif(ev) {
    this.modify.emit(ev)
  }
  supp(ev) {
    this.delete.emit(ev)
  }

  editPass(ev){
    this.editPassword.emit(ev)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      let d = changes['data'].currentValue
      if (d && d.length > 0) {
        this.dataSource = new MatTableDataSource(d)
        this.totalItems = this.dataSource.data.length
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    if(changes['isEditPermission']){
      this.isEditPermission = changes['isEditPermission'].currentValue
      if(this.isEditPermission){
        this.displayedColumns = ["actions", "userID", "description", "roleID", "contactName", "contactEmail", "timeZone", "lastLoginTime"]
        this.columnNames = ["Actions", "Identifiant", "Nom de l'utilisateur", "Role", "Nom du contact", "Adresse email", "Fuseau horaire", "Last Login"];
      }else{
        this.displayedColumns = ["userID", "description", "roleID", "contactName", "contactEmail", "timeZone", "lastLoginTime"]
        this.columnNames = ["Identifiant", "Nom de l'utilisateur", "Role", "Nom du contact", "Adresse email", "Fuseau horaire", "Last Login"];
      }
    }
  }

  formatAge(seconds) {
    if (isNaN(seconds)) return "Jamais"
    // return age
    //days
    let days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    //hours
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    //minutes
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    //output
    return `${days > 0 ? days + " Jours, " : ''}${hours > 0 ? hours + " Heurs, " : ''}${minutes > 0 ? minutes + " minutes, " : ''}${seconds > 0 ? seconds + " seconds" : ''}`;
  }
}

