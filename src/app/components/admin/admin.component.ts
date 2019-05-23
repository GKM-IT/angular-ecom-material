import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading: boolean;
  constructor() { }

  ngOnInit() {
    this.isLoading = true;
    this.checkIfLoaded();
  }

  checkIfLoaded() {
    const self = this;
    window.addEventListener('load', (event) => {
      console.log('All resources finished loading!');
      self.isLoading = false;
    });
  }



}
