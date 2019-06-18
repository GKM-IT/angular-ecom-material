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
      name: 'Catalog',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Banners',
          link: '/banners',
        },
        {
          name: 'Ratings',
          link: '/ratings',
        },
        {
          name: 'Types',
          link: '/types',
        },
      ]
    });

    this.menuData.push({
      name: 'Customer',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Customers',
          link: '/customers',
        },
        {
          name: 'Customer Groups',
          link: '/customer-groups',
        },
        {
          name: 'Customer Wishlist',
          link: '/customer-wishlists',
        },
      ]
    });

    this.menuData.push({
      name: 'Information',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Contact Types',
          link: '/contact-types',
        },
        {
          name: 'Contacts',
          link: '/contacts',
        },
        {
          name: 'Informations',
          link: '/informations',
        },
      ]
    });

    this.menuData.push({
      name: 'Location',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Countries',
          link: '/countries',
        },
        {
          name: 'Zones',
          link: '/zones',
        },
        {
          name: 'Cities',
          link: '/cities',
        },
        {
          name: 'Locations',
          link: '/locations',
        },
      ]
    });

    this.menuData.push({
      name: 'Order',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Orders',
          link: '/orders',
        },
        {
          name: 'Order Cart',
          link: '/order-carts',
        },
        {
          name: 'Order Statuses',
          link: '/order-statuses',
        },
        {
          name: 'Order Types',
          link: '/order-types',
        },
      ]
    });

    this.menuData.push({
      name: 'Products',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Attributes',
          link: '/attributes',
        },
        {
          name: 'Attribute Groups',
          link: '/attribute-groups',
        },
        {
          name: 'Categories',
          link: '/categories',
        },
        {
          name: 'Manufactures',
          link: '/manufactures',
        },
        {
          name: 'Products',
          link: '/products',
        },
        {
          name: 'Product Reviews',
          link: '/product-reviews',
        },
      ]
    });

    this.menuData.push({
      name: 'Purchase',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Purchases',
          link: '/purchases',
        },
        {
          name: 'Purchase Cart',
          link: '/purchase-carts',
        },
        {
          name: 'Purchase Statuses',
          link: '/purchase-statuses',
        },
        {
          name: 'Purchase Types',
          link: '/purchase-types',
        },
      ]
    });

    this.menuData.push({
      name: 'Tax',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Tax Classes',
          link: '/tax-classes',
        },
        {
          name: 'Tax Rates',
          link: '/tax-rates',
        },
      ]
    });

    this.menuData.push({
      name: 'Unit',
      icon: 'account_circle',
      chidren: [
        {
          name: 'Length Classes',
          link: '/length-classes',
        },
        {
          name: 'Weight Rates',
          link: '/weight-rates',
        },
      ]
    });

    this.menuData.push({
      name: 'User Module',
      icon: 'account_circle',
      chidren: [
        {
          name: 'User Groups',
          link: '/user-groups',
        },
        {
          name: 'Users',
          link: '/users',
        },
      ]
    });


  }

}
