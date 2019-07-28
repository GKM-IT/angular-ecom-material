import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/providers/order/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderHistoryComponent } from '../order-history/order-history.component';
@Component({
  providers: [OrderHistoryComponent],
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  public pageHeading = 'Order Details';
  orderId;
  orderType;
  orderStatus;
  name;
  email;
  contact;
  personName;
  personContact;
  country;
  zone;
  city;
  postcode;
  address;
  comment;
  createdAt;
  totalTax;
  total;
  totals;
  products;

  constructor(
    public masterService: OrderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private orderHistoryComponent: OrderHistoryComponent,
  ) { }

  ngOnInit() {
    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }
  }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/orders']);
  }

  getDetail(id) {
    this.spinner.show();
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.orderId = response.data.id;
          this.orderType = response.data.order_type;
          this.orderStatus = response.data.order_status;
          this.name = response.data.name;
          this.email = response.data.email;
          this.contact = response.data.contact;
          this.personName = response.data.person_name;
          this.personContact = response.data.person_contact;
          this.country = response.data.country;
          this.zone = response.data.zone;
          this.city = response.data.city;
          this.postcode = response.data.postcode;
          this.address = response.data.address;
          this.comment = response.data.comment;
          this.createdAt = response.data.created_at;
          this.totalTax = response.data.total_tax;
          this.total = response.data.total;
          this.products = response.data.products;
          this.totals = response.data.totals;

        }
        this.spinner.hide();
      },
      err => {
        console.error(err);
      }
    );
  }

  getHistory() {
    this.orderHistoryComponent.ngOnInit();
  }
}
