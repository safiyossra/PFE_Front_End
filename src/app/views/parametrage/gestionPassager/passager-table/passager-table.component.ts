
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-passager-table',
  templateUrl: './passager-table.component.html',
  styleUrls: ['./passager-table.component.scss']
})
export class PassagerTableComponent implements OnChanges {


    @Input() data=[];
    // @Input() columnNames?: any[]
    public displayedColumns = ["actions","lastName","FirstName", "tel","cin","code" ,"address","country","city","client"]
    @Input() columns?: any[]
    @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
    @Input() isEditPermission? = false

    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    columnNames =["Actions","Nom","Prenom","Telephone", "CIN","code","Adresse","Pays", "Ville","Client"];
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
      // console.log('Row clicked: ', row);
    }

    modif(ev) {
      this.modify.emit(ev)
    }

    dele(ev) {
      this.delete.emit(ev)
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['data']) {
        let d = changes['data'].currentValue
        if (d /*&& d.length>0*/) {
          this.dataSource = new MatTableDataSource(d)
          this.totalItems = this.dataSource.data.length
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
      if(changes['isEditPermission']){
        this.isEditPermission = changes['isEditPermission'].currentValue
        if(this.isEditPermission){
          this.displayedColumns = ["actions","lastName","FirstName", "tel","cin","code" ,"address","country","city","client"]
          this.columnNames = ["Actions","Nom","Prenom","Telephone", "CIN","code","Adresse","Pays", "Ville","Client"];
        }else{
          this.displayedColumns = ["actions","lastName","FirstName", "tel","cin","code" ,"address","country","city","client"];
          this.columnNames = ["Actions","Nom","Prenom","Telephone", "CIN","code","Adresse","Pays", "Ville","Client"];
        }
      }
    }
  }




