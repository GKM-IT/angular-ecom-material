import { Component, OnInit } from '@angular/core';
import { TotalSalesYearService } from 'src/app/providers/report/total-sales-year.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Constant } from 'src/app/helper/constant';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-total-sales-year',
  templateUrl: './total-sales-year.component.html',
  styleUrls: ['./total-sales-year.component.css']
})
export class TotalSalesYearComponent implements OnInit {

  displayedColumns: string[] = ['totalPrice', 'totalQty', 'totalTax', 'total', 'year'];
  selection = new SelectionModel<any>(true, []);
  dataSource: any[] = [];
  filterData = {
    length: 0,
    pageSize: 10,
    pageIndex: 0,
    search: '',
    sort_by: 'year',
    sort_dir: 'desc'
  };


  pageSizeOptions;

  constructor(
    private masterService: TotalSalesYearService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    const constant = new Constant();
    this.pageSizeOptions = constant.pageSizeOptions;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show();
    this.masterService.list(this.filterData).subscribe(response => {
      this.dataSource = response.data;
      this.filterData.length = response.recordsFiltered;
      this.spinner.hide();
    });
  }

  applyFilter(filterValue: string) {
    this.filterData.search = filterValue.trim().toLowerCase();
    this.filterData.pageIndex = 0;
    this.getData();
  }

  changePage(event) {
    this.filterData.pageIndex = event.pageIndex;
    this.filterData.pageSize = event.pageSize;
    this.getData();
  }

  sortData(event) {
    this.filterData.sort_by = event.active;
    this.filterData.sort_dir = event.direction;
    this.filterData.pageIndex = 0;
    this.getData();
  }

}
