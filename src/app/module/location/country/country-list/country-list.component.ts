import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})

export class CountryListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'iso_code_2', 'iso_code_3'];
  dataSource;
  filterData = {
    length: 0,
    pageSize: 10,
    pageIndex: 0,
    search: '',
    sort_by: 'name',
    sort_dir: 'asc'
  };

  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private countryService: CountryService) {

  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.countryService.list(this.filterData).subscribe(response => {
      this.dataSource = response.data;
      this.filterData.length = response.recordsTotal;
    });
  }

  applyFilter(filterValue: string) {
    this.filterData.search = filterValue.trim().toLowerCase();
    this.getData();
  }

  changePage(event) {
    console.log(event);
    this.filterData.pageIndex = event.pageIndex;
    this.filterData.pageSize = event.pageSize;
    this.getData();
  }

  sortData(event) {
    console.log(event);
    this.filterData.sort_by = event.active;
    this.filterData.sort_dir = event.direction;
    this.getData();
  }


}
