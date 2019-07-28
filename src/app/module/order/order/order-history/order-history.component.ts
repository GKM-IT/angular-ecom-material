import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/providers/order/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  @Input() orderId;
  histories: any = [];
  displayedColumns: string[] = ['order_status', 'comment', 'status_text', 'created_at', 'updated_at'];

  constructor(
    public orderService: OrderService,
  ) { }

  ngOnInit() {
    this.getCarts();
  }

  getCarts() {
    this.orderService.history(this.orderId).subscribe(response => {
      this.histories = response.data;
    });
  }

}
