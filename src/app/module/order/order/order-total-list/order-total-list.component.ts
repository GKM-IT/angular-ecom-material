import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-total-list',
  templateUrl: './order-total-list.component.html',
  styleUrls: ['./order-total-list.component.css']
})
export class OrderTotalListComponent implements OnInit {

  @Input() totals: any = [];
  displayedColumns: string[] = ['title', 'value'];

  constructor() { }

  ngOnInit() {
  }

}
