import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor() {}

    toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        customClass: 'swal-wide',
        // onOpen: (tst) => {
        //   tst.addEventListener('mouseenter', swal.stopTimer);
        //   tst.addEventListener('mouseleave', swal.resumeTimer);
        // }
    });

    // *******************************************************************************************************
    successToast(succMsg: string) {
        this.toast.fire({
            icon: 'success',
            title: succMsg,
        });
    }

    // *******************************************************************************************************
    alertToast(alertMg: string) {
        this.toast.fire({
            icon: 'info',
            title: alertMg,
        });
    }

    // *******************************************************************************************************
    infoToast(infoMsg: string) {
        this.toast.fire({
            // title: 'Information !!!',
            icon: 'info',
            html: infoMsg,
        });
    }

    // *******************************************************************************************************
    errorToast(errMsg: string) {
        this.toast.fire({
            icon: 'error',
            title: errMsg,
        });
    }

    // *******************************************************************************************************
    warningToast(warnMsg: string) {
        this.toast.fire({
            icon: 'warning',
            title: warnMsg,
        });
    }

    // ----------------------------------------------------------------------------------- TOATSER ALERTS ENDS

    // ---------------------------------------------------------------------------- NORMAL SWEET ALERTS STARTS
    // *******************************************************************************************************
    success(msg: string) {
        swal.fire({ icon: 'success', title: 'Success', html: msg });
    }

    successful(msg: string) {
        return swal
            .fire({
                title: 'Success',
                icon: 'success',
                html: msg,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
            .then((result) => {
                return result.value === true ? true : false;
            });
    }

    // *******************************************************************************************************
    error(errMsg: string) {
        swal.fire({ icon: 'error', title: 'Error', html: errMsg });
    }

    // *******************************************************************************************************
    alert(alertMsg: string) {
        swal.fire({
            icon: 'warning',
            title: 'Alert !!!',
            html: alertMsg,
            customClass: {
                confirmButton: 'mat-focus-indicator mat-raised-button mat-button-base mat-primary mat-elevation-z3',
            },
        });
    }

    // *******************************************************************************************************
    notification(msg: string) {
        swal.fire({ icon: 'info', title: 'Information !!!', html: msg });
    }

    // *******************************************************************************************************
    infoCustom(customMsg: string) {
        swal.fire({
            title: 'Information !!!',
            icon: 'info',
            html: customMsg,
        });
    }

    // *******************************************************************************************************
    confirm(): Promise<any> {
        return swal
            .fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            })
            .then((result) => {
                return result.value === true ? true : false;
            });
    }

    // *******************************************************************************************************
    confirmProposal(Title: any, Text: any = '') {
        return swal
            .fire({
                title: Title,
                text: Text,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
            })
            .then((result) => {
                return result.value === true ? true : false;
            });
    }

    confirmEntryProposal(Title: any, Text: any = '') {
        return swal
            .fire({
                position: 'top',
                width: '400px',
                title: Title,
                text: Text,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
            })
            .then((result) => {
                return result.value === true ? true : false;
            });
    }
}
