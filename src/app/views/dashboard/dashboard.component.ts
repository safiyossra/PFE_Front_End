import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehiculeService } from 'src/app/services/vehicule.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public constructor(private vehiculeService: VehiculeService, private router: Router) { }
  // lineChart
  public dashboardData: any[] = []
  isFirstTime1 = true
  isFirstTime2 = true
  isFirstTime3 = true
  isFirstTime4 = true
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public chartColours: Array<any> = [
    { // grey['#12ff00de', '#00daffcc', '#ff0056de', '#006fffde' ]
      backgroundColor: '#00ed02',
      borderColor: '#00ed02',
      pointBackgroundColor: '#00ed02',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: '#00daffcc',
      borderColor: '#00daffcc',
      pointBackgroundColor: '#00daffcc',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: '#ff0056de',
      borderColor: '#ff0056de',
      pointBackgroundColor: '#ff0056de',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // barChart
  public barChartOptions: any = {
    // scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartType = 'horizontalBar';
  public barChartLegend = true;
  public KMLabels: string[] = [];
  public VitesseLabels: string[] = [];
  public ConsommationLabels: string[] = [];

  public KMData: any[] = [
    { data: [], label: 'Distance parcourue' }
  ];
  public VitesseData: any[] = [
    { data: [], label: 'Max Vitesse' }
  ];
  public ConsommationData: any[] = [
    { data: [], label: 'Max Consommation' }
  ];
  // Pie
  public pieChartLabels: string[] = ['Moving', 'ON', 'OFF', 'Unknown'];
  public pieChartData: number[] = [0, 0, 0, 0];////Moving , ON, OFF, unknown
  public pieChartType = 'pie';

  ngOnInit() {
    this.loadStatus();
    var route = this.router
    this.vehiculeService.getDashboardStats("km").subscribe({
      next: (res: any) => {
        this.KMData = [
          { data: res.map((e: any) => { return Math.round(e["km"]) }), label: 'Distance parcourue' }
        ]
        this.KMLabels = res.map((e) => { return e["description"] })
        this.isFirstTime2 = false
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
    this.vehiculeService.getDashboardStats("v").subscribe({
      next: (res: any) => {
        this.VitesseData = [
          { data: res.map((e: any) => { return Math.round(e["maxSpeed"]) }), label: 'Max Vitesse' }
        ]
        this.VitesseLabels = res.map((e: any) => { return e["description"] })
        this.isFirstTime3 = false
        // console.log(res);

      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
    this.vehiculeService.getDashboardStats("c").subscribe({
      next: (res: any) => {
        this.ConsommationData = [
          { data: res.map((e: any) => { return Math.round(e["consumption"]) }), label: 'Max Consommation' }
        ]
        this.ConsommationLabels = res.map((e) => { return e["description"] })
        // this.isFirstTime4 = false
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  loadStatus() {

    var route = this.router
    this.vehiculeService.getData().subscribe({
      next: (res) => {
        const data = res['DeviceList']
        this.pieChartData = [0, 0, 0, 0]
        data.forEach(e => {
          let l = e['EventData'].length - 1 ?? -1
          if (l > -1) {
            const StatusCode = e['EventData'][l]["StatusCode"]
            if (StatusCode == 61714) { //Moving
              this.pieChartData[0] += 1;
            } else
              if (StatusCode == 62465) { // ON
                this.pieChartData[1] += 1;
              } else
                if (StatusCode == 62467) { // OFF
                  this.pieChartData[2] += 1;
                } else
                  if (StatusCode == 61472 || StatusCode == 64783) { //unknown
                    this.pieChartData[3] += 1;
                  }
          }
        });

        this.isFirstTime1 = false
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

}
