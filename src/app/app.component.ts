import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'product',
    'description',
    'longdescription',
    'category',
    'price',
    'stock',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpForm(): void {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.getEmployeeList();
      }
    });
  }

  getEmployeeList(): void {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }

  deleteEmployee(id: number): void {
    this._empService.deleteEmployee(id).subscribe({
      next: () => {
        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getEmployeeList();
      },
      error: console.error,
    });
  }

  openEditForm(data: any): void {
    const dialogRef = this._dialog.open(EmpAddEditComponent, { data });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.getEmployeeList();
      }
    });
  }
}
