import { map } from 'rxjs';
import { dataService } from '@S/data.service';
import { Router } from '@angular/router';
import { NotificationService } from '@S/notification.service';
import { CommonService } from '@S/common.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent } from '../wb-budget-dist-entry-single-hoa-to-multi-rcvr-child/wb-budget-dist-entry-single-hoa-to-multi-rcvr-child.component';
import { WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent } from '../wb-budget-dist-entry-multi-hoa-to-single-rcvr-child/wb-budget-dist-entry-multi-hoa-to-single-rcvr-child.component';
import { EnumReleaseMapType, FavListPayloadType, UserType } from '@C/common/enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-wb-budget-dist-entry-parent',
    templateUrl: './wb-budget-dist-entry-parent.component.html',
    styleUrls: ['./wb-budget-dist-entry-parent.component.css'],
})
export class WbBudgetDistEntryParentComponent implements OnInit {
    @ViewChild(WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent) wbBudgetEntrySingleHoaToMultiRcvrChild: WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent | undefined;
    @ViewChild(WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent) wbBudgetEntryMultiHoaToSingleRcvrChild: WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent | undefined;

    isMultiReceiverMode: boolean = true;
    payloads: any[] = [];
    favPayloadArray: any[] = [];
    initialMapId!: number;

    parentForm!: FormGroup;

    constructor(private commonService: CommonService, private notify: NotificationService, private router: Router, private fb: FormBuilder, public dataService: dataService, private _snackBar: MatSnackBar, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.dataService.MyAllotments.reload();
        this.dataService.MyAllotments.wire.subscribe((v) => {});
        this.parentForm = this.fb.group({
            allotmentType: ['', Validators.required],
        });
    }

    pushIntoPayloads(e: any) {
        this.increaseAllotedAmount(e);
        this.payloads.push(e);
        this._snackBar.open('Allotment added to bellow list', '✔', {
            duration: 3000,
            horizontalPosition: 'right',
        });
        console.log(e);
        this.initialMapId = e.initialMapId;
        if (this.initialMapId == EnumReleaseMapType.HOD_to_SAO || this.initialMapId == EnumReleaseMapType.HOD_to_DDO || this.initialMapId == EnumReleaseMapType.SAO_to_DDO || this.initialMapId == EnumReleaseMapType.SAO_to_SAO || this.initialMapId == EnumReleaseMapType.DEPT_to_DEPT) {
            e.sao_ddo.name = e.sao_ddo.name?.trim();
            this.favPayloadArray.push({
                payload: JSON.stringify({
                    saoDdo: e.sao_ddo,
                    amount: e.amount,
                    mapId: e.mapId,
                }),
                payloadType: FavListPayloadType.Allotment_Receiver_n_Amount,
            });
        }
    }

    increaseAllotedAmount(alot: any) {
        this.dataService.MyAllotments.value = this.dataService.MyAllotments.value.map((a: any) => {
            if (alot.from_allotmentId == a.allotmentId) {
                a['FE_provisional_release'] = a['FE_provisional_release'] + alot.amount;
            }
            return a;
        });
    }

    deleteRowFromPayload(i: any) {
        this.wbBudgetEntrySingleHoaToMultiRcvrChild?.deleteRow(this.payloads[i]);
        this.decreaseAllotedAmount(this.payloads[i]);
        this.payloads.splice(i, 1);
        this.wbBudgetEntryMultiHoaToSingleRcvrChild?.deleteRow(this.payloads);
    }

    decreaseAllotedAmount(alot: any) {
        this.dataService.MyAllotments.value = this.dataService.MyAllotments.value.map((a: any) => {
            if (alot.from_allotmentId == a.allotmentId) {
                a['FE_provisional_release'] = a['FE_provisional_release'] - alot.amount;
            }
            return a;
        });
    }

    get totalAmount() {
        var s = 0;
        this.payloads.forEach((data) => {
            s = s + data.amount;
        });
        return s;
    }

    submitRelease() {
        if (this.favPayloadArray.length !== 0 && (this.initialMapId == EnumReleaseMapType.HOD_to_SAO || this.initialMapId == EnumReleaseMapType.HOD_to_DDO || this.initialMapId == EnumReleaseMapType.SAO_to_DDO || this.initialMapId == EnumReleaseMapType.SAO_to_SAO || this.initialMapId == EnumReleaseMapType.DEPT_to_DEPT)) {
            this.commonService.addToFavlist(this.favPayloadArray).subscribe((resp) => {});
        }
        var payloadData: any[] = [];
        this.payloads.forEach((data) => {
            if (data.initialMapId == EnumReleaseMapType.HOD_to_SAODDO || data.initialMapId == EnumReleaseMapType.SAO_to_SAODDO) {
                var obj = {
                    // wallet_id: data.hoa.hodWalletId,
                    // financial_year: data.hoa.finYearId,
                    // dept_code: data.hoa.deptCode,
                    // demand_no: data.hoa.demandNo,
                    // major_head: data.hoa.majorHead,
                    // submajor_head: data.hoa.submajorHead,
                    // minor_head: data.hoa.minorHead,
                    // plan_status: data.hoa.planStatus,
                    // scheme_head: data.hoa.schemeHead,
                    // detail_head: data.hoa.detailHead,
                    // subdetail_head: data.hoa.subdetailHead,
                    // voted_charged: data.hoa.votedCharged,
                    // amount: data.amount,
                    // transaction_type: 1,
                    // map_type: data.mapId,
                    // sender_code: 'xyBIGR001',
                    // receiver_code: data.sao_ddo.code,
                    // status: 0,
                    // created_by: 123456,
                    // allotmentType : +this.parentForm.value.allotmentType,

                    fromAllotmentId: data.hoa.allotmentId,
                    receiverUserType: data.mapId == EnumReleaseMapType.HOD_to_SAO || data.mapId == EnumReleaseMapType.SAO_to_SAO ? UserType.SAO : UserType.DDO,
                    receiverSaoDdoCode: data.sao_ddo.payload.saoDdo.code,
                    budgetAllotedAmount: data.amount,
                    mapType: data.mapId,
                    sanctionType: +this.parentForm.value.allotmentType,
                    allotmentDate: data.allotmentDate,
                };
            } else {
                var obj = {
                    // wallet_id: data.hoa.hodWalletId,
                    // financial_year: data.hoa.finYearId,
                    // dept_code: data.hoa.deptCode,
                    // demand_no: data.hoa.demandNo,
                    // major_head: data.hoa.majorHead,
                    // submajor_head: data.hoa.submajorHead,
                    // minor_head: data.hoa.minorHead,
                    // plan_status: data.hoa.planStatus,
                    // scheme_head: data.hoa.schemeHead,
                    // detail_head: data.hoa.detailHead,
                    // subdetail_head: data.hoa.subdetailHead,
                    // voted_charged: data.hoa.votedCharged,
                    // amount: data.amount,
                    // transaction_type: 1,
                    // map_type: data.mapId,
                    // sender_code: 'xyBIGR001',
                    // receiver_code: data.sao_ddo.code,
                    // status: 0,
                    // created_by: 123456,
                    // allotmentType : +this.parentForm.value.allotmentType,

                    fromAllotmentId: data.hoa.allotmentId,
                    receiverUserType: data.mapId == EnumReleaseMapType.HOD_to_SAO || data.mapId == EnumReleaseMapType.SAO_to_SAO ? UserType.SAO : UserType.DDO,
                    receiverSaoDdoCode: data.sao_ddo.code,
                    budgetAllotedAmount: data.amount,
                    mapType: data.mapId,
                    sanctionType: +this.parentForm.value.allotmentType,
                    allotmentDate: data.allotmentDate,
                };
            }
            payloadData.push(obj);
        });
        this.notify.confirmEntryProposal('Are you sure ?', 'Do you want to save?').then((res) => {
            if (res) {
                this.commonService.submitRelease(payloadData).subscribe((resp) => {});
            }
        });
    }
}
