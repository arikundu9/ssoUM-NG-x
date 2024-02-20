import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, Subject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, filter } from 'rxjs/operators';
import { authService } from './auth.service';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    bantanUrlwV = environment.bantanUrl + 'api/' + environment.version;
    bantanUrl = environment.bantanUrl + 'api/';
    iMasterUrl = environment.iMasterUrl + 'api/';
    saoCode = '';
    deptCode = '';
    demandCode = '';
    isHod: boolean;
    authorityCode: string;

    constructor(private http: HttpClient, private auth: authService, private notify: NotificationService, private toastr: ToastrService) {
        console.log(this.auth);
        // this.saoCode = this.auth.user.AC.substring(0, 4);
        // this.deptCode = this.auth.user.AC.substring(0, 2);
        // this.isHod = this.auth.user.LEVEL == 'HoD' ? true : false;
        // this.authorityCode = this.auth.user.AC;
        this.saoCode = this.auth.user.Levels[0].Scope[0].substring(0, 4);
        this.deptCode = this.auth.user.Levels[0].Scope[0].substring(0, 2);
        this.isHod = this.auth.user.Levels[0].Name == 'HOD' ? true : false;
        this.authorityCode = this.auth.user.Levels[0].Scope[0];
        this.getDemandData().subscribe((res) => {
            const fRes = res.filter((e: any) => e.code == this.deptCode);
            this.demandCode = fRes[0].id;
        });
    }

    post(payload: any, url: string): Observable<any> {
        return this.http.post<any>(this.bantanUrl + url, payload);
    }

    getData(url: string) {
        return this.http.get<any>(this.bantanUrl + url);
    }

    getDemandData() {
        return this.http.get<any>(this.bantanUrl + 'DepartmentsMaster');
    }

    getMajorHead(demandId: string) {
        return this.http.get<any>(this.bantanUrl + 'MajorHeadsMaster/' + 'GeMajorByDemand/' + demandId);
    }

    getSubMajorHead(majorHeadId: number) {
        return this.http.get<any>(this.bantanUrl + 'SubMajorHeadsMaster/' + 'SubMajorHeadByMajorHeadId/' + majorHeadId);
    }

    getMinorHead(subMajorHeadId: number) {
        return this.http.get<any>(this.bantanUrl + 'MinorHeadMaster/' + 'MinorHeadBySubMajorHead/' + subMajorHeadId);
    }

    getSchemeHead(minorHeadId: number, demandCode: string) {
        return this.http.get<any>(this.bantanUrl + 'SchemeHeadsMaster/' + 'SchemeHeadByMinorHeadId/' + minorHeadId + '/' + demandCode);
    }

    getDetailHead() {
        return this.http.get<any>(this.bantanUrl + 'DetailHeadsMaster/');
    }

    getSubDetailHead() {
        return this.http.get<any>(this.bantanUrl + 'SubDetailHeadsMaster/');
    }

    // getHodWalletData() {
    //     return this.http.get<any>(this.bantanUrlwV + '/WalletInformation/' + 'getHodWallet');
    // }

    getSaoHeirarchy() {
        return this.http.get<any>(this.bantanUrl + 'SaoLevelMaster/' + 'GetHierarchylevelsBySaoCode/' + this.saoCode);
    }

    getAllSao() {
        return this.http.get<any>(this.bantanUrl + 'saoMaster');
    }

    getSaoByHeirarchy(saoLevel: number) {
        return this.http.get<any>(this.bantanUrl + 'SaoMaster/' + 'GetSaosByHierarchyAndDeptCode/' + saoLevel + '/' + this.deptCode);
    }

    getAllTreasury() {
        return this.http.get<any>(this.bantanUrl + 'TreasuryMaster');
    }

    getDdoByTreasury(treasuryCode: any) {
        return this.http.get<any>(this.bantanUrl + 'DdoMaster/' + 'DdoByTreasury/' + treasuryCode);
    }

    getOwnDdo() {
        return this.http.get<any>(this.bantanUrl + 'Sao/OwnDdo/' + this.authorityCode);
    }

    // submitBudgetRelease(url: string, payload: any) {
    //     return this.http.post<any>(this.bantanUrlwV + '/' + url, payload);
    // }

    // getFreshAllotment(url: string) {
    //     return this.http.get<any>(this.bantanUrl + url);
    // }

    // approveTransaction(url: string, payload: any) {
    //     return this.http.post<any>(this.bantanUrl + url, payload);
    // }

    // getApprovedData(url: string) {
    //     return this.http.get<any>(this.bantanUrl + url);
    // }

    // sanctionTransaction(url: string, payload: any) {
    //     return this.http.post<any>(this.bantanUrl + url, payload);
    // }

    // modifyAllotments(url: string, payload: any) {
    //     return this.http.put<any>(this.bantanUrl + url, payload);
    // }

    // deleteTransactionsAfterApproval(url: string, payload: any) {
    //     return this.http.post<any>(this.bantanUrl + url, payload);
    // }

    getMyAllotments() {
        return this.http.get<any>(this.bantanUrl + 'Allotment' + '/MyAllotments').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getNewAllotments() {
        return this.http.get<any>(this.bantanUrl + 'Allotment' + '/New').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getNewAllotmentsForModify() {
        return this.http.get<any>(this.bantanUrl + 'Allotment' + '/getModificationData').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    submitRelease(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Allotment', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    approveAllotments(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Allotment' + '/Approve', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    getApprovedAllotments() {
        return this.http.get<any>(this.bantanUrl + 'Allotment' + '/Approved').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    sanctionAllotments(payload: string) {
        return this.http.put<any>(this.bantanUrl + 'Allotment' + '/Sanction', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.success(res.message + '..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    revertAllotments(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Allotment' + '/Revert', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((resp) => {
                        if (resp) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    modifyAllotment(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Allotment', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((resp) => {
                        if (resp) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    getAllotmentsForRevoke() {
        return this.http.get<any>(this.bantanUrl + 'Allotment' + '/Sanctioned').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    submitBudgetRevoke(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Allotment/WithdrawlTransaction', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((resp) => {
                        if (resp) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    getWithdrawalAllotments() {
        return this.http.get<any>(this.bantanUrl + 'Allotment/GetApprovedFromRevokedTransactions').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    draftSanctionAllotments(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Allotment' + '/DraftSanction', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.success(res.message + '..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    sanctionWithdrawalledAllotments(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Allotment/SanctionWithdrawal', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.success(res.message + '..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    getAllDraftedData() {
        return this.http.get<any>(this.bantanUrl + 'Allotment/getMemoForSanction').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    deleteAllotments(payload: any) {
        return this.http.request('delete', this.bantanUrl + 'Allotment', { body: payload }).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    // return res.result;
                    this.notify.successful(res.message + '..!').then((resp) => {
                        if (resp) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getAllSanctionedData() {
        return this.http.get<any>(this.bantanUrl + 'Allotment/getAllSanctionData').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getFromHoaReAppropriateData() {
        return this.http.get<any>(this.bantanUrl + 'Wallet').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getToHoaReAppropriateData(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Allotment/toHoaReappropriation', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    // this.notify.success(res.message+'..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    submitReAppropriationData(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Allotment/ReappropriationTransactionDraft_new', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    // this.notify.success(res.message+'..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getReAppropriationDataForModify() {
        return this.http.get<any>(this.bantanUrl + 'Allotment/getReappropriationForModifyData').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    submitReAppropriationDataForModify(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Allotment/ReappropriationModify', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.success(res.message + '..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    approveReAppropriation(reAppropriationTransactionId: number, remarks: string) {
        return this.http.post<any>(this.bantanUrl + `Allotment/ApproveReappropriation/${reAppropriationTransactionId}/${remarks}`, '').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.success(res.message + '..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    getSurrenderData() {
        return this.http.get<any>(this.bantanUrl + 'Allotment/getSurrenderAllotmentData').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    saveSurrender(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Allotment/SurrenderTransaction', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.success(res.message + '..!');
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    sendForRevision(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Allotment/SendForRevision', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    sendRequisition(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'Requisition', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    getUpperLevelUser(userLevel: number, userLevelLength: number, selectedDept: any) {
        if (userLevelLength == 1) {
            return this.getDemandData();
        } else {
            return this.http.get<any>(this.bantanUrl + 'SaoMaster/GetUpperLevelSaosByLevel/' + userLevel + '/' + selectedDept);
        }
    }

    getRequisitionData() {
        return this.http.get<any>(this.bantanUrl + 'Requisition/requisitions_for_me').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    rejectRequisition(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Requisition/reject', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    forwardRequisition(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Requisition/forward', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                }
            })
        );
    }

    approveAndSanctionRequisition(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'Requisition/approve', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    addToFavlist(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'FavList', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    // this.notify.success(res.message + '..!');
                } else if (res.apiResponseStatus == 2) {
                    // this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    // this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getFavList(payload: any) {
        return this.http.get<any>(this.bantanUrl + 'FavList?payload_type=' + payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getRequisitionDataByMe() {
        return this.http.get<any>(this.bantanUrl + 'Requisition/requisitions_by_me').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getMasterConfiguarationData() {
        return this.http.get<any>(this.bantanUrl + 'KeyValueMaster/' + 'goNo').pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    updateMasterConfigData(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'KeyValueMaster/' + 'goNo', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.toastr.success(res.message, 'Success', {
                        timeOut: 2000,
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.toastr.error(res.message, 'Error', {
                        timeOut: 2000,
                    });
                } else if (res.apiResponseStatus == 3) {
                    this.toastr.error(res.message, 'Error', {
                        timeOut: 2000,
                    });
                }
            })
        );
    }

    getAutoAllotmentHistory(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'RawAutoAllot/filter', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    createAutoAllotment(payload: any) {
        return this.http.put<any>(this.bantanUrl + 'RawAutoAllot', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getObjectAllotmentData(elmId: number) {
        return this.http.get<any>(this.bantanUrl + 'AutoAllotmentComment?AutoAllotmentId=' + elmId).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    getCreatedAutoAllotmentData(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'AutoAllotmentTransaction/filter', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    return res.result;
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }

    createObjectionOnAutoAllotment(payload: any) {
        return this.http.post<any>(this.bantanUrl + 'AutoAllotmentComment', payload).pipe(
            map((res: any) => {
                if (res.apiResponseStatus == 1) {
                    this.notify.successful(res.message + '..!').then((res) => {
                        if (res) {
                            window.location.reload();
                        }
                    });
                } else if (res.apiResponseStatus == 2) {
                    this.notify.alert(res.message + '..!');
                } else if (res.apiResponseStatus == 3) {
                    this.notify.error(res.message + '..!');
                }
            })
        );
    }
}
