import { Component, OnInit } from '@angular/core';
import { VehiculeService } from 'src/app/services/vehicule.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public constructor(private vehiculeService: VehiculeService) { }
  // lineChart
  public dashboardData: any[] = []

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
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
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
    this.vehiculeService.getDashboardStats("km").subscribe((res: any) => {
      this.KMData = [
        { data: res.map((e: any) => { return Math.round(e["km"]) }), label: 'Distance parcourue' }
      ]
      this.KMLabels = res.map((e) => { return e["description"] })
    })
    this.vehiculeService.getDashboardStats("v").subscribe((res: any) => {
      this.VitesseData = [
        { data: res.map((e: any) => { return Math.round(e["maxSpeed"]) }), label: 'Max Vitesse' }
      ]
      this.VitesseLabels = res.map((e: any) => { return e["description"] })
    })
    this.vehiculeService.getDashboardStats("c").subscribe((res: any) => {
      this.ConsommationData = [
        { data: res.map((e: any) => { return Math.round(e["consumption"]) }), label: 'Max Consommation' }
      ]
      this.ConsommationLabels = res.map((e) => { return e["description"] })
    })
  }

  loadStatus() {
    this.vehiculeService.getData().subscribe({
      next: (res) => {
        const data = res['DeviceList']
        this.pieChartData = [0, 0, 0, 0]
        data.forEach(e => {
          let l = e['EventData'].length - 1 ?? 0
          if (l > 0) {
            const StatusCode = e['EventData'][1]["StatusCode"]
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
