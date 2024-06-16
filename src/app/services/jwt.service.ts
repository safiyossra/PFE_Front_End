import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor() { }
//la fonction qui recupere le jeton d'authebtification
  public get(): string {
    let JWT = localStorage.getItem('JWT');
    //Cette ligne récupère la valeur associée à la clé 'JWT' (jeton d'authentification)dans le stockage local du navigateur et la stocke dans une variable JWT.

    return JWT;
  }

}
