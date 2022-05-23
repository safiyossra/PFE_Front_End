import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  JWT: string;
  loading: boolean = false;
  errorMessage: string;
  user: string;
  password: string;
  accountid: string;


  constructor(private route: Router, private authenticate: AuthenticateService) { }

  ngOnInit(): void {
    this.JWT = localStorage.getItem('JWT')
    if (this.JWT) {
      this.route.navigate(['vehicule']);
    }

  }

  validate(): boolean {
    return false
  }

  signin() {
    if (!this.accountid || !this.user || !this.password) {
      this.errorMessage = "Veuillez remplir les champs obligatoires."
    } else {
      this.loading = true;
      this.authenticate.init(this.user, this.password, this.accountid).subscribe(
        (response) => {
          localStorage.setItem('JWT', response.token)
          this.route.navigate(['vehicule']);
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Identifiants invalides';
          this.loading = false;
        }
      )
    }


  }
}
