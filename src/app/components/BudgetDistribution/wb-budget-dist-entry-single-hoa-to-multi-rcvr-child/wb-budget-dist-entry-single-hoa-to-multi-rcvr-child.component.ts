import { filter } from 'rxjs/operators';
import { CommonService } from '@S/common.service';
import { Component, EventEmitter, OnChanges, OnInit, Output, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@S/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EnumReleaseMapType, FavListPayloadType } from '@C/common/enum';
import { dataService } from '@S/data.service';
import { ValidationService } from '@S/validation.service';

@Component({
    selector: 'appWbBudgetDistEntrySingleHoaToMultiRcvrChild',
    templateUrl: './wb-budget-dist-entry-single-hoa-to-multi-rcvr-child.component.html',
    styleUrls: ['./wb-budget-dist-entry-single-hoa-to-multi-rcvr-child.component.css'],
})
export class WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent implements OnInit, AfterViewInit {
    @Output() onPayloadReady = new EventEmitter<any>();

    receiverForm!: FormGroup;
    amountFormSAO!: FormGroup;
    amountFormDDO!: FormGroup;
    amountFormSAODDO!: FormGroup;

    readonly EnumReleaseMapType = EnumReleaseMapType;

    allotSource: any;
    clickedRows = new Set<any>();
    isRowClicked: boolean = false;
    displayedColumns: string[] = ['allotmentId', 'allotmentdate', 'hoa', 'budgetAmt', 'ceilAmt', 'balanceamount', 'selection'];
    currentUserRole = 0;
    isMapTypeSelected: any;
    mapId: any;
    saoHeirarchy: any;
    distToFlag: any;
    saoLevel: any;
    saoHeirarchyList: any[] = [];
    isSaoHeirerchySelected: boolean = false;
    isSearchDone: boolean = false;
    hodWalletData: any;
    saoList: any[] = [];
    copySaoList: any[] = [];
    isSaoSelected: boolean = false;
    datePipeString: any;
    treasuryList: any[] = [];
    copyTreasuryList: any[] = [];
    selectedTreasury: any;
    ddoList: any[] = [];
    copyDdoList: any[] = [];
    isTreasurySelected: boolean = false;
    selectedReceiver: any[] = [];
    isDdoSelected: boolean = false;

    selectedHodToDdoArray: any[] = [];
    selectedHodToSaoArray: any[] = [];
    selectedSaoToSaoArray: any[] = [];
    selectedSaoToDdoArray: any[] = [];
    saoDdoList: any[] = [];

    copyAllotSource: any;

    accordionStep = 0;
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

    private paginator!: MatPaginator;
    private sort!: MatSort;
    isDistributedToClicked!: boolean;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    constructor(private notify: NotificationService, private commonService: CommonService, private fb: FormBuilder, private datePipe: DatePipe, public dataService: dataService, private validatorService: ValidationService) { }

    ngOnInit(): void {
        this.getAllotments();
        this.receiverForm = this.fb.group({
            tresuryCode: ['', Validators.required],
            saoCode: ['', Validators.required],
            cChild: ['', Validators.required],
        });
        this.amountFormSAO = this.fb.group({
            allotmentDate: [''],
            sao: ['', Validators.required],
            saoHeirerchy: ['', Validators.required],
            balCeilAmt: [''],
            allotedAmt: this.validatorService.validation('Amount', 0, 100, ''),
            ceilAmt: [''],
        });
        this.amountFormDDO = this.fb.group({
            // allotmentDate: [{ value: '', disabled: true }],
            allotmentDate: [''],
            tresuryCode: ['', Validators.required],
            ddoCode: ['', Validators.required],
            balCeilAmt: [''],
            allotedAmt: this.validatorService.validation('Amount', 0, 100, ''),
            ceilAmt: [''],
        });
        this.amountFormSAODDO = this.fb.group({
            allotmentDate: [''],
            saoDdoCode: ['', Validators.required],
            balCeilAmt: [''],
            allotedAmt: this.validatorService.validation('Amount', 0, 100, ''),
            ceilAmt: [''],
        });
    }

    getAllotments() {
        this.dataService.MyAllotments.wire.subscribe((value) => {
            this.allotSource = this.copyAllotSource = new MatTableDataSource(value);
            this.allotSource.paginator = this.paginator;
            this.allotSource.sort = this.sort;
        });
    }

    ngAfterViewInit(): void {
        // this.allotSource.paginator = this.paginator;
        // this.allotSource.sort = this.sort;
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

    // onHoaSearch() {
    //     this.isSearchDone = true;
    //     this.nextAccordionStep();
    // }

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
        if (rowSelected > 0) {
            this.clickedRows.clear();
        }
        this.clickedRows.add(row);
        this.isRowClicked = true;
    }

    get clickedRowsArray(): any[] {
        return Array.from(this.clickedRows);
    }

    onHoaSelect() {
        if (this.clickedRowsArray.length == 0) {
            this.notify.alert('Please select one row!');
        } else {
            this.nextAccordionStep();
        }
    }

    bindHOAtoSaoForm_n_DdoForm() {
        // this.datePipeString = this.datePipe.transform(this.clickedRowsArray[0].allotmentDate, 'yyyy-MM-dd');
        this.datePipeString = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
        this.dataService.MyAllotments.wire.subscribe((value) => {
            if (this.clickedRowsArray.length != 0) {
                var allotment = value.filter((a: any) => {
                    if (a.allotmentId == this.clickedRowsArray[0].allotmentId) {
                        return a;
                    }
                });
                this.amountFormDDO.patchValue({
                    balCeilAmt: this.clickedRowsArray[0].ceilingAmount - this.clickedRowsArray[0].provisionalReleasedAmount,
                    ceilAmt: this.clickedRowsArray[0].ceilingAmount - this.clickedRowsArray[0].provisionalReleasedAmount - allotment[0]['FE_provisional_release'],
                    allotmentDate: this.datePipeString,
                });
                this.amountFormSAO.patchValue({
                    balCeilAmt: this.clickedRowsArray[0].ceilingAmount - this.clickedRowsArray[0].provisionalReleasedAmount,
                    ceilAmt: this.clickedRowsArray[0].ceilingAmount - this.clickedRowsArray[0].provisionalReleasedAmount - allotment[0]['FE_provisional_release'],
                    allotmentDate: this.datePipeString,
                });
                this.amountFormSAODDO.patchValue({
                    balCeilAmt: this.clickedRowsArray[0].ceilingAmount - this.clickedRowsArray[0].provisionalReleasedAmount,
                    ceilAmt: this.clickedRowsArray[0].ceilingAmount - this.clickedRowsArray[0].provisionalReleasedAmount - allotment[0]['FE_provisional_release'],
                    allotmentDate: this.datePipeString,
                });
            }
        });
    }

    makeAll_isTreasurySelected(e: any, f: boolean) { }

    makeAll_isReceiverSelected(e: any, f: boolean) { }

    onMapValueSelect(e: any, val: number) {
        if (e.isTrusted) {
            this.isMapTypeSelected = true;
            this.mapId = val;
            if (this.mapId == EnumReleaseMapType.HOD_to_SAO || this.mapId == EnumReleaseMapType.SAO_to_SAO) {
                // this.getAllSao();
                this.getSaoHeirarchy();
            } else if (this.mapId == EnumReleaseMapType.HOD_to_SAODDO || this.mapId == EnumReleaseMapType.SAO_to_SAODDO) {
                this.commonService.getFavList(FavListPayloadType.Allotment_Receiver_n_Amount).subscribe((resp) => {
                    this.saoDdoList = resp;
                    this.saoDdoList.forEach((element) => {
                        element.payload = JSON.parse(element.payload);
                    });
                    console.log(this.saoDdoList);
                });
            }
            this.isSaoHeirerchySelected = false;
            this.isDistributedToClicked = false;
            this.isTreasurySelected = false;
            this.isDdoSelected = false;
            this.isSaoSelected = false;
        }
    }

    getOwnDdoAndPupulateWithData(e: any) {
        this.commonService.getOwnDdo().subscribe((resp) => {
            console.log(resp.result[0]);
            this.amountFormDDO.patchValue({
                ddoCode: resp.result[0].ownDdo,
            });
            this.amountFormDDO.controls['ddoCode'].disable();
            this.selectedReceiver = [];
            this.selectedReceiver.push(resp.result[0]);
            this.amountFormDDO.controls['tresuryCode'].clearValidators();
            this.amountFormDDO.controls['tresuryCode'].updateValueAndValidity();
        });
    }

    resetAmountDdoForm() {
        this.amountFormDDO.controls['ddoCode'].enable();
        this.amountFormDDO.reset();
    }

    onClickAllDdo(e: any) {
        this.getAllTreasury(0);
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
            this.selectedReceiver = [];
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
        }
    }

    tickSao(sao: any) {
        if (this.selectedReceiver.includes(sao))
            this.selectedReceiver = this.selectedReceiver.filter((v: any) => { return v.code != sao.code });
        else
            this.selectedReceiver.push(sao);
        this.amountFormSAO.patchValue({ sao: this.selectedReceiver.map(v => v.code).join(', ') })
    }

    getAllTreasury(i: any) {
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
            this.amountFormDDO.controls['ddoCode'].reset();
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
            console.log(this.selectedReceiver);
        }
    }

    tickDdo(ddo: any) {
        if (this.selectedReceiver.includes(ddo))
            this.selectedReceiver = this.selectedReceiver.filter((v: any) => { return v.code != ddo.code });
        else
            this.selectedReceiver.push(ddo);
        this.amountFormDDO.patchValue({ ddoCode: this.selectedReceiver.map(v => v.code).join(', ') })
    }

    calCielAmt() {
        var allotment = this.dataService.MyAllotments.value.filter((a: any) => {
            if (a.allotmentId == this.clickedRowsArray[0].allotmentId) {
                return a;
            }
        });
        this.amountFormSAO.patchValue({
            ceilAmt: +this.amountFormSAO.value.balCeilAmt - +this.amountFormSAO.value.allotedAmt * this.selectedReceiver.length - allotment[0]['FE_provisional_release'],
        });
        this.amountFormDDO.patchValue({
            ceilAmt: +this.amountFormDDO.value.balCeilAmt - +this.amountFormDDO.value.allotedAmt * this.selectedReceiver.length - allotment[0]['FE_provisional_release'],
        });
        this.amountFormSAODDO.patchValue({
            ceilAmt: +this.amountFormSAODDO.value.balCeilAmt - +this.amountFormSAODDO.value.allotedAmt * this.selectedReceiver.length - allotment[0]['FE_provisional_release'],
        });
    }

    emitPayload() {
        if (this.mapId == EnumReleaseMapType.HOD_to_SAO) {
            this.amountFormSAO.markAllAsTouched();
            if (this.amountFormSAO.valid) {

                // console.log(this.selectedHodToSaoArray);
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.selectedHodToSaoArray.push(v);
                    this.onPayloadReady.emit({
                        from_allotmentId: this.clickedRowsArray[0].allotmentId,
                        allotmentDate: this.datePipeString,
                        // hoa: this.clickedRowsArray[0].demandNo+'-'+this.clickedRowsArray[0].majorHead+'-'+this.clickedRowsArray[0].submajorHead+'-'+this.clickedRowsArray[0].minorHead+'-'+this.clickedRowsArray[0].schemeHead+'-'+this.clickedRowsArray[0].detailHead+'-'+this.clickedRowsArray[0].subdetailHead+'-'+this.clickedRowsArray[0].votedCharged,
                        hoa: this.clickedRowsArray[0],
                        sao_ddo: v,
                        amount: this.amountFormSAO.value.allotedAmt,
                        mapId: EnumReleaseMapType.HOD_to_SAO,
                        initialMapId: EnumReleaseMapType.HOD_to_SAO,
                    });
                });
                // this.amountFormSAO.controls['saoHeirerchy'].reset();
                this.amountFormSAO.controls['sao'].reset();
                this.amountFormSAO.controls['allotedAmt'].reset();
                // this.amountFormSAO.controls['ceilAmt'].reset();
            }
        } else if (this.mapId == EnumReleaseMapType.HOD_to_DDO) {
            this.amountFormDDO.markAllAsTouched();
            if (this.amountFormDDO.valid) {

                console.log(this.selectedHodToDdoArray);
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.selectedHodToDdoArray.push(v);
                    this.onPayloadReady.emit({
                        from_allotmentId: this.clickedRowsArray[0].allotmentId,
                        allotmentDate: this.datePipeString,
                        // hoa: this.clickedRowsArray[0].demandNo+'-'+this.clickedRowsArray[0].majorHead+'-'+this.clickedRowsArray[0].submajorHead+'-'+this.clickedRowsArray[0].minorHead+'-'+this.clickedRowsArray[0].schemeHead+'-'+this.clickedRowsArray[0].detailHead+'-'+this.clickedRowsArray[0].subdetailHead+'-'+this.clickedRowsArray[0].votedCharged,
                        hoa: this.clickedRowsArray[0],
                        sao_ddo: v,
                        amount: this.amountFormDDO.value.allotedAmt,
                        mapId: EnumReleaseMapType.HOD_to_DDO,
                        initialMapId: EnumReleaseMapType.HOD_to_DDO,
                    });
                });
                // this.amountFormDDO.controls['tresuryCode'].reset();
                this.amountFormDDO.controls['ddoCode'].reset();
                this.amountFormDDO.controls['allotedAmt'].reset();
                // this.amountFormDDO.controls['ceilAmt'].reset();
            }
        } else if (this.mapId == EnumReleaseMapType.SAO_to_SAO) {
            this.amountFormSAO.markAllAsTouched();
            if (this.amountFormSAO.valid) {
                this.selectedSaoToSaoArray.push(this.selectedReceiver);
                console.log(this.selectedSaoToSaoArray);
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.onPayloadReady.emit({
                        from_allotmentId: this.clickedRowsArray[0].allotmentId,
                        allotmentDate: this.datePipeString,
                        // hoa: this.clickedRowsArray[0].demandNo+'-'+this.clickedRowsArray[0].majorHead+'-'+this.clickedRowsArray[0].submajorHead+'-'+this.clickedRowsArray[0].minorHead+'-'+this.clickedRowsArray[0].schemeHead+'-'+this.clickedRowsArray[0].detailHead+'-'+this.clickedRowsArray[0].subdetailHead+'-'+this.clickedRowsArray[0].votedCharged,
                        hoa: this.clickedRowsArray[0],
                        sao_ddo: v,
                        amount: this.amountFormSAO.value.allotedAmt,
                        mapId: EnumReleaseMapType.SAO_to_SAO,
                        initialMapId: EnumReleaseMapType.SAO_to_SAO,
                    });
                });
                // this.amountFormSAO.controls['saoHeirerchy'].reset();
                this.amountFormSAO.controls['sao'].reset();
                this.amountFormSAO.controls['allotedAmt'].reset();
                // this.amountFormSAO.reset();
                // this.amountFormSAO.controls['ceilAmt'].reset();
            }
        } else if (this.mapId == EnumReleaseMapType.SAO_to_DDO) {
            this.amountFormDDO.markAllAsTouched();
            if (this.amountFormDDO.valid) {
                this.selectedSaoToDdoArray.push(this.selectedReceiver);
                console.log(this.selectedSaoToDdoArray);
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.onPayloadReady.emit({
                        from_allotmentId: this.clickedRowsArray[0].allotmentId,
                        allotmentDate: this.datePipeString,
                        // hoa: this.clickedRowsArray[0].demandNo+'-'+this.clickedRowsArray[0].majorHead+'-'+this.clickedRowsArray[0].submajorHead+'-'+this.clickedRowsArray[0].minorHead+'-'+this.clickedRowsArray[0].schemeHead+'-'+this.clickedRowsArray[0].detailHead+'-'+this.clickedRowsArray[0].subdetailHead+'-'+this.clickedRowsArray[0].votedCharged,
                        hoa: this.clickedRowsArray[0],
                        sao_ddo: v,
                        amount: this.amountFormDDO.value.allotedAmt,
                        mapId: EnumReleaseMapType.SAO_to_DDO,
                        initialMapId: EnumReleaseMapType.SAO_to_DDO,
                    });
                });
                // this.amountFormDDO.controls['tresuryCode'].reset();
                this.amountFormDDO.controls['ddoCode'].reset();
                this.amountFormDDO.controls['allotedAmt'].reset();
                // this.amountFormDDO.controls['ceilAmt'].reset();
            }
        } else if (this.mapId == EnumReleaseMapType.HOD_to_SAODDO) {
            this.amountFormSAODDO.markAllAsTouched();
            if (this.amountFormSAODDO.valid) {
                // this.selectedSaoToSaoArray.push(this.selectedReceiver);
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.onPayloadReady.emit({
                        from_allotmentId: this.clickedRowsArray[0].allotmentId,
                        allotmentDate: this.datePipeString,
                        hoa: this.clickedRowsArray[0],
                        sao_ddo: v,
                        amount: this.amountFormSAODDO.value.allotedAmt,
                        mapId: v.payload.mapId == 0 ? EnumReleaseMapType.HOD_to_SAO : EnumReleaseMapType.HOD_to_DDO,
                        initialMapId: EnumReleaseMapType.HOD_to_SAODDO,
                    });
                });
                this.amountFormSAODDO.controls['allotedAmt'].reset();
                this.amountFormSAODDO.controls['saoDdoCode'].reset();
            }
        } else if (this.mapId == EnumReleaseMapType.SAO_to_SAODDO) {
            this.amountFormSAODDO.markAllAsTouched();
            if (this.amountFormSAODDO.valid) {
                // this.selectedSaoToDdoArray.push(this.selectedReceiver);
                this.selectedReceiver.forEach((v: any, i: number) => {
                    this.onPayloadReady.emit({
                        from_allotmentId: this.clickedRowsArray[0].allotmentId,
                        allotmentDate: this.datePipeString,
                        hoa: this.clickedRowsArray[0],
                        sao_ddo: v,
                        amount: this.amountFormSAODDO.value.allotedAmt,
                        mapId: v.payload.mapId == 3 ? EnumReleaseMapType.SAO_to_SAO : EnumReleaseMapType.SAO_to_DDO,
                        initialMapId: EnumReleaseMapType.SAO_to_SAODDO,
                    });
                });
                this.amountFormSAODDO.controls['allotedAmt'].reset();
                this.amountFormSAODDO.controls['saoDdoCode'].reset();
            }
        }
        this.selectedReceiver = [];
    }

    deleteRow(payload: any) {
        if (payload.mapId == EnumReleaseMapType.HOD_to_SAO) {
            this.selectedHodToSaoArray.splice(
                this.selectedHodToSaoArray.findIndex((i) => i.id == payload.sao_ddo.id),
                1
            );
        } else if (payload.mapId == EnumReleaseMapType.HOD_to_DDO) {
            this.selectedHodToDdoArray.splice(
                this.selectedHodToDdoArray.findIndex((i) => i.id == payload.sao_ddo.id),
                1
            );
        } else if (payload.mapId == EnumReleaseMapType.SAO_to_DDO) {
            this.selectedSaoToDdoArray.splice(
                this.selectedSaoToDdoArray.findIndex((i) => i.id == payload.sao_ddo.id),
                1
            );
        } else if (payload.mapId == EnumReleaseMapType.SAO_to_SAO) {
            this.selectedSaoToSaoArray.splice(
                this.selectedSaoToSaoArray.findIndex((i) => i.id == payload.sao_ddo.id),
                1
            );
            // console.log(this.selectedSaoToSaoArray);
            // if(this.selectedSaoToSaoArray.length == 0){
            //     this.amountFormSAO.markAllAsTouched();
            //     console.log('aaaaaa');
            //     this.receiverForm.reset();
            //     this.amountFormSAO.controls['allotmentDate'].reset();
            //     this.amountFormSAO.controls['saoHeirerchy'].reset();
            // }
        }
    }

    setDataSourceAttributes() {
        // this.allotSource.paginator = this.paginator;
        // this.allotSource.sort = this.sort;
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

    onSaoDdoSelect(e: any, saoddo: any) {
        if (e.isUserInput) {
            this.selectedReceiver = [];
            this.selectedReceiver.push(saoddo);
            this.amountFormSAODDO.patchValue({
                allotedAmt: saoddo.payload.amount,
            });
            this.calCielAmt();
        }
    }
}
