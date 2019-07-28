import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.css']
})
export class OrderProductListComponent implements OnInit {

  @Input() products: any = [];
  displayedColumns: string[] = ['product', 'product_image', 'quantity', 'price', 'tax', 'total'];

  constructor() { }

  ngOnInit() {
  }

}
