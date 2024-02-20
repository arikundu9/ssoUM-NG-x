import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { CommonService } from './common.service';
import { dataHostBase, dataHost } from './dataHost.class';

@Injectable({
    providedIn: 'root',
})
export class dataService {
    MyAllotments: MyAllotmentsDH = new MyAllotmentsDH(this.commonService.getMyAllotments());
    constructor(private commonService: CommonService) {}
}

class MyAllotmentsDH extends dataHostBase<any> {
    override reload(): void {
        this._source.subscribe((res) => {
            this.subject.next(
                res.map((a: any) => {
                    a['FE_provisional_release'] = 0;
                    // a['FE_balCeilAmt'] = a['ceilingAmount'] - a['provisionalReleasedAmount']; //TODO: do all dynamic amount calculations here.
                    a['provisionalReleasedAmount'] = a['provisionalReleasedAmount'] + 0;
                    return a;
                })
            );
        });
    }
}
