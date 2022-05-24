import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import * as L from 'leaflet'

import { Vehicule } from '../../../models/vehicule'


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit {

  param: string
  map: any
  car = {
    lat: 35.75,
    lng: -5.83
  }

  trajets: any[]

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  dataSource = new MatTableDataSource()
  displayedColumns: any[] = ['vehicule', 'date', 'depart', 'arrivee']
  columnNames: any[] = ['vehicule', 'date', 'depart', 'arrivee']

  pageSizeOptions = [5, 10, 15, 25]

  selectedPageSize = 5
  maxSize = 5
  totalItems: number
  curremtPage: number = 1
  numPages: number


  // charts attributes
  public lineChartData1: Array<any> = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Vitesse' }
  ];
  public lineChartData2: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Carburant' },
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // },
    { // dark grey
      backgroundColor: '#03a9f460',
      borderColor: '#03a9f4a3',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(private activatedRoute: ActivatedRoute) {
    this.param = this.activatedRoute.snapshot.paramMap.get('vehicule')
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createMap()

    }, 100);

  }

  createMap() {
    const testCoord = {
      lat: 33.589886,
      lng: -7.603869
    }

    const zoomLevel = 12
    this.map = L.map('mapDetail', { attributionControl: false, inertia: true })
      .setView([this.car.lat, this.car.lng], zoomLevel)

    // https://leaflet-extras.github.io/leaflet-providers/preview/
    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    mainLayer.addTo(this.map)

  }

  // table events 
  onRowClicked(row) {
    console.log(row);

  }


  // -------------------------------------------------// 
  //chart events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
