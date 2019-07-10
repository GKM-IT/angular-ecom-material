import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ZoneService } from 'src/app/providers/location/zone.service';
import { ConfirmDialogComponent } from 'src/app/components/common/confirm-dialog/confirm-dialog.component';
import { Constant } from 'src/app/helper/constant';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements OnInit {


  displayedColumns: string[] = ['select', 'country', 'name', 'code', 'action'];
  selection = new SelectionModel<any>(true, []);
  dataSource: any[] = [];
  filterData = {
    length: 0,
    pageSize: 10,
    pageIndex: 0,
    search: '',
    sort_by: 'name',
    sort_dir: 'asc'
  };

  pageSizeOptions;

  constructor(
    private masterService: ZoneService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  deleteAll() {
    if (this.selection.selected.length) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { title: 'Delete confirmation', content: `Are you sure want to delete selected ${this.selection.selected.length} records ?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.masterService.deleteAll(this.selection.selected).subscribe(response => {
            this.getData();
            this.snackBar.open(response.message, 'X', {
              duration: 2000,
            });
          });
        }
      });
    } else {
      this.snackBar.open('Please select rows', 'X', {
        duration: 2000,
      });
    }
  }

  delete(row) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Delete confirmation', content: `Are you sure want to delete ${row.name} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.masterService.delete(row.id).subscribe(response => {
          this.getData();
          this.snackBar.open(response.message, 'X', {
            duration: 2000,
          });
        });
      }
    });

  }

  edit(row) {
    this.router.navigate(['/zone/', row.id]);
  }

  add() {
    this.router.navigate(['/zone/', 'new']);
  }

}
