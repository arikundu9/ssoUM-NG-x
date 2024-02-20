import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EnumSanctionType } from '@C/common/enum';
import { ValidationService } from '@S/validation.service';

@Component({
    selector: 'app-wb-budget-dist-draft-management',
    templateUrl: './wb-budget-dist-draft-management.component.html',
    styleUrls: ['./wb-budget-dist-draft-management.component.scss'],
})
export class WbBudgetDistDraftManagementComponent implements OnInit {
    accordionStep = 0;
    payloadDataForApprove: any[] = [];
    draftModifyForm!: FormGroup;
    memoList: any[] = [];
    memoForm!: FormGroup;
    isSanctionedClicked: boolean = false;
    today = new Date();
    isMemoNoSelected: boolean = false;
    draftData: any[] = [];
    filteredData: any[] = [];
    datePipeString: any;
    finalPayload: any;

    constructor(private commonService: CommonService, private notify: NotificationService, private router: Router, private fb: FormBuilder, private datePipe: DatePipe, private validationService: ValidationService) {}

    ngOnInit(): void {
        this.draftModifyForm = this.fb.group({
            memoNo: this.validationService.validation('', 0, 100, ''),
            allotmentType: [''],
            dateFrom: [''],
            dateTo: [''],
        });

        this.memoForm = this.fb.group({
            memoNo: this.validationService.validation('', 0, 100, ''),
            date: [''],
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

        this.commonService.getAllDraftedData().subscribe((resp) => {
            console.log(resp);
            this.draftData = resp;
            this.memoList = resp.map((elm: any) => elm.memoNumber);
        });
    }

    get getEnumSanctionType() {
        return EnumSanctionType;
    }

    get draftModifyFormErrorControl() {
        return this.draftModifyForm.controls;
    }

    get memoFormErrorControl() {
        return this.memoForm.controls;
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

    get copyForwardArray() {
        return this.memoForm.controls['copyForward'] as FormArray;
    }

    addcopyForwardController() {
        for (let i = 0; i < this.filteredData[0].copyTo.length; i++) {
            const copyFwrdFormStruct = this.fb.group({
                cf: ['', Validators.required],
            });
            this.copyForwardArray.push(copyFwrdFormStruct);
            copyFwrdFormStruct.patchValue({ cf: this.filteredData[0].copyTo[i] });
        }
    }

    addcopyForward() {
        const copyFwrdFormStruct = this.fb.group({
            cf: ['', Validators.required],
        });
        this.copyForwardArray.push(copyFwrdFormStruct);
    }

    deletecopyForwardController(i: number) {
        this.copyForwardArray.removeAt(i);
    }

    bindData(e: any, memoNo: any) {
        if (e.isUserInput) {
            this.filteredData = this.draftData.filter((elm) => elm.memoNumber === memoNo);
            // console.log(this.filteredData);
            this.copyForwardArray.clear();
        }
    }

    changeDateFormat(date: string) {
        var dateParts = date.substring(0, 10).split('-');
        var ddMMYYYYDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return ddMMYYYYDate;
    }

    onSearch() {
        if (this.isMemoNoSelected) {
            // const newDate = this.datePipe.transform(this.changeDateFormat(this.filteredData[0].memoDate),'dd-MM-yyyy');
            this.memoForm.patchValue({
                memoNo: this.filteredData[0].memoNumber,
                date: new Date(this.changeDateFormat(this.filteredData[0].memoDate)),
                remarks: this.filteredData[0].remarks,
            });
            this.addcopyForwardController();
            this.nextAccordionStep();
        } else {
            this.notify.alert('Please select the memo number..!');
            this.draftModifyForm.controls['memoNo'].markAsTouched();
        }
    }

    draftToFinalSanction() {
        if (!this.memoForm.valid) {
            this.notify.alert('Please check all the fields carefully..!');
            this.memoForm.markAllAsTouched();
        } else {
            this.notify.confirmProposal('Are you sure ?', 'Do you really want to generate sanction?').then((res) => {
                if (res) {
                    let idArray: any[] = [];
                    let copyArray: any[] = [];
                    let sum: number = 0;

                    this.datePipeString = this.datePipe.transform(this.memoForm.value.date, 'yyyy-MM-dd');

                    for (let i = 0; i < this.memoForm.value.copyForward.length; i++) {
                        copyArray.push(this.memoForm.value.copyForward[i].cf);
                    }

                    if (this.draftModifyForm.value.allotmentType === EnumSanctionType.Withdrawl) {
                        this.finalPayload = {
                            sanctionId: this.filteredData[0].sanctionId,
                            withdrawlIds: this.filteredData[0].allotmentIds,
                            memoNumber: this.memoForm.value.memoNo,
                            memoDate: this.datePipeString,
                            remarks: this.memoForm.value.remarks,
                            copyTo: copyArray,
                            majorHead: this.filteredData[0].majorHead,
                            sanctionAmount: this.filteredData[0].sanctionAmount,
                            sanctionType: +this.draftModifyForm.value.allotmentType,
                            transactionType: 1, // 1 for Revoke & 0 for Release.
                            sanctionStatus: 1, // 1 for sanction.
                        };

                        this.commonService.sanctionWithdrawalledAllotments(this.finalPayload).subscribe({
                            next: (res) => {
                                this.decodeAndDownloadPdf(res.sanctionLetterFile);
                                this.notify.success('Allotments are sanctioned successfully..!');
                            },
                            error: (er) => {
                                // console.log(er);
                            },
                        });
                    } else if (this.draftModifyForm.value.allotmentType === EnumSanctionType.Sanction) {
                        //This payload will be different said by Krishnendu Sir.
                    } else {
                        this.finalPayload = {
                            sanctionId: this.filteredData[0].sanctionId,
                            allotmentIds: this.filteredData[0].allotmentIds,
                            memoNumber: this.memoForm.value.memoNo,
                            memoDate: this.datePipeString,
                            remarks: this.memoForm.value.remarks,
                            copyTo: copyArray,
                            majorHead: this.filteredData[0].majorHead,
                            sanctionAmount: this.filteredData[0].sanctionAmount,
                            sanctionType: +this.draftModifyForm.value.allotmentType,
                            transactionType: 0, // 1 for Revoke & 0 for Release.
                            sanctionStatus: 1, // 1 for sanction.
                        };

                        // console.log(this.finalPayload);

                        this.commonService.sanctionAllotments(this.finalPayload).subscribe({
                            next: (res) => {
                                this.decodeAndDownloadPdf(res.sanctionLetterFile);
                                this.notify.success('Allotments are sanctioned successfully..!');
                            },
                            error: (er) => {
                                // console.log(er);
                            },
                        });
                    }
                }
            });
        }
    }

    viewReport() {
        if (this.isMemoNoSelected) {
            this.downloadPdf(this.filteredData[0].sanctionLetterFile);
        } else {
            this.notify.alert('Please select the memo number..!');
            this.draftModifyForm.controls['memoNo'].markAsTouched();
        }
    }

    downloadPdf(s: string) {
        const ds = atob(s);
        const byteNumbers = new Array(ds.length);
        for (let i = 0; i < ds.length; i++) {
            byteNumbers[i] = ds.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const bb = new Blob([byteArray], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(bb);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Letter.pdf';
        link.click();
    }

    decodeAndDownloadPdf(s: string) {
        console.clear();
        const ds = atob(s);
        const byteNumbers = new Array(ds.length);
        for (let i = 0; i < ds.length; i++) {
            byteNumbers[i] = ds.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const bb = new Blob([byteArray], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(bb);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Letter.pdf';
        link.click();
        // window.open(downloadURL);
        this.router.navigate(['home']);
    }
}
