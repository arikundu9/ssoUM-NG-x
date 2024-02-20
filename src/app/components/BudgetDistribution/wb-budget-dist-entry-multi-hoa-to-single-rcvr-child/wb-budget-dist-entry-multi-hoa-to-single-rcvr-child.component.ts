import { filter } from 'rxjs/operators';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { DatePipe } from '@angular/common';
import { EnumReleaseMapType, FavListPayloadType } from '@C/common/enum';
import { dataService } from '@S/data.service';
import { NumberPatternwithoutPoint } from 'app/helper/patternValidation';
import { ValidationService } from '@S/validation.service';

@Component({
    selector: 'appWbBudgetDistEntryMultiHoaToSingleRcvrChild',
    templateUrl: './wb-budget-dist-entry-multi-hoa-to-single-rcvr-child.component.html',
    styleUrls: ['./wb-budget-dist-entry-multi-hoa-to-single-rcvr-child.component.css'],
})
export class WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent implements OnInit, AfterViewInit {
    @Output() onPayloadReady = new EventEmitter<any>();

    accordionStep = 0;
    isSearchDone: boolean = false;

    receiverForm!: FormGroup;
    amountForm!: FormGroup;

    readonly EnumReleaseMapType = EnumReleaseMapType;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentId', 'allotmentdate', 'hoa', 'budgetAmt', 'ceilAmt', 'balanceamount', 'selection'];
    currentUserRole = 0;
    isMapTypeSelected: any;
    mapId: any;
    saoHeirarchyList: any[] = [];
    distToFlag: any;
    clickedRowsArray: any;
    selectedCliekedRow: any;
    selectedCliekedRow_i: any;
    isSaoHeirerchySelected: boolean = false;
    saoList: any[] = [];
    copySaoList: any[] = [];
    selectedReceiver: any[] = [];
    isSaoSelected: boolean = false;
    treasuryList: any[] = [];
    copyTreasuryList: any[] = [];
    isTreasurySelected: boolean = false;
    selectedTreasury: any;
    ddoList: any[] = [];
    copyDdoList: any[] = [];
    isDistributedToClicked: boolean = false;
    isDdoSelected: boolean = false;
    saoLevel: any;
    datePipeString: any;
    isSaoDdoSelected: boolean = false;

    // mapTypeList = [{mapType : 'HOD to SAO',mapId : 2},{mapType : 'HOD to DDO', mapId : 3}];
    _mapTypeList_HOD = [
        { mapType: 'HOD to SAO', mapId: EnumReleaseMapType.HOD_to_SAO },
        { mapType: 'HOD to DDO', mapId: EnumReleaseMapType.HOD_to_DDO },
    ];
    _mapTypeList_SAO = [
        { mapType: 'SAO to SAO', mapId: EnumReleaseMapType.SAO_to_SAO },
        { mapType: 'SAO to DDO', mapId: EnumReleaseMapType.SAO_to_DDO },
    ];
    get mapTypeList() {
        return this.commonService.isHod ? this._mapTypeList_HOD : this._mapTypeList_SAO;
    }

    get mapType() {
        return this.commonService.isHod;
    }

    isMapTypeDdo: any;
    isMapTypeSao: any;
    saoSelected: any;
    ddoSelected: any;
    payloadArrayForSao: any[] = [];
    payloadArrayForDdo: any[] = [];
    saoDdoList: any[] = [];

    private paginator!: MatPaginator;
    private sort!: MatSort;
    copyAllotSource: any;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    constructor(private commonService: CommonService, private fb: FormBuilder, private notify: NotificationService, private datePipe: DatePipe, public dataService: dataService, private validatorService: ValidationService) { }

    ngOnInit(): void {
        this.dataService.MyAllotments.wire.subscribe((v) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(v);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
        this.receiverForm = this.fb.group({
            tresuryCode: ['', Validators.required],
            saoCode: ['', Validators.required],
            ddoCode: ['', Validators.required],
            saoHeirerchy: ['', Validators.required],
            saoDdoCode: ['', Validators.required],
        });
        this.amountForm = this.fb.group({
            // allotmentDate: [{ value: '', disabled: true }],
            allotmentDate: ['', Validators.required],
            hoa: ['', Validators.required],
            balCeilAmt: ['', Validators.required],
            allotedAmt: this.validatorService.validation('Amount', 0, 100, ''),
            ceilAmt: ['', Validators.required],
        });
    }

    ngAfterViewInit(): void {
        this.allotSource.paginator = this.paginator;
        this.allotSource.sort = this.sort;
    }

    setAccordionStep(index: number) {
        this.accordionStep = index;
    }

    nextAccordionStep() {
        this.accordionStep++;
    }

    prevAccordionStep() {
        this.accordionStep--;
    }

    onHoaSearch() {
        this.isSearchDone = true;
        this.nextAccordionStep();
    }

    masterToggle() {
        this.isAllSelected() ? this.clickedRows.clear() : this.allotSource.filteredData.forEach((row: any) => this.clickedRows.add(row));
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
    }

    isAllSelected() {
        const numSelected = this.clickedRows.size;
        const numRows = this.allotSource.filteredData.length;
        return numSelected === numRows;
    }

    tickRow(event: any, row: any) {
        const rowSelected = this.clickedRows.size;
        this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
        if (this.clickedRows.size) this.isRowClicked = true;
        else this.isRowClicked = false;
    }

    onHoaSelect() {
        this.clickedRowsArray = Array.from(this.clickedRows);
        if (this.clickedRowsArray.length == 0) {
            this.notify.alert('Please select atleast one row!');
        } else {
            this.nextAccordionStep();
        }
    }

    convertToArrayFromSet() {
        this.clickedRowsArray = Array.from(this.clickedRows);
    }

    makeAll_isTreasurySelected(e: any, f: boolean) {
        // this.receiverStruct.isTreasurySelected = f;
    }

    makeAll_isReceiverSelected(e: any, f: boolean) {
        // this.receiverStruct.isReceiverSelected = f;
    }

    onMapValueSelect(e: any, mapType: number) {
        if (e.isTrusted) {
            this.isMapTypeSelected = true;
            this.receiverForm.controls['tresuryCode'].reset();
            this.receiverForm.controls['saoCode'].reset();
            this.receiverForm.controls['saoHeirerchy'].reset();
            this.mapId = mapType;
            console.log(mapType);
            if (mapType == EnumReleaseMapType.HOD_to_SAO || mapType == EnumReleaseMapType.SAO_to_SAO) {
                this.getSaoHeirarchy();
                this.isMapTypeSao = true;
            } else if (mapType == EnumReleaseMapType.HOD_to_DDO || mapType == EnumReleaseMapType.SAO_to_DDO) {
                this.isMapTypeDdo = true;
            } else if (this.mapId == EnumReleaseMapType.HOD_to_SAODDO || this.mapId == EnumReleaseMapType.SAO_to_SAODDO) {
                this.commonService.getFavList(FavListPayloadType.Allotment_Receiver_n_Amount).subscribe((resp) => {
                    this.saoDdoList = resp;
                    this.saoDdoList.forEach((element) => {
                        element.payload = JSON.parse(element.payload);
                    });
                    console.log(this.saoDdoList);
                });
            }
            // if (mapType == EnumReleaseMapType.HOD_to_SAO || mapType === EnumReleaseMapType.SAO_to_SAO) {
            //     this.getAllSao();
            // }
            this.isSaoHeirerchySelected = false;
            // this.isDistributedToClicked = false;
            this.isTreasurySelected = false;
            this.isDdoSelected = false;
            this.isSaoSelected = false;
            this.isSaoDdoSelected = false;
        }
    }

    getSaoHeirarchy() {
        this.commonService.getSaoHeirarchy().subscribe((resp) => {
            this.saoHeirarchyList = resp;
        });
    }

    onSaoHeirerchySelect(e: any, sao: any) {
        if (e.isUserInput) {
            this.saoLevel = sao.code;
            this.getAllSao();
            this.isSaoHeirerchySelected = true;
            this.receiverForm.controls['saoCode'].reset();
        }
    }

    // getAllSao(){
    //     this.commonService.getAllSao().subscribe((resp) => {
    //         this.saoList = this.copySaoList = resp;
    //     });
    // }

    getAllSao() {
        this.commonService.getSaoByHeirarchy(this.saoLevel).subscribe((resp) => {
            this.saoList = this.copySaoList = resp;
        });
    }

    searchSao(e: any) {
        var i = e.target.getAttribute('i');
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.saoList = this.copySaoList.filter((data: any) => {
                        return data.name.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.saoList = this.copySaoList;
            }
        }
    }

    onSaoSelect(e: any, sao: any, i: number) {
        if (e.isUserInput) {
            this.selectedReceiver = [];
            this.selectedReceiver.push(sao);
            this.isSaoSelected = true;
            this.saoSelected = sao;
        }
    }

    tickSao(sao: any) {
        if (this.selectedReceiver.includes(sao))
            this.selectedReceiver = this.selectedReceiver.filter((v: any) => { return v.code != sao.code });
        else
            this.selectedReceiver.push(sao);
        this.isSaoSelected = this.selectedReceiver.length > 0;
        this.receiverForm.patchValue({ saoCode: this.selectedReceiver.map(v => v.code).join(', ') });
    }

    getOwnDdoAndPupulateWithData(e: any) {
        this.commonService.getOwnDdo().subscribe((resp) => {
            console.log(resp.result[0]);
            this.receiverForm.patchValue({
                ddoCode: resp.result[0].ownDdo,
            });
            this.isDdoSelected = true;
            this.receiverForm.controls['ddoCode'].disable();
            this.selectedReceiver = [];
            this.selectedReceiver.push(resp.result[0]);
            this.receiverForm.controls['tresuryCode'].clearValidators();
            this.receiverForm.controls['tresuryCode'].updateValueAndValidity();
        });
    }

    resetRcvrForm() {
        this.receiverForm.controls['ddoCode'].enable();
        this.receiverForm.reset();
    }

    onClickAllDdo() {
        this.getAllTreasury();
    }

    getAllTreasury() {
        this.commonService.getAllTreasury().subscribe((resp) => {
            this.treasuryList = this.copyTreasuryList = resp;
        });
    }

    searchTreasury(e: any) {
        var i = e.target.getAttribute('i');
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.treasuryList = this.copyTreasuryList.filter((data: any) => {
                        return data.districtName.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.treasuryList = this.copyTreasuryList;
            }
        }
    }

    onTreasurySelect(e: any, treasuryCode: any, i: any) {
        if (e.isUserInput) {
            this.receiverForm.controls['ddoCode'].reset();
            this.selectedTreasury = treasuryCode;
        }
    }

    bindDdoForSelectedTreasury(i: number) {
        this.commonService.getDdoByTreasury(this.selectedTreasury).subscribe((resp) => {
            this.ddoList = this.copyDdoList = resp;
        });
    }

    searchDdo(e: any) {
        var i = e.target.getAttribute('i');
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.ddoList = this.copyDdoList.filter((data: any) => {
                        return data.designation.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.ddoList = this.copyDdoList;
            }
        }
    }

    onDdoSelect(e: any, ddo: any, i: any) {
        if (e.isUserInput) {
            this.selectedReceiver = [];
            this.selectedReceiver.push(ddo);
            this.isDdoSelected = true;
            this.ddoSelected = ddo;
            console.log(ddo);
        }
    }

    tickDdo(ddo: any) {
        if (this.selectedReceiver.includes(ddo))
            this.selectedReceiver = this.selectedReceiver.filter((v: any) => { return v.code != ddo.code });
        else
            this.selectedReceiver.push(ddo);
        this.isDdoSelected = this.selectedReceiver.length > 0;
        this.receiverForm.patchValue({ ddoCode: this.selectedReceiver.map(v => v.code).join(', ') })
    }

    onReceiverSelect() {
        if (!this.isSaoSelected && !this.isDdoSelected && !this.isSaoDdoSelected) {
            this.notify.alert('Please select the receiver!');
        } else {
            this.nextAccordionStep();
        }
    }

    onClicledRowSelect(e: any, rows: any, i: any) {
        if (e.isUserInput) {
            this.selectedCliekedRow = rows;
            this.selectedCliekedRow_i = i;
            this.datePipeString = this.datePipe.transform(rows.allotmentDate, 'yyyy-MM-dd');
            this.dataService.MyAllotments.wire.subscribe((value) => {
                var allotment = value.filter((a: any) => {
                    if (a.allotmentId == this.selectedCliekedRow.allotmentId) {
                        return a;
                    }
                });
                this.amountForm.patchValue({
                    allotmentDate: this.datePipeString,
                    balCeilAmt: this.selectedCliekedRow.ceilingAmount - this.selectedCliekedRow.provisionalReleasedAmount,
                    ceilAmt: this.selectedCliekedRow.ceilingAmount - this.selectedCliekedRow.provisionalReleasedAmount - allotment[0]['FE_provisional_release'],
                });
                this.calCielAmt();
            });
        }
    }

    calCielAmt() {
        var allotment = this.dataService.MyAllotments.value.filter((a: any) => {
            if (a.allotmentId == this.selectedCliekedRow?.allotmentId) {
                return a;
            }
        });
        this.amountForm.patchValue({
            ceilAmt: +this.amountForm.value.balCeilAmt - +this.amountForm.value.allotedAmt * this.selectedReceiver.length - allotment[0]['FE_provisional_release'],
        });
    }

    emitPayload() {
        this.amountForm.markAllAsTouched();
        if (this.amountForm.valid) {
            this.clickedRowsArray.splice(this.selectedCliekedRow_i, 1);
            if (this.mapId == EnumReleaseMapType.HOD_to_SAODDO || this.mapId == EnumReleaseMapType.SAO_to_SAODDO) {
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.onPayloadReady.emit({
                        from_allotmentId: this.selectedCliekedRow.allotmentId,
                        allotmentDate: this.selectedCliekedRow.allotmentDate,
                        // hoa: this.selectedCliekedRow.demandNo+'-'+this.selectedCliekedRow.majorHead+'-'+this.selectedCliekedRow.submajorHead+'-'+this.selectedCliekedRow.minorHead+'-'+this.selectedCliekedRow.schemeHead+'-'+this.selectedCliekedRow.detailHead+'-'+this.selectedCliekedRow.subdetailHead+'-'+this.selectedCliekedRow.votedCharged ,
                        hoa: this.selectedCliekedRow,
                        sao_ddo: v,
                        amount: this.amountForm.value.allotedAmt,
                        mapId: v.payload.mapId,
                        initialMapId: this.mapId,
                    });
                });
            } else {
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.onPayloadReady.emit({
                        from_allotmentId: this.selectedCliekedRow.allotmentId,
                        allotmentDate: this.selectedCliekedRow.allotmentDate,
                        // hoa: this.selectedCliekedRow.demandNo+'-'+this.selectedCliekedRow.majorHead+'-'+this.selectedCliekedRow.submajorHead+'-'+this.selectedCliekedRow.minorHead+'-'+this.selectedCliekedRow.schemeHead+'-'+this.selectedCliekedRow.detailHead+'-'+this.selectedCliekedRow.subdetailHead+'-'+this.selectedCliekedRow.votedCharged ,
                        hoa: this.selectedCliekedRow,
                        sao_ddo: v,
                        amount: this.amountForm.value.allotedAmt,
                        mapId: this.mapId,
                        initialMapId: this.mapId,
                    });
                });
            }

            this.amountForm.reset();
        }
    }

    deleteRow(payload: any) {
        this.payloadArrayForSao = payload.filter((elm: any) => elm.mapId == EnumReleaseMapType.HOD_to_SAO || elm.mapId == EnumReleaseMapType.SAO_to_SAO);
        this.payloadArrayForDdo = payload.filter((elm: any) => elm.mapId == EnumReleaseMapType.HOD_to_DDO || elm.mapId == EnumReleaseMapType.SAO_to_DDO);
        if (this.payloadArrayForSao.length < 1) {
            this.isMapTypeSao = false;
        }
        if (this.payloadArrayForDdo.length < 1) {
            this.isMapTypeDdo = false;
        }
    }

    get clickedRowsAry(): any[] {
        return Array.from(this.clickedRows);
    }

    filterHOA(e: any) {
        this.isSearchDone = true;
        this.nextAccordionStep();
        this.copyAllotSource = new MatTableDataSource(
            this.allotSource.filteredData.filter((data: any) => {
                return data.demandNo.toLowerCase().indexOf(e.demand) >= 0 && data.majorHead.toLowerCase().indexOf(e.major_head) >= 0 && data.submajorHead.toLowerCase().indexOf(e.sub_major_head) >= 0 && data.minorHead.toLowerCase().indexOf(e.minor_head) >= 0 && data.schemeHead.toLowerCase().indexOf(e.sub_head) >= 0 && data.detailHead.toLowerCase().indexOf(e.detailed_head) >= 0;
            })
        );
        this.copyAllotSource.paginator = this.paginator;
        this.copyAllotSource.sort = this.sort;
    }

    setDataSourceAttributes() {
        this.allotSource.paginator = this.paginator;
        this.allotSource.sort = this.sort;
    }

    onSaoDdoSelect(e: any, saoddo: any) {
        if (e.isUserInput) {
            this.selectedReceiver = [];
            this.selectedReceiver.push(saoddo);
            this.amountForm.patchValue({
                allotedAmt: saoddo.payload.amount,
            });
            this.isSaoDdoSelected = true;
        }
    }
}
