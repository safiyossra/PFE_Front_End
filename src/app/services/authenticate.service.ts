import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private httpClient: HttpClient) { }

  public init(accountID: string, user: string, password: string) {
    let SERVER_URL = environment.apiUrl + "login";

    let body = {
      "accountID": accountID,
      "user": user,
      "password": password
    }



    return this.httpClient.post<any>(SERVER_URL, body, {
      reportProgress: true,
      observe: 'body',
    });

  }
}
