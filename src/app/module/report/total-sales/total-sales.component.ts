import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/helper/constant';
import { TotalSalesService } from 'src/app/providers/report/total-sales.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css']
})
export class TotalSalesComponent implements OnInit {

  displayedColumns: string[] = ['totalPrice', 'totalQty', 'totalTax', 'total', 'date'];
  selection = new SelectionModel<any>(true, []);
  dataSource: any[] = [];
  filterData = {
    length: 0,
    pageSize: 10,
    pageIndex: 0,
    search: '',
    sort_by: 'date',
    sort_dir: 'desc'
  };


  pageSizeOptions;

  constructor(
    private masterService: TotalSalesService,
    public dialog: MatDialog
  ) {
    const constant = new Constant();
    this.pageSizeOptions = constant.pageSizeOptions;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.masterService.list(this.filterData).subscribe(response => {
      this.dataSource = response.data;
      this.filterData.length = response.recordsFiltered;
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
