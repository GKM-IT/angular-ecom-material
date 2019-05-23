import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading: boolean;
  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.checkIfLoaded();
  }

  checkIfLoaded() {
    window.addEventListener('load', (event) => {
      console.log('All resources finished loading!');
    });

    this.isLoading = false;
  }

  logout() {
    this.userService.logout();
  }


}
