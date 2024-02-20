import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-budget-re-appropration-modify',
    templateUrl: './budget-re-appropration-modify.component.html',
    styleUrls: ['./budget-re-appropration-modify.component.scss'],
})
export class BudgetReApproprationModifyComponent implements OnInit {
    public flag!: boolean;
    public rowListFrom: any[] = [];
    public rowListTo: any[] = [];
    accordionStep = 0;
    fromStruct: any;
    toStruct: any;
    fromDetailsArray: any[] = [];

    public formTitle = 'Budget Re Appropriation Modify';
    fromReAppropriateData: any[] = [];
    toReAppropriateData: any[] = [];
    hoa: any;

    reAppropriationForm!: FormGroup;

    reAppropriateDataArrayForModify: any[] = [];
    selectedReAppropriationData: any;
    isReAppropriationIdSelected: boolean = false;
    isReAppropriatedAmountValidated: boolean = false;
    isDeductAmountValidated: boolean = false;
    reAppropriateModifyPayload: any[] = [];

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

            //form array
            fromFormArrayC: this.fb.array([]),
            toFormArrayC: this.fb.array([]),

            selfCertification: [''],
            remarks: [''],
        });
        this.addfromController();
        this.addtoController();

        this.commonService.getReAppropriationDataForModify().subscribe((resp: any) => {
            this.reAppropriateDataArrayForModify = resp;
        });
    }

    get fromFormArray(): FormArray {
        return this.reAppropriationForm.controls['fromFormArrayC'] as FormArray;
    }

    fromsFormArray_as_FormGroup(i: any): FormGroup {
        const formGroup = this.fromFormArray.controls[i] as FormGroup;
        return formGroup;
    }

    addfromController() {
        this.fromStruct = this.fb.group({
            hoa: [''],
            budget: [''],
            currentBalance: [''],
            deductAmount: this.validatorService.validation('Amount', 0, 100, ''),
            revisedBalance: [''],
        });
        this.fromFormArray.push(this.fromStruct);
    }

    deletefromController(i: number) {
        this.fromFormArray.removeAt(i);
        this.fromDetailsArray.splice(i, 1);
    }

    get toFormArray(): FormArray {
        return this.reAppropriationForm.controls['toFormArrayC'] as FormArray;
    }

    tosFormArray_as_FormGroup(i: any): FormGroup {
        const formGroup = this.toFormArray.controls[i] as FormGroup;
        return formGroup;
    }

    addtoController() {
        this.toStruct = this.fb.group({
            hoa: [''],
            budget: [''],
            currentBalance: [''],
            reAppropriationAmount: this.validatorService.validation('Amount', 0, 100, ''),
            revisedBalance: [''],
        });
        this.toFormArray.push(this.toStruct);
    }

    deletetoController(i: number) {
        this.toFormArray.removeAt(i);
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

    onHoaSelect(e: any, hoa: any, index: number) {
        if (e.isUserInput) {
            this.fromDetailsArray.push(hoa);
            this.hoa = hoa;
            this.fromsFormArray_as_FormGroup(index).patchValue({ budget: hoa.ceilingAmount, currentBalance: hoa.ceilingAmount - hoa.provisionalReleasedAmount });
        }
    }

    calRevisedBalance(from: any) {
        from.patchValue({
            revisedBalance: from.value.currentBalance - from.value.deductAmount,
        });
    }

    get totalDeductAmount() {
        let s: number = 0;
        this.fromFormArray.value.forEach((elm: any) => {
            s = s + elm.deductAmount;
        });
        return s;
    }

    fromDetailsSaveNext() {
        this.fromFormArray.value.forEach((element: any) => {
            if (element.deductAmount !== '' && element.deductAmount % 1000 === 0) {
                this.isDeductAmountValidated = true;
            } else {
                this.isDeductAmountValidated = false;
            }
        });

        if (!this.isDeductAmountValidated) {
            this.notify.alert('Please enter the amount in multiple of 1000');
        } else {
            this.nextAccordionStep();
        }
    }

    onToHoaSelect(e: any, hoa: any, index: number) {
        if (e.isUserInput) {
            // this.toDetailsArray.push(hoa);
            // this.toFormArray_as_FormGroup(index).controls['reAppropriationAmount'].reset();
            // this.toFormArray_as_FormGroup(index).controls['revisedBalance'].reset();
            // this.toFormArray_as_FormGroup(index).patchValue({budget: hoa.ceilingAmount, currentBalance : hoa.ceilingAmount - hoa.provisionalReleasedAmount});
        }
    }

    calToRevisedBalance(to: any) {
        this.isReAppropriatedAmountValidated = false;
        to.patchValue({
            revisedBalance: to.value.currentBalance + to.value.reAppropriationAmount,
        });
    }

    get totalReAppropriatedAmount() {
        let s: number = 0;
        this.toFormArray.value.forEach((elm: any) => {
            s = s + elm.reAppropriationAmount;
        });
        return s;
    }

    toSaveNext() {
        this.toFormArray.value.forEach((element: any) => {
            if (element.reAppropriationAmount !== '' && element.reAppropriationAmount % 1000 === 0) {
                this.isReAppropriatedAmountValidated = true;
            } else {
                this.isReAppropriatedAmountValidated = false;
            }
        });

        if (!this.isReAppropriatedAmountValidated) {
            this.notify.alert('Please enter the amount in multiple of 1000');
        } else {
            if (this.totalDeductAmount !== this.totalReAppropriatedAmount) {
                this.notify.alert('Total Amount for Reappropriation is not equal to Total Deducted Amount');
            } else {
                this.nextAccordionStep();
            }
        }
    }

    validateDeductionAmt(from: any) {
        if (from.value.deductAmount !== '' && from.value.deductAmount % 1000 === 0) {
            this.isDeductAmountValidated = true;
        } else {
            this.notify.alert('Please enter the amount in multiple of 1000');
        }
    }

    validateReAppropriateAmt(to: any) {
        if (to.value.reAppropriationAmount !== '' && to.value.reAppropriationAmount % 1000 === 0) {
            this.isReAppropriatedAmountValidated = true;
        } else {
            this.notify.alert('Please enter the amount in multiple of 1000');
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    onReAppropriationIdSelect(e: any, reAppropriationData: any) {
        if (e.isUserInput) {
            this.isReAppropriationIdSelected = true;
            this.selectedReAppropriationData = reAppropriationData;
            this.reAppropriationForm.patchValue({
                deductAmount: reAppropriationData.reappropriationAmount,
                reappropriateAmount: reAppropriationData.reappropriationAmount,
            });
        }
    }

    bindModifiableData() {
        this.reAppropriationForm.markAllAsTouched();
        if (this.isReAppropriationIdSelected) {
            this.fromStruct.patchValue({
                hoa: this.selectedReAppropriationData.fromDemandNo + '-' + this.selectedReAppropriationData.fromMajorHead + '-' + this.selectedReAppropriationData.fromSubmajorHead + '-' + this.selectedReAppropriationData.fromMinorHead + '-' + this.selectedReAppropriationData.fromSchemeHead + '-' + this.selectedReAppropriationData.fromDetailHead + '-' + this.selectedReAppropriationData.fromSubdetailHead + '-' + this.selectedReAppropriationData.fromVotedCharged,
                budget: this.selectedReAppropriationData.fromBudgetAllotedAmount,
                currentBalance: this.selectedReAppropriationData.fromBalanceCeilingAmount,
                deductAmount: this.selectedReAppropriationData.reappropriationAmount,
                revisedBalance: this.selectedReAppropriationData.fromBalanceCeilingAmount - this.selectedReAppropriationData.reappropriationAmount,
            });

            this.toStruct.patchValue({
                hoa: this.selectedReAppropriationData.toDemandNo + '-' + this.selectedReAppropriationData.toMajorHead + '-' + this.selectedReAppropriationData.toSubmajorHead + '-' + this.selectedReAppropriationData.toMinorHead + '-' + this.selectedReAppropriationData.toSchemeHead + '-' + this.selectedReAppropriationData.toDetailHead + '-' + this.selectedReAppropriationData.toSubdetailHead + '-' + this.selectedReAppropriationData.toVotedCharged,
                budget: this.selectedReAppropriationData.toBudgetAllotedAmount,
                currentBalance: this.selectedReAppropriationData.toBalanceCeilingAmount,
                reAppropriationAmount: this.selectedReAppropriationData.reappropriationAmount,
                revisedBalance: this.selectedReAppropriationData.toBalanceCeilingAmount + this.selectedReAppropriationData.reappropriationAmount,
            });

            this.reAppropriationForm.patchValue({
                remarks: this.selectedReAppropriationData.remarks,
                selfCertification: this.selectedReAppropriationData.reappropriationId,
            });
            this.nextAccordionStep();
        } else {
            this.notify.alert('Please select the Re Appropriation Id first ..!');
        }
    }

    submitForModify() {
        let obj = {
            reappropriationId: this.selectedReAppropriationData.reappropriationId,
            fromAllotmentId: this.selectedReAppropriationData.fromAllotmentId,
            toAllotmentId: this.selectedReAppropriationData.toAllotmentId,
            reappropriationAmount: this.totalReAppropriatedAmount,
        };
        this.reAppropriateModifyPayload.push(obj);
        this.commonService.submitReAppropriationDataForModify(this.reAppropriateModifyPayload).subscribe((resp) => {
            // console.log(resp);
        });
        this.nextAccordionStep();
    }
}
