import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../models/user';

@Component({
  templateUrl: 'cruduser.component.html',
  styleUrls: ["./style.scss"],
  providers: [DatePipe]
})
export class CruduserComponent {

  loading: boolean = false;
  modalLoading: boolean = false;
  mode = "Ajouter";
  selectedUser: User = new User();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(private dataService: DataService, private datePipe: DatePipe) { }
  data = [];

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


// value="GMT-05:00"
// value="GMT-06:00"
// value="GMT-07:00"
// value="GMT-08:00"
// value="GMT-09:00"
// value="GMT-10:00"
// value="GMT-11:00"
// value="GMT-12:00"
 
  ];

  ngOnInit() {
    this.getGroup();
    this.loadData();
  }
  
  getGroup() {
    this.dataService.getGroupeVehicules("").subscribe({
      next: (res) => {
        this.groups = res;
        console.log(res)
      },
      error: (errors) => {

      }
    })
  }
  
  loadData() {
    this.loading = true;
    this.dataService.getUsers("").subscribe({
      next: (d: any) => {
        let now = Math.round(new Date().getTime() / 1000)
        d.forEach(e => {
          e.lastLoginTime = this.formatDate(new Date(Number.parseInt(e.lastLoginTime) * 1000));
        });
        this.data = d;
        this.loading = false;
      }, error(err) {
        this.loading = false;
      },
    })
  };

  loadModify(ev) {
    this.mode = "Modifier"
    this.selectedUser = new User(ev[0],ev[1],ev[2],ev[3],ev[4],ev[5],ev[6],ev[7],ev[8],ev[9],ev[10]);
    if (ev) {
      var url = "?u=" + ev[0]
      this.modalLoading = true;
      this.primaryModal.show()
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
        },
    })
    }
  }

  submit() {
   if(this.mode == "Ajouter")this.ajouter()
   if(this.mode == "Modifier")this.modifier()
   }

  ajouter() {
     this.dataService.addUsers(this.selectedUser).subscribe({
      next: (res) => {
        
        console.log(res)
      },
      error: (errors) => {

      }
    })
  
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


  formatDate(date: Date) {
    return this.datePipe.transform(date, 'MMM dd, HH:mm:ss');
  }
}


