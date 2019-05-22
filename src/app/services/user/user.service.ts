import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  generateRandomID() {
    const x = Math.floor((Math.random() * Math.random() * 9999));
    return x;
  }
}
