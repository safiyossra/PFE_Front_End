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
          e.age = e.age > 0 ? (now - e.age) : "jamais"          
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
    this.selectedUser = new User();
    if (ev) {
      var url = "?u=" + ev
      this.modalLoading = true;
      this.primaryModal.show()
      this.dataService.getUsers(url).subscribe({
        next: (d: any) => {
          if (d && d.length) {
            this.selectedUser = d[0];
          }
          this.modalLoading = false;
        }, error(err) {
          this.modalLoading = false;
        },
    })
    }
  }

  ajouter() {
    this.mode = "Ajouter"
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


