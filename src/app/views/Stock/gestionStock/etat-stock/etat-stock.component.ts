import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Stock } from 'src/app/models/stock';

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.scss']
})
export class EtatStockComponent implements OnChanges {
  
  @Input() data=[];
  // @Input() columnNames?: any[]
  public displayedColumns = ["actions","Reference","QteTotal","PrixTotal"]
  @Input() columns?: any[]
  @Input() pageSizeOptions?= [5, 10, 15, 20, 30, 50, 100, 200, 500, 1000];
  @Input() isEditPermission? = false

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  columnNames =["Actions","Reference","Quantite Total","Prix Total"];
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
  filterUniqueReferences(data: any[]): any[] {
    const uniqueReferences = {};
    const filteredData = [];
  
    for (const item of data) {
      const reference = item.Reference;
  
      if (!uniqueReferences[reference]) {
        uniqueReferences[reference] = true;
        filteredData.push(item);
      }
    }
  
    return filteredData;
  }
  

calculateTotalQuantity(groupedData: any[]): any[] {
const dataWithTotalQuantity = [];

for (const group of groupedData) {
const reference = group[0].Reference;
let totalQuantity = 0;

for (const item of group) {
  const quantityDigits = item.Qte.toString().split('').map(Number);
  for (const digit of quantityDigits) {
    totalQuantity += digit;
  }
}

const dataItem = {
  Reference: reference,
  QteTotal: totalQuantity,
  ...group[0] // Copy other properties from the first item in the group
};

dataWithTotalQuantity.push(dataItem);
}

return dataWithTotalQuantity;
}


groupDataByReference(data: any[]): any[] {
  const groupedData = {};

  for (const item of data) {
    const reference = item.Reference;

    if (!groupedData[reference]) {
      groupedData[reference] = [];
    }

    groupedData[reference].push(item);
  }

  return Object.values(groupedData);
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['data']) {
    let d = changes['data'].currentValue;
    if (d /*&& d.length > 0*/) {
      const groupedData = this.groupDataByReference(d);
      const dataWithTotalQuantity = this.calculateTotalQuantity(groupedData);
      
      this.dataSource = new MatTableDataSource(dataWithTotalQuantity.map((item: any) => {
        item.PrixTotal = item.QteTotal * item.Price;
        return item;
      }));

      this.totalItems = this.dataSource.data.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  if (changes['isEditPermission']) {
    this.isEditPermission = changes['isEditPermission'].currentValue;
    if (this.isEditPermission) {
      this.displayedColumns = ["actions", "Reference", "QteTotal", "PrixTotal"];
      this.columnNames = ["Actions", "Reference", "Quantite Total", "Prix Total"];
    } else {
      this.displayedColumns = ["actions", "Reference", "QteTotal","PrixTotal"];
      this.columnNames = ["Actions", "Reference", "Quantite Total","Prix Total"];
    }
  }
}
}



  
  

