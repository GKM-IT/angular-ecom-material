import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/providers/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  histories: any = [];
  displayedColumns: string[] = ['order_status', 'comment', 'status_text', 'created_at', 'updated_at'];

  constructor(
    public orderService: OrderService,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getCarts();
  }

  getCarts() {
    this.spinner.show();
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : null;
    this.orderService.history(id).subscribe(response => {
      this.histories = response.data;
      this.spinner.hide();
    });
  }

}
