import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  public menuData = [];
  constructor() { }

  ngOnInit() {
    this.menuData.push({
      name: 'Dashboard',
      link: '/',
      icon: 'dashboard'
    });

    this.menuData.push({
      name: 'User Module',
      icon: 'account_circle',
      chidren: [
        {
          name: 'All User Groups',
          link: '/user-groups',
        },
        {
          name: 'All Users',
          link: '/users',
        }
      ]
    });
    this.menuData.push({
      name: 'Employee Module',
      icon: 'account_circle',
      chidren: [
        {
          name: 'All Employee Groups',
          link: '/user-groups',
        },
        {
          name: 'All Employees',
          link: '/users',
        }
      ]
    });
    this.menuData.push({
      name: 'Location Module',
      icon: 'account_circle',
      chidren: [
        {
          name: 'All Countries',
          link: '/countries',
        }
      ]
    });
  }

}
