import { AbstractControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';

export class FromArrayHelper {
    private _fb: FormBuilder = new FormBuilder();
    constructor(private formArrayController: AbstractControl, private innerFormGroupStructure: {}) /*make this ctor more smart that it only accept FormArray, not FormControl*/ {}
    get innerArray(): FormArray {
        return this.formArrayController as FormArray;
    }
    fromGroupAt(index: number): FormGroup {
        return this.innerArray.controls[index] as FormGroup;
    }
    addControl() {
        this.innerArray.push(this._fb.group(this.innerFormGroupStructure));
    }
    deleteControlAt(index: number) {
        this.innerArray.removeAt(index);
    }
    get value(): any {
        return this.innerArray.value;
    }
    get controls(): AbstractControl[] {
        return this.innerArray.controls;
    }
    clear() {
        return this.innerArray.clear();
    }
    get valid() {
        return this.innerArray.valid;
    }
    //----other properties can be also added.
    // get aaa() {}
}
