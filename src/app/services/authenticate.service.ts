import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {

  constructor(private httpClient: HttpClient) { }

  public init(accountID: string, user: string, password: string, remember: boolean) {
    let SERVER_URL = environment.apiUrl + "login";
    let body = {
      "accountID": accountID,
      "user": user,
      "password": password,
      "remember": remember
    }
    return this.httpClient.post<any>(SERVER_URL, body, {
      reportProgress: true,
      observe: 'body',
    });

  }

  isLoggedIn(JWT) {
    let SERVER_URL = environment.apiUrl + "isLogin";
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JWT,
      'Accept': 'application/json'
    });
    return this.httpClient.get(SERVER_URL, {
      headers: headers
    })
  }
}