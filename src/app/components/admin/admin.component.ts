import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/providers/user/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading: boolean;
  appTitle;
  constructor(
    public authService: AuthService
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
    this.authService.logout();
  }


}
