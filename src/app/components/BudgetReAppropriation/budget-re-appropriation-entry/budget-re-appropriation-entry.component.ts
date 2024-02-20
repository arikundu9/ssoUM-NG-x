import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { ValidationService } from '@S/validation.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-budget-re-appropriation-entry',
    templateUrl: './budget-re-appropriation-entry.component.html',
    styleUrls: ['./budget-re-appropriation-entry.component.css'],
})
export class BudgetReAppropriationEntryComponent implements OnInit {
    accordionStep = 0;
    fromStruct: any;
    // fromDetailsArray: any[] = [];
    // toDetailsArray: any[] = [];

    public formTitle = 'Budget Re Appropriation Entry';
    fromReAppropriateData: any[] = [];
    toReAppropriateData: any[] = [];
    hoa: any;
    toHoa: any;
    jsonArray: any[] = [];
    reAppropriatePaload: any[] = [];
    isDeductAmountValidated: boolean = false;
    isReAppropriatedAmountValidated: boolean = false;
    isHoaSelected: boolean = false;
    isToHoaSelected: boolean = false;
    isFromSaveClicked: boolean = false;
    isToSaveClicked: boolean = false;

    reAppropriationForm!: FormGroup;
    constructor(private fb: FormBuilder, private commonService: CommonService, private notify: NotificationService, private validatorService: ValidationService) {}

    ngOnInit(): void {
        this.reAppropriationForm = this.fb.group({
            financialYear: [''],
            department: [''],
            approvingAuthority: [''],
            fileNumber: [''],
            uoNumber: [''],
            date: [''],
            id: this.validatorService.validation('Disable', 0, 100, ''),
            deductAmount: this.validatorService.validation('Disable', 0, 100, ''),
            reappropriateAmount: this.validatorService.validation('Disable', 0, 100, ''),

            //form array
            fromFormArrayC: this.fb.array([]),
            toFormArrayC: this.fb.array([]),

            // Note/remarks 'FROM' controls
            hoaFrom: [''],
            budgetFrom: [''],
            curBalFrom: [''],
            dedAmntFrom: [''],
            revBalFrom: [''],

            // Note/remarks 'TO' controls
            hoaTo: [''],
            budgetTo: [''],
            curBalTo: [''],
            reAppAmntTo: [''],
            revBalTo: [''],

            selfCertification: [''],
            remarks: [''],
        });
        this.addfromController();
        this.addtoController();
        this.commonService.getFromHoaReAppropriateData().subscribe((resp: any) => {
            this.fromReAppropriateData = resp;
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
            hoa: ['', Validators.required],
            budget: this.validatorService.validation('Disable', 0, 100, ''),
            currentBalance: this.validatorService.validation('Disable', 0, 100, ''),
            deductAmount: this.validatorService.validation('Disable', 0, 100, ''),
            revisedBalance: this.validatorService.validation('Disable', 0, 100, ''),
        });
        this.fromFormArray.push(this.fromStruct);
    }

    deletefromController(i: number) {
        this.fromFormArray.removeAt(i);
        // this.fromDetailsArray.splice(i, 1);
    }

    get toFormArray(): FormArray {
        return this.reAppropriationForm.controls['toFormArrayC'] as FormArray;
    }

    toFormArray_as_FormGroup(i: any): FormGroup {
        const formGroup = this.toFormArray.controls[i] as FormGroup;
        return formGroup;
    }

    addtoController() {
        const toStruct = this.fb.group({
            hoa: ['', Validators.required],
            budget: this.validatorService.validation('Disable', 0, 100, ''),
            currentBalance: this.validatorService.validation('Disable', 0, 100, ''),
            reAppropriationAmount: this.validatorService.validation('Disable', 0, 100, ''),
            revisedBalance: this.validatorService.validation('Disable', 0, 100, ''),
        });
        this.toFormArray.push(toStruct);
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
            this.isHoaSelected = true;
            // this.fromDetailsArray.push(hoa);
            this.fromsFormArray_as_FormGroup(index).controls['deductAmount'].reset();
            this.fromsFormArray_as_FormGroup(index).controls['revisedBalance'].reset();
            this.fromsFormArray_as_FormGroup(index).patchValue({ budget: hoa.ceilingAmount, currentBalance: hoa.ceilingAmount - hoa.provisionalReleasedAmount });
            this.fromsFormArray_as_FormGroup(index).controls['deductAmount'].enable();
        }
    }

    get totalDeductAmount() {
        let s: number = 0;
        this.fromFormArray.value.forEach((elm: any) => {
            if (elm.deductAmount) {
                s = s + elm.deductAmount;
            }
        });
        return s;
    }

    fromDetailsSaveNext() {
        this.jsonArray = [];
        if (!this.isHoaSelected) {
            this.notify.alert('Please select any of the Head of Account atfirst..!');
        } else if (!this.isDeductAmountValidated) {
            this.notify.alert('Please enter the amount in multiple of 1000..!');
        } else {
            this.fromFormArray.getRawValue().forEach((elm, i) => {
                var parsedHoa = this.fromFormArray.value[i].hoa.split('-');
                let obj = {
                    demandNo: parsedHoa[0],
                    majorHead: parsedHoa[1],
                    submajorHead: parsedHoa[2],
                    minorHead: parsedHoa[3],
                    planStatus: parsedHoa[7],
                    schemeHead: parsedHoa[4],
                    detailHead: parsedHoa[5],
                    subdetailHead: parsedHoa[6],
                    votedCharged: parsedHoa[8],
                };
                this.jsonArray.push(obj);
            });
            this.commonService.getToHoaReAppropriateData(this.jsonArray).subscribe((resp: any) => {
                this.toReAppropriateData = resp;
            });
            this.nextAccordionStep();
            this.isFromSaveClicked = true;
        }
    }

    onToHoaSelect(e: any, hoa: any, index: number) {
        if (e.isUserInput) {
            this.isToHoaSelected = true;
            // this.toDetailsArray.push(hoa);
            this.toFormArray_as_FormGroup(index).controls['reAppropriationAmount'].reset();
            this.toFormArray_as_FormGroup(index).controls['revisedBalance'].reset();
            this.toFormArray_as_FormGroup(index).patchValue({ budget: hoa.ceilingAmount, currentBalance: hoa.ceilingAmount - hoa.provisionalReleasedAmount });
            this.toFormArray_as_FormGroup(index).controls['reAppropriationAmount'].enable();
        }
    }

    get totalReAppropriatedAmount() {
        let s: number = 0;
        this.toFormArray.value.forEach((elm: any) => {
            if (elm.reAppropriationAmount) {
                s = s + elm.reAppropriationAmount;
            }
        });
        return s;
    }

    toSaveNext() {
        if (!this.isToHoaSelected) {
            this.notify.alert('Please select any of the Head of Account atfirst..!');
        } else if (!this.isReAppropriatedAmountValidated) {
            this.notify.alert('Please enter the amount in multiple of 1000..!');
        } else {
            if (this.totalDeductAmount !== this.totalReAppropriatedAmount) {
                this.notify.alert('Total Amount for Reappropriation is not equal to Total Deducted Amount');
            } else {
                this.nextAccordionStep();
                this.isToSaveClicked = true;
            }
        }
        console.log(this.fromFormArray);
    }

    submitReAppropriation() {
        var fromList = [];
        var toList = [];
        if (!this.reAppropriationForm.valid) {
            this.notify.alert('Please check all the fields carefully...!');
        } else {
            for (let i = 0; i < this.fromFormArray.value.length; i++) {
                // let obj = {
                //     reappropriationId: null,
                //     fromAllotmentId: this.fromDetailsArray[i].allotmentId,
                //     toAllotmentId: this.toDetailsArray[i].allotmentId,
                //     reappropriationAmount: this.totalReAppropriatedAmount,
                //     remarks: this.reAppropriationForm.value.remarks,
                // };
                var parsedhoa = this.fromFormArray.value[i].hoa.split('-');
                let fromObj = {
                    deptCode: 'ST',
                    demandNo: parsedhoa[0],
                    majorHead: parsedhoa[1],
                    submajorHead: parsedhoa[2],
                    minorHead: parsedhoa[3],
                    planStatus: parsedhoa[7],
                    schemeHead: parsedhoa[4],
                    detailHead: parsedhoa[5],
                    subdetailHead: parsedhoa[6],
                    votedCharged: parsedhoa[8],
                    amount: this.fromFormArray.value[i].deductAmount,
                };
                fromList.push(fromObj);
            }
            for (let i = 0; i < this.toFormArray.value.length; i++) {
                var parsedhoa = this.toFormArray.value[i].hoa.split('-');
                let toObj = {
                    deptCode: 'ST',
                    demandNo: parsedhoa[0],
                    majorHead: parsedhoa[1],
                    submajorHead: parsedhoa[2],
                    minorHead: parsedhoa[3],
                    planStatus: parsedhoa[7],
                    schemeHead: parsedhoa[4],
                    detailHead: parsedhoa[5],
                    subdetailHead: parsedhoa[6],
                    votedCharged: parsedhoa[8],
                    amount: this.toFormArray.value[i].reAppropriationAmount,
                };
                toList.push(toObj);
            }

            let payload = {
                fromHoas: fromList,
                toHoas: toList,
                remarks: this.reAppropriationForm.value.remarks,
            };

            this.commonService.submitReAppropriationData(payload).subscribe((resp) => {
                // this.notify.success('Record Successfully Saved with Re-appropriation ID : ' + resp);
                this.reAppropriationForm.patchValue({ selfCertification: resp });
                this.nextAccordionStep();
            });
        }
    }

    validateDeductionAmt(from: any, i: number) {
        this.isDeductAmountValidated = false;
        if (from.value.deductAmount !== '' && from.value.deductAmount % 1000 === 0) {
            if (from.getRawValue().currentBalance >= from.value.deductAmount) {
                this.isDeductAmountValidated = true;
                this.reAppropriationForm.patchValue({ deductAmount: this.totalDeductAmount });
                from.patchValue({ revisedBalance: from.getRawValue().currentBalance - from.value.deductAmount });
            } else {
                this.notify.alert('Deduct amount cannot be greater than Current Balance..!');
                this.fromsFormArray_as_FormGroup(i).controls['deductAmount'].reset();
            }
        } else {
            this.notify.alert('Please enter the amount in multiple of 1000..!');
            this.fromsFormArray_as_FormGroup(i).controls['deductAmount'].reset();
        }
    }

    validateReAppropriateAmt(to: any, i: number) {
        this.isReAppropriatedAmountValidated = false;
        if (to.value.reAppropriationAmount !== '' && to.value.reAppropriationAmount % 1000 === 0) {
            // if (to.getRawValue().currentBalance >= to.value.reAppropriationAmount) {
            //     this.isReAppropriatedAmountValidated = true;
            //     this.reAppropriationForm.patchValue({ reappropriateAmount: this.totalReAppropriatedAmount });
            //     to.patchValue({ revisedBalance: to.getRawValue().currentBalance + to.value.reAppropriationAmount });
            // } else {
            //     this.notify.alert('Re-Appropriate amount cannot be greater than Current Balance..!');
            //     this.toFormArray_as_FormGroup(i).controls['reAppropriationAmount'].reset();
            // }
            this.isReAppropriatedAmountValidated = true;
            this.reAppropriationForm.patchValue({ reappropriateAmount: this.totalReAppropriatedAmount });
            to.patchValue({ revisedBalance: to.getRawValue().currentBalance + to.value.reAppropriationAmount });
        } else {
            this.notify.alert('Please enter the amount in multiple of 1000..!');
            this.toFormArray_as_FormGroup(i).controls['reAppropriationAmount'].reset();
        }
    }

    get fromHoaCount(): number {
        let sum = 0;
        this.fromFormArray.value.forEach((element: any) => {
            if (element.hoa != '') {
                sum++;
            }
        });
        return sum;
    }

    get toHoaCount(): number {
        let sum = 0;
        this.toFormArray.value.forEach((element: any) => {
            if (element.hoa != '') {
                sum++;
            }
        });
        return sum;
    }
}
