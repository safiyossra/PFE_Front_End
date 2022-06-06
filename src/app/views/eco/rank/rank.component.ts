import { Component, OnInit } from '@angular/core';
import { VehiculeService } from 'src/app/services/vehicule.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit {
  constructor(private dataService: VehiculeService) { }
  radioModel: string = 'Month';
  public isLoading: boolean = false
  data = []
  dataDesc = []
  ngOnInit(): void {
    this.getEcoIndexes("")
  }

  getEcoIndexes(params: string) {
    this.isLoading = true
    this.dataService.getIndexes(params).subscribe({
      next: (res: any) => {
        let d = res;
        this.data = this.getValue(d)
        this.dataDesc = d.sort(
          (a, b) => b.ecoIndex - a.ecoIndex
        )
        this.isLoading = false
      },
      error: (errors) => {
        this.isLoading = false
        alert(errors)
      }
    })
  }

  changeGender(ev) {
    let p = ""
    if (this.radioModel == "Day") p = "?st=" + this.getLastxDate(1) + "&et=" + this.getLastxDate(0)
    else if (this.radioModel == "Year") p = "?st=" + this.getLastxDate(365) + "&et=" + this.getLastxDate(0)
    this.getEcoIndexes(p)
    console.log(p);

  }

  getValue(v) {
    return JSON.parse(JSON.stringify(v))
  }

  getLastxDate(x: number) {
    return Math.round(new Date(new Date().getTime() - (x * (24 * 60 * 60 * 1000))).getTime() / 1000);
  }
}
