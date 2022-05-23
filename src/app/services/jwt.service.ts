import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor() { }

  public get(): string {
    let JWT = localStorage.getItem('JWT');
    return JWT;
  }

}
