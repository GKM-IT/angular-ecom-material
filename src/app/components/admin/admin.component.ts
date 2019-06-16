import { Component, OnInit } from '@angular/core';
import { UserService } from '../../providers/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading: boolean;
  appTitle;
  constructor(
    public userService: UserService
  ) {
    this.appTitle = environment.name;
  }

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
