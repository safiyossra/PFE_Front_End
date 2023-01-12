import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { util } from 'src/app/tools/utils';
import { AuthenticateService } from '../../services/authenticate.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  JWT: string;
  loading: boolean = false;
  passVisible: boolean = false;
  remember: boolean = false;
  errorMessage: string;
  user: string;
  password: string;
  accountid: string;

  constructor(private route: Router, private authenticate: AuthenticateService, private tools: util) { }

  ngOnInit(): void {
    // this.JWT = localStorage.getItem('JWT')
    // if (this.JWT) {
    // this.route.navigate(['map']);
    // }
  }

  validate(): boolean {
    return false
  }

  signin() {
    if (!this.accountid || !this.user || !this.password) {
      this.errorMessage = "Veuillez remplir les champs obligatoires."
    } else {
      this.loading = true;
      this.authenticate.init(this.accountid, this.user, this.password, this.remember).subscribe(
        (response) => {
          localStorage.setItem('JWT', response.token)
          localStorage.setItem('username', response.user)
          localStorage.setItem('compte', this.accountid)
          // console.log("setPermissions",response.p);
          var ap = response.ap;
          var p = response.p;
          if (ap != "") {
            ap = JSON.parse(ap)
          }
          if (p != "") {
            p = JSON.parse(p)
          }
          this.tools.setPermissions(p,ap) ;//console.log('permi',JSON.parse(response.p));

          this.route.navigate(['map']);
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.errorMessage = 'Identifiants invalides';
          this.loading = false;
        }
      )
    }


  }
}
