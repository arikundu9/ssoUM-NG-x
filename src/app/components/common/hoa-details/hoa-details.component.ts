import { filter } from 'rxjs/operators';
import { CommonService } from '@S/common.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@S/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-hoa-details',
    templateUrl: './hoa-details.component.html',
    styleUrls: ['./hoa-details.component.css'],
})
export class HoaDetailsComponent implements OnInit {
    @Output() onEnteringHoaDetails = new EventEmitter<any>();

    demandCodeList: any;
    copyDemandCodeList: any;
    demandCode: any;
    majorHeadList: any;
    copyMajorHeadList: any;
    majorHead: any;
    subMajorHeadList: any;
    copySubMajorHeadList: any;
    subMajorHead: any;
    minorHeadList: any;
    copyMinorHeadList: any;
    minorHead: any;
    subHeadList: any;
    copySubHeadList: any;
    subHead: any;
    detailHeadList: any;
    copyDetailHeadList: any;
    mainForm!: FormGroup;
    copySubDetailHeadList: any[] = [];
    subDetailHeadList: any[] = [];
    votedCharged: any[] = ['V', 'C'];

    constructor(private fb: FormBuilder, private commonService: CommonService, private notify: NotificationService, public router: Router) {}

    ngOnInit(): void {
        this.mainForm = this.fb.group({
            demand: ['', Validators.required],
            major_head: ['', Validators.required],
            sub_major_head: ['', Validators.required],
            minor_head: ['', Validators.required],
            sub_head: ['', Validators.required],
            detailed_head: ['', Validators.required],
            subDetailHead: [, [Validators.required]],
            planStatus: [, [Validators.required]],
            votedCharged: [, [Validators.required]],
        });
        this.getDepartments();
    }

    getDepartments() {
        this.commonService.getDemandData().subscribe((res) => {
            this.demandCodeList = this.copyDemandCodeList = res;
            if (this.demandCodeList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchDemand(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.demandCodeList = this.copyDemandCodeList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.demandCode.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.demandCodeList = this.copyDemandCodeList;
            }
        }
    }

    onDemandSelect(e: any, demandId: string) {
        if (e.isUserInput) {
            this.demandCode = demandId;
        }
    }

    getMajorHead() {
        this.commonService.getMajorHead(this.demandCode).subscribe((res) => {
            this.majorHeadList = this.copyMajorHeadList = res;
            if (this.majorHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchMajorHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.majorHeadList = this.copyMajorHeadList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code?.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.majorHeadList = this.copyMajorHeadList;
            }
        }
    }

    onMajorHeadSelect(e: any, majorHeadId: any) {
        if (e.isUserInput) {
            this.majorHead = majorHeadId;
        }
    }

    getSubMajorHead() {
        this.commonService.getSubMajorHead(this.majorHead).subscribe((res) => {
            this.subMajorHeadList = this.copySubMajorHeadList = res;
            if (this.subMajorHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchSubMajorHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.subMajorHeadList = this.copySubMajorHeadList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.subMajorHeadList = this.copySubMajorHeadList;
            }
        }
    }

    onSubmajorHeadSelect(e: any, subMajorHeadId: number) {
        if (e.isUserInput) {
            this.subMajorHead = subMajorHeadId;
        }
    }

    getMinorHead() {
        this.commonService.getMinorHead(this.subMajorHead).subscribe((res) => {
            this.minorHeadList = this.copyMinorHeadList = res;
            if (this.minorHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchMinorHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.minorHeadList = this.copyMinorHeadList?.filter((data: any) => {
                        return data.code?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.name.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.minorHeadList = this.copyMinorHeadList;
            }
        }
    }

    onMinorHeadSelect(e: any, minorHeadId: number) {
        if (e.isUserInput) {
            this.minorHead = minorHeadId;
        }
    }

    getSchemeHead() {
        this.commonService.getSchemeHead(this.minorHead, this.demandCode).subscribe((res) => {
            this.subHeadList = this.copySubHeadList = res;
            if (this.subHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchSchemeHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.subHeadList = this.copySubHeadList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.subHeadList = this.copySubHeadList;
            }
        }
    }

    onSchemeHeadSelect(e: any, subHeadId: any) {
        if (e.isUserInput) {
            this.subHead = subHeadId;
        }
    }

    getDetailHead() {
        this.commonService.getDetailHead().subscribe((res) => {
            this.detailHeadList = this.copyDetailHeadList = res;
            if (this.detailHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchDetailHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.detailHeadList = this.copyDetailHeadList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.detailHeadList = this.copyDetailHeadList;
            }
        }
    }

    readingEntireHoa() {
        if (this.router.url === '/WbBudgetRequisitionEntry' || this.router.url === '/wbBudgetCreateAutoAllotment') {
            this.onEnteringHoaDetails.emit(this.mainForm.value);
        }
    }

    search() {
        this.onEnteringHoaDetails.emit(this.mainForm.value);
    }

    getSubDetailHead() {
        this.commonService.getSubDetailHead().subscribe((res) => {
            this.subDetailHeadList = this.copySubDetailHeadList = res;
            if (this.subDetailHeadList.length === 0) {
                this.notify.alert('No value available for the selected combination');
            }
        });
    }

    searchSubDetailHead(e: any) {
        if (e !== undefined) {
            let term = '';
            if (e.target.value.length > 0) {
                term = e.target.value;
            }
            if (term !== undefined && term !== '' && term != null) {
                if (term.length > 0) {
                    this.subDetailHeadList = this.copySubDetailHeadList?.filter((data: any) => {
                        return data.name?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.code.toLowerCase().indexOf(term.toLowerCase()) >= 0;
                    });
                }
            } else {
                this.subDetailHeadList = this.copySubDetailHeadList;
            }
        }
    }

    // getDemands() {
    //     this.spinner.show();
    //     const demandsParams = Object.assign({
    //         hodMstId: +this.authService.curtUsrHODMstId,
    //         brchMstId: 0,
    //         roleMstId: !Array.isArray(this.authService.currentUserRole) ? +this.authService.currentUserRole : +this.authService.currentUserRole[0],
    //         profileId: +this.authService.curtUsrProfileId,
    //         status: true,
    //     });
    //     console.log('✨' + 'Calling: gdemands');
    //     this.commonService.getAll(this.commonService.sharedBaseUrl + 'gdemands', demandsParams).subscribe(
    //         (res) => {
    //             if (res.success) {
    //                 console.log('✔' + 'call successfull: gdemands');
    //                 this.demandCodeList = res.data;
    //                 this.spinner.hide();
    //             } else {
    //                 this.spinner.hide();
    //                 this.notify.error(res.msg);
    //             }
    //         },
    //         (err) => {
    //             this.spinner.hide();
    //             this.notify.error(err.msg);
    //         }
    //     );
    // }

    // getMajorHead() {
    //     this.spinner.show();
    //     const mjrHeadParams = Object.assign({
    //         demandMstId: +'1' + this.demandCode,
    //         hodMstId: +this.authService.curtUsrHODMstId,
    //         status: true,
    //         mjrCatId: 0,
    //     });
    //     console.log(mjrHeadParams);

    //     this.commonService.getAll(this.commonService.sharedBaseUrl + 'GetMajorHeads', mjrHeadParams).subscribe(
    //         (res) => {
    //             if (res.success) {
    //                 this.majorHeadList = res.data;
    //                 this.spinner.hide();
    //                 if (this.majorHeadList.length === 0) {
    //                     this.notify.alert('No value available for the selected combination');
    //                 }
    //             } else {
    //                 this.spinner.hide();
    //                 this.notify.error(res.msg);
    //             }
    //         },
    //         (err) => {
    //             this.spinner.hide();
    //             this.notify.error(err.msg);
    //         }
    //     );
    // }

    // getSubMajorHead() {
    //     this.spinner.show();
    //     const subMjrHeadParams = Object.assign({ mjrHdMstId: +'1' + this.demandCode + this.majorHead, subMjrHdMstId: 0, status: true });
    //     this.commonService.getAll(this.commonService.subMjrHeadBaseUrl + 'GetSubMjrHead', subMjrHeadParams).subscribe(
    //         (res) => {
    //             if (res.success) {
    //                 this.subMajorHeadList = res.allRows;
    //                 this.spinner.hide();
    //                 if (this.subMajorHeadList.length === 0) {
    //                     this.notify.alert('No value available for the selected combination');
    //                 }
    //             } else {
    //                 this.spinner.hide();
    //                 this.notify.error(res.msg);
    //             }
    //         },
    //         (err) => {
    //             this.spinner.hide();
    //             this.notify.error(err.msg);
    //         }
    //     );
    // }

    // onSubmajorHeadSelect(e: any, subMajorheadId: string) {
    //     if (e.isUserInput) {
    //         this.subMajorHead = subMajorheadId;
    //     }
    // }

    // getMinorHead() {
    //     const minorHeadParams = Object.assign({ subMjrHdMstId: +'1' + this.demandCode + this.majorHead + this.subMajorHead, minorHdMstId: 0, status: true });
    //     this.commonService.getAll(this.commonService.minorHeadBaseUrl + 'GetMinorHead', minorHeadParams).subscribe(
    //         (res) => {
    //             if (res.success) {
    //                 this.minorHeadList = res.allRows;
    //                 this.spinner.hide();
    //                 if (this.minorHeadList.length === 0) {
    //                     this.notify.alert('No value available for the selected combination');
    //                 }
    //             } else {
    //                 this.spinner.hide();
    //                 this.notify.error(res.msg);
    //             }
    //         },
    //         (err) => {
    //             this.spinner.hide();
    //             this.notify.error(err.msg);
    //         }
    //     );
    // }

    // onMinorHeadSelect(e: any, minorHeadId: string) {
    //     if (e.isUserInput) {
    //         this.minorHead = minorHeadId;
    //     }
    // }

    // getSubHead() {
    //     const params = Object.assign({ minorHdMstId: +('1' + (this.demandCode + this.majorHead + this.subMajorHead + this.minorHead)), subHdMstId: 0, status: true });
    //     this.commonService.getAll(this.commonService.subDetailHeadBaseUrl + 'GetSubHead', params).subscribe(
    //         (res) => {
    //             if (res.success) {
    //                 this.subHeadList = res.data;
    //                 this.spinner.hide();
    //                 if (this.subHeadList.length === 0) {
    //                     this.notify.alert('No value available for the selected combination');
    //                 }
    //             } else {
    //                 this.spinner.hide();
    //                 this.notify.error(res.msg);
    //             }
    //         },
    //         (err) => {
    //             this.spinner.hide();
    //             this.notify.error(err.msg);
    //         }
    //     );
    // }

    // onSubHeadSelect(e: any, subHeadId: any) {
    //     if (e.isUserInput) {
    //         this.subHead = subHeadId;
    //     }
    // }

    // getDetailHead() {
    //     const params = Object.assign({ subHdMstId: +('1' + (this.demandCode + this.majorHead + this.subMajorHead + this.minorHead + this.subHead)), dtldHdMstId: 0, status: true });
    //     this.commonService.getAll(this.commonService.subDetailHeadBaseUrl + 'GetDetailHead', params).subscribe(
    //         (res) => {
    //             if (res.success) {
    //                 this.detailHeadList = res.data;
    //                 this.spinner.hide();
    //                 if (this.detailHeadList.length === 0) {
    //                     this.notify.alert('No value available for the selected combination');
    //                 }
    //             } else {
    //                 this.spinner.hide();
    //                 this.notify.error(res.msg);
    //             }
    //         },
    //         (err) => {
    //             this.spinner.hide();
    //             this.notify.error(err.msg);
    //         }
    //     );
    // }

    // searchDemand(e: any) {
    //     if (e !== undefined) {
    //         let term = '';
    //         if (e.target.value.length > 0) {
    //             term = e.target.value;
    //         }
    //         if (term !== undefined && term !== '' && term != null) {
    //             if (term.length > 0) {
    //                 this.demandCodeList = this.copyDemandCodeList?.filter((data: any) => {
    //                     return data.demanD_DESC?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.demanD_CODE.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    //                 });
    //                 const exists: boolean = this.demandCodeList?.length > 0;
    //                 if (exists) {
    //                     this.mainForm.controls.demand.clearValidators();
    //                     this.mainForm.controls.demand.updateValueAndValidity();
    //                 } else {
    //                     this.mainForm.controls.demand.setErrors({ erArisesDC: true });
    //                 }
    //             }
    //         } else {
    //             this.demandCodeList = this.copyDemandCodeList;
    //         }
    //     }
    // }

    // searchMajorHead(e: any) {
    //     if (e !== undefined) {
    //         let term = '';
    //         if (e.target.value.length > 0) {
    //             term = e.target.value;
    //         }
    //         if (term !== undefined && term !== '' && term != null) {
    //             if (term.length > 0) {
    //                 this.majorHeadList = this.copyMajorHeadList?.filter((data: any) => {
    //                     return data.majorhD_DESC?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.majorhD_CODE.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    //                 });
    //                 const exists: boolean = this.majorHeadList?.length > 0;
    //                 if (exists) {
    //                     this.mainForm.controls.major_head.clearValidators();
    //                     this.mainForm.controls.major_head.updateValueAndValidity();
    //                 } else {
    //                     this.mainForm.controls.major_head.setErrors({ erArisesDC: true });
    //                 }
    //             }
    //         } else {
    //             this.majorHeadList = this.copyMajorHeadList;
    //         }
    //     }
    // }

    // searchSubMajorHead(e: any) {
    //     if (e !== undefined) {
    //         let term = '';
    //         if (e.target.value.length > 0) {
    //             term = e.target.value;
    //         }
    //         if (term !== undefined && term !== '' && term != null) {
    //             if (term.length > 0) {
    //                 this.subMajorHeadList = this.copySubMajorHeadList?.filter((data: any) => {
    //                     return data.submajorhD_DESC?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.submajorhD_CODE.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    //                 });
    //                 const exists: boolean = this.subMajorHeadList?.length > 0;
    //                 if (exists) {
    //                     this.mainForm.controls.sub_major_head.clearValidators();
    //                     this.mainForm.controls.sub_major_head.updateValueAndValidity();
    //                 } else {
    //                     this.mainForm.controls.sub_major_head.setErrors({ erArisesDC: true });
    //                 }
    //             }
    //         } else {
    //             this.subMajorHeadList = this.copySubMajorHeadList;
    //         }
    //     }
    // }

    // searchMinorHead(e: any) {
    //     if (e !== undefined) {
    //         let term = '';
    //         if (e.target.value.length > 0) {
    //             term = e.target.value;
    //         }
    //         if (term !== undefined && term !== '' && term != null) {
    //             if (term.length > 0) {
    //                 this.minorHeadList = this.copyMinorHeadList?.filter((data: any) => {
    //                     return data.minorhD_DESC?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.minorhD_CODE.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    //                 });
    //                 const exists: boolean = this.minorHeadList?.length > 0;
    //                 if (exists) {
    //                     this.mainForm.controls.minor_head.clearValidators();
    //                     this.mainForm.controls.minor_head.updateValueAndValidity();
    //                 } else {
    //                     this.mainForm.controls.minor_head.setErrors({ erArisesDC: true });
    //                 }
    //             }
    //         } else {
    //             this.minorHeadList = this.copyMinorHeadList;
    //         }
    //     }
    // }

    // searchSubHead(e: any) {
    //     if (e !== undefined) {
    //         let term = '';
    //         if (e.target.value.length > 0) {
    //             term = e.target.value;
    //         }
    //         if (term !== undefined && term !== '' && term != null) {
    //             if (term.length > 0) {
    //                 this.subHeadList = this.copySubHeadList?.filter((data: any) => {
    //                     return data.subhD_DESC?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.subhD_CODE.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    //                 });
    //                 const exists: boolean = this.subHeadList?.length > 0;
    //                 if (exists) {
    //                     this.mainForm.controls.sub_head.clearValidators();
    //                     this.mainForm.controls.sub_head.updateValueAndValidity();
    //                 } else {
    //                     this.mainForm.controls.sub_head.setErrors({ erArisesDC: true });
    //                 }
    //             }
    //         } else {
    //             this.subHeadList = this.copySubHeadList;
    //         }
    //     }
    // }

    // searchDetailHead(e: any) {
    //     if (e !== undefined) {
    //         let term = '';
    //         if (e.target.value.length > 0) {
    //             term = e.target.value;
    //         }
    //         if (term !== undefined && term !== '' && term != null) {
    //             if (term.length > 0) {
    //                 this.detailHeadList = this.copyDetailHeadList?.filter((data: any) => {
    //                     return data.detailhD_DESC?.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data.detailhD_CODE.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    //                 });
    //                 const exists: boolean = this.detailHeadList?.length > 0;
    //                 if (exists) {
    //                     this.mainForm.controls.detailed_head.clearValidators();
    //                     this.mainForm.controls.detailed_head.updateValueAndValidity();
    //                 } else {
    //                     this.mainForm.controls.detailed_head.setErrors({ erArisesDC: true });
    //                 }
    //             }
    //         } else {
    //             this.detailHeadList = this.copyDetailHeadList;
    //         }
    //     }
    // }

    // readingEntireHoa() {
    //     console.log(this.mainForm.value.sub_head);
    //     if (
    //         this.mainForm.value.demand != '' &&
    //         this.mainForm.value.major_head != '' &&
    //         this.mainForm.value.sub_major_head != '' &&
    //         this.mainForm.value.minor_head != '' &&
    //         this.mainForm.value.sub_head != '' &&
    //         this.mainForm.value.detailed_head != ''
    //     ) {
    //         this.onHoaSelect.emit({
    //             demand: this.mainForm.value.demand,
    //             major_head: this.mainForm.value.major_head,
    //             sub_major_head: this.mainForm.value.sub_major_head,
    //             minor_head: this.mainForm.value.minor_head,
    //             sub_head: this.mainForm.value.sub_head,
    //             detailed_head: this.mainForm.value.detailed_head,
    //         });
    //     } else {
    //     }
    // }
}
