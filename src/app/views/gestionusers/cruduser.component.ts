import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { util } from 'src/app/tools/utils';

@Component({
  templateUrl: 'cruduser.component.html',
  styleUrls: ["./style.scss"]
})
export class CruduserComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedUser: User = new User();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private tools: util, private router: Router) { }
  data = [];
  errorMessage: string;
  public groups: any = [];
  selectedGroups = null;
  selectedGroup = this.selectedGroups;
  showErrorGroup = false;
  errorMessageGroup = "";

  getSelectedGroups(selected) {
    this.selectedGroup = selected;
    console.log(this.selectedGroup?.join(" , ").trim());

  }
 
  onValidateGroup() {
    this.showErrorGroup = !this.showErrorGroup;
    this.errorMessageGroup = "This field is required";
  }

  selectedTimezones = null;
  selectedTimezone = this.selectedTimezones;
  getSelectedTimezones(selected) {
    this.selectedTimezone = selected;
  }
  public timezone = [
    {
      label: "GMT+00:00",
      data: "GMT+00:00"
    },
    {
      label: "GMT+01:00",
      data: "GMT+01:00"
    },
    {
      label: "GMT+02:00",
      data: "GMT+02:00"
    },
    {
      label: "GMT+03:00",
      data: "GMT+03:00"
    },
    {
      label: "GMT+04:00",
      data: "GMT+04:00"
    },
    {
      label: "GMT+05:00",
      data: "GMT+05:00"
    },
    {
      label: "GMT+05:30",
      data: "GMT+05:30"
    },
    {
      label: "GMT+06:00",
      data: "GMT+06:00"
    },
    {
      label: "GMT+07:00",
      data: "GMT+07:00"
    },
    {
      label: "GMT+08:00",
      data: "GMT+08:00"
    },
    {
      label: "GMT+09:00",
      data: "GMT+09:00"
    },
    {
      label: "GMT+10:00",
      data: "GMT+10:00"
    },
    {
      label: "GMT+11:00",
      data: "GMT+11:00"
    },
    {
      label: "GMT+12:00",
      data: "GMT+12:00"
    },
    {
      label: "GMT+13:00",
      data: "GMT+13:00"
    },
    {
      label: "GMT+14:00",
      data: "GMT+14:00"
    },
    {
      label: "GMT-01:00",
      data: "GMT-01:00"
    },
    {
      label: "GMT-02:00",
      data: "GMT-02:00"
    },
    {
      label: "GMT-03:00",
      data: "GMT-03:00"
    },
    {
      label: "GMT-04:00",
      data: "GMT-04:00"
    },
    {
      label: "GMT-05:00",
      data: "GMT-05:00"
    },
    {
      label: "GMT-06:00",
      data: "GMT-06:00"
    },
    {
      label: "GMT-07:00",
      data: "GMT-07:00"
    },
    {
      label: "GMT-08:00",
      data: "GMT-08:00"
    },
    {
      label: "GMT-09:00",
      data: "GMT-09:00"
    },
    {
      label: "GMT-10:00",
      data: "GMT-10:00"
    },
    {
      label: "GMT-11:00",
      data: "GMT-11:00"
    },
    {
      label: "GMT-12:00",
      data: "GMT-12:00"
    },
    {
      label: "US/Hawaii",
      data: "US/Hawaii"
    },
    {
      label: "US/Alaska",
      data: "US/Alaska"
    },
    {
      label: "US/Pacific",
      data: "US/Pacific"
    },
    {
      label: "US/Arizona",
      data: "US/Arizona"
    },
    {
      label: "US/Mountain",
      data: "US/Mountain"
    },
    {
      label: "US/Central",
      data: "US/Central"
    },
    {
      label: "US/Eastern",
      data: "US/Eastern"
    },    
    {
      label: "Canada/Pacific",
      data: "Canada/Pacific"
    },
    {
      label: "Canada/Mountain",
      data: "Canada/Mountain"
    },
    {
      label: "Canada/Central",
      data: "Canada/Central"
    },
    {
      label: "Canada/Eastern",
      data: "Canada/Eastern"
    },   
    {
      label: "Canada/Atlantic",
      data: "Canada/Atlantic"
    },
    {
      label: "Mexico/BajaNorte",
      data: "Mexico/BajaNorte"
    },   
    {
      label: "Mexico/BajaSur",
      data: "Mexico/BajaSur"
    },
    {
      label: "Mexico/General",
      data: "Mexico/General"
    },
    {
      label: "Europe/Athens",
      data: "Europe/Athens"
    },
    {
      label: "Europe/Berlin",
      data: "Europe/Berlin"
    },

    {
      label: "Europe/Dublin",
      data: "Europe/Dublin"
    },
    {
      label: "Europe/Helsinki",
      data: "Europe/Helsinki"
    },
    {
      label: "Europe/Kiev",
      data: "Europe/Kiev"
    },
    {
      label: "Europe/Lisbon",
      data: "Europe/Lisbon"
    },
    {
      label: "Europe/London",
      data: "Europe/London"
    },
    {
      label: "Europe/Madrid",
      data: "Europe/Madrid"
    },
    {
      label: "Europe/Moscow",
      data: "Europe/Moscow"
    },
    {
      label: "Europe/Oslo",
      data: "Europe/Oslo"
    },
    {
      label: "Europe/Paris",
      data: "Europe/Paris"
    },
    {
      label: "Europe/Rome",
      data: "Europe/Rome"
    },
    {
      label: "Europe/Stockholm",
      data: "Europe/Stockholm"
    },
    {
      label: "Europe/Zurich",
      data: "Europe/Zurich"
    },
    {
      label: "Pacific/Auckland",
      data: "Pacific/Auckland"
    },
    {
      label: " Pacific/Chatham",
      data: " Pacific/Chatham"
    },    
  ];

  ngOnInit() {
    this.getGroup();
    this.loadData();
  }
  
  getGroup() {

    var route = this.router
    this.dataService.getGroupeVehicules("").subscribe({
      next: (res) => {
        this.groups = res;
        console.log(res)
      }, error(err) {
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  }
  
  loadData() {
    this.loading = true;
    var route = this.router
    this.dataService.getUsers("").subscribe({
      next: (d: any) => {
        let now = Math.round(new Date().getTime() / 1000)
        d.forEach(e => {
          e.lastLoginTime = this.tools.formatDate(new Date(Number.parseInt(e.lastLoginTime) * 1000));
        });
        this.data = d;
        this.loading = false;
      }, error(err) {
        this.loading = false;
        if (err.status == 401) {
          route.navigate(['login'], { queryParams: { returnUrl: route.url } });
        }
      }
    })
  };

  loadModify(ev) {
    this.mode = "Modifier"
    this.selectedUser = new User(ev[0],ev[1],ev[2],ev[3],ev[4],ev[5],ev[6],ev[7],ev[8],ev[9],ev[10]);
    if (ev) {
      var url = "?u=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()

      var route = this.router
      this.dataService.getUsers(url).subscribe({
        next: (d: any) => {
          console.log(d);
          if(d && d.length)
          this.selectedUser.groups = d[0].groupID;
          this.selectedGroups=this.selectedUser.groups
          this.selectedGroup=this.selectedGroups
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
          if (err.status == 401) {
            route.navigate(['login'], { queryParams: { returnUrl: route.url } });
          }
        }
    })
    }
  }

  submit() {
   if(this.mode == "Ajouter")this.ajouter()
   if(this.mode == "Modifier")this.modifier()
   }
   
  ajouter() {

    console.log(this.selectedUser.userID)
    console.log(this.selectedUser.description)
    
    if (!this.selectedUser.userID || !this.selectedUser.description || !this.selectedUser.password || !this.selectedUser.contactPhone) {
      console.log("test")
      this.errorMessage = "Veuillez remplir les champs obligatoires."
    } else {
     this.dataService.addUsers(this.selectedUser).subscribe({
      next: (res) => {
        
        console.log(res)
      },
      error: (errors) => {

      }
    })
  }
  
  }
   
  modifier() {
    
  }

   delete(ev){

  }

   showAddModal(){
    this.selectedUser = new User();
    this.mode = "Ajouter"
    this.primaryModal.show()
   }
}


