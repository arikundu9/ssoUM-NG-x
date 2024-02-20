import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

@Component({
    selector: 'app-budget-re-appropration-approve',
    templateUrl: './budget-re-appropration-approve.component.html',
    styleUrls: ['./budget-re-appropration-approve.component.scss'],
})
export class BudgetReApproprationApproveComponent implements OnInit {
    accordionStep = 0;
    public formTitle = 'Budget Re Appropriation Approve';
    reAppropriationForm!: FormGroup;

    reAppropriateDataArrayForApprove: any[] = [];
    isReAppropriationIdSelected: boolean = false;
    selectedReAppropriationData: any;
    selectedReAppropriateData: any[] = [];
    isSaveClicked: boolean = false;
    isSearchClicked: boolean = false;
    reAppropriateUniqueDataArrayForApprove: any[] = [];

    constructor(private fb: FormBuilder, private commonService: CommonService, private notify: NotificationService, private validatorService: ValidationService) {}

    ngOnInit(): void {
        this.reAppropriationForm = this.fb.group({
            financialYear: [''],
            department: [''],
            approvingAuthority: [''],
            fileNumber: [''],
            uoNumber: [''],
            date: [''],
            id: this.validatorService.validation('Required', 0, 100, ''),
            deductAmount: this.validatorService.validation('Disable', 0, 100, ''),
            reappropriateAmount: this.validatorService.validation('Disable', 0, 100, ''),
            selfCertification: [''],
            remarks: [''],
            approverRemarks: [''],
        });

        this.commonService.getReAppropriationDataForModify().subscribe((resp: any) => {
            this.reAppropriateDataArrayForApprove = resp;

            this.reAppropriateUniqueDataArrayForApprove = this.reAppropriateDataArrayForApprove.reduce((accumulator, current) => {
                if (!accumulator.find((item: any) => item.transactionId === current.transactionId)) {
                    accumulator.push(current);
                }
                return accumulator;
            }, []);
            console.log(this.reAppropriateUniqueDataArrayForApprove);
        });
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

    onReAppropriationIdSelect(e: any, reAppropriationData: any) {
        if (e.isUserInput) {
            this.isReAppropriationIdSelected = true;
            this.selectedReAppropriationData = reAppropriationData;
            this.selectedReAppropriateData = this.reAppropriateDataArrayForApprove.filter((elm: any) => {
                return elm.transactionId == reAppropriationData.transactionId;
            });
            console.log(this.selectedReAppropriateData);
            this.reAppropriationForm.patchValue({
                deductAmount: reAppropriationData.reappropriationAmount,
                reappropriateAmount: reAppropriationData.reappropriationAmount,
                selfCertification: reAppropriationData.reappropriationId,
                remarks: reAppropriationData.remarks,
            });
        }
    }

    onSearchBindData() {
        this.reAppropriationForm.markAllAsTouched();
        if (this.isReAppropriationIdSelected) {
            this.isSearchClicked = true;
            // this.selectedReAppropriateData = [];
            // this.selectedReAppropriateData.push(this.selectedReAppropriationData);
            this.nextAccordionStep();
        } else {
            this.notify.alert('Please select the Re Appropriation Id first ..!');
        }
    }

    approveReAppropriation() {
        if (!this.reAppropriationForm.valid) {
            this.notify.alert('Please check all the fields carefully..!');
            this.reAppropriationForm.markAllAsTouched();
        } else {
            // let obj = {
            //     reappropriationId: this.selectedReAppropriationData.reappropriationId,
            //     fromAllotmentId: this.selectedReAppropriationData.fromAllotmentId,
            //     toAllotmentId: this.selectedReAppropriationData.toAllotmentId,
            //     reappropriationAmount: this.selectedReAppropriationData.reappropriationAmount,
            //     remarks: this.reAppropriationForm.value.approverRemarks,
            // };
            let jsonArray: any[] = [];
            // jsonArray.push(obj);
            this.commonService.approveReAppropriation(this.selectedReAppropriateData[0].transactionId, this.reAppropriationForm.value.approverRemarks).subscribe((resp) => {
                // this.notify.success("Re-Appropriation approved successfully..!");
            });
        }
    }

    save() {
        this.isSaveClicked = true;
        this.nextAccordionStep();
    }
}
