import { EnumTransStatus } from '@C/common/enum';
import { CommonService } from '@S/index';
import { statusBarService } from '@S/statusBar.service';
import { ValidationService } from '@S/validation.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentid', 'allotmentdate', 'saoDdo', 'hoa', 'balanceCeilamount', 'allotedAmount', 'status', 'action', 'selection'];
    displayedColumnsFilter: string[] = ['filter_allotmentid', 'filter_allotmentdate', 'filter_saoDdo', 'filter_hoa', 'filter_balanceCeilamount', 'filter_allotedAmount', 'filter_status', 'filter_action', 'filter_selection'];
    payloadDataForApprove: any[] = [];
    filterForm = this.fb.group({
        selectedStatus: ['ALL'],
        filterString: [''],
    });

    private paginator!: MatPaginator;
    private sort!: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }
    @ViewChild('DataTable') table!: ElementRef;
    keywords: string[] = ['apple🍏', 'lemon🍋', 'banana🍌', 'orange🍊', 'Popcorn🍿', 'pizza🍕', 'Grapes🍇', 'Candy🍬'];

    /** memo form : start */
    memoForm = this.fb.group({
        memoNo: this.validationService.validation('', 0, 100, ''),
        date: ['', Validators.required],
        nameOfProject: ['As per annexure enclosed'],
        puprposeOfSanction: [''],
        administrativeOrderNo: [''],
        administrativeOrderDate: [''],
        adminApprovalAmt: [''],
        authority: [''],
        totalFundSanction: [''],
        ucType: ['no'],
        fdGroup: [''],
        remarks: this.validationService.validation('Not Required', 0, 500, ''),
        copyForward: this.fb.array([]),
    });
    /** memo form : end */
    constructor(private commonService: CommonService, private fb: FormBuilder, public statusBar: statusBarService, private validationService: ValidationService) {}
    remove(s: any) {}

    ExportTOExcel() {
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        var jsonData =
            this.clickedRows.size > 0
                ? this.clickedRowsArray.map((element: any) => {
                      return {
                          Allotment_ID: element.allotmentId,
                          Allotment_Date: element.allotmentDate,
                          SAO_or_DDO: element.receiverSaoDdoCode,
                          HOA: element.hoa,
                          Balance_Ceilling_Amount: element.ceilingAmount - element.provisionalReleasedAmount,
                          Alloted_Amount: element.budgetAllotedAmount,
                          Status: this.TransStatus[element.status],
                      };
                  })
                : this.allotSource.data.map((element: any) => {
                      return {
                          Allotment_ID: element.allotmentId,
                          Allotment_Date: element.allotmentDate,
                          SAO_or_DDO: element.receiverSaoDdoCode,
                          HOA: element.hoa,
                          Balance_Ceilling_Amount: element.ceilingAmount - element.provisionalReleasedAmount,
                          Alloted_Amount: element.budgetAllotedAmount,
                          Status: this.TransStatus[element.status],
                      };
                  });
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        if (!wb.Props) wb.Props = {};
        wb.Props.Title = `Dashboard_${new Date().toUTCString().replace(' ', '_').replace(',', '_')}`;
        wb.Props.Author = 'WB iFMS';
        XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');

        /* save to file */
        XLSX.writeFile(wb, `Dashboard_Export_${new Date().toUTCString().replace(' ', '_').replace(',', '_')}.xlsx`);
    }

    ngOnInit(): void {
        this.getAllotment();
    }

    get TransStatus() {
        return EnumTransStatus;
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    getAllotment() {
        this.commonService.getData('Allotment').subscribe((resp) => {
            this.allotSource = new MatTableDataSource(resp.result);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.clickedRows.clear();
            this.statusBar.text = '';
        } else {
            this.allotSource.filteredData.forEach((row: any) => this.clickedRows.add(row));
            this.statusBar.text = `${this.clickedRows.size} allotment(s) selected`;
        }
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
    }

    isAllSelected() {
        const numSelected = this.clickedRows.size;
        const numRows = this.allotSource.filteredData.length;
        return numSelected === numRows;
    }

    rowClicked(event: any) {
        if (event.shiftKey) {
            console.log('with shift');
        } else {
            console.log('without shift');
        }
        event.stopPropagation();
    }

    tickRow(event: any, row: any) {
        console.log(row);
        this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
        this.statusBar.text = this.clickedRows.size > 0 ? `${this.clickedRows.size} allotment(s) selected` : '';
    }

    applyFilter() {
        this.allotSource.filter = this.filterForm.value.filterString!.trim().toLowerCase();
    }
}
