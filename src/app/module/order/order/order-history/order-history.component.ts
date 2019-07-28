import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/providers/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from 'src/app/components/common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  histories: any = [];
  displayedColumns: string[] = ['order_status', 'comment', 'status_text', 'created_at', 'updated_at'];

  constructor(
    public masterService: OrderService,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }
  orderId;
  ngOnInit() {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : null;
    this.getCarts();
  }

  getCarts() {
    this.spinner.show();
    this.masterService.history(this.orderId).subscribe(response => {
      this.histories = response.data;
      this.spinner.hide();
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Delete confirmation', content: `Are you sure want to delete histories ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.clearHistories(this.orderId).subscribe(response => {
          this.getCarts();
          this.snackBar.open(response.message, 'X', {
            duration: 2000,
          });
        });
      }
    });

  }

}
