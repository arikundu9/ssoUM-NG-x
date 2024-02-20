import { CommonService } from '@S/common.service';
import { NotificationService } from '@S/notification.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as allEnum from '@C/common/enum';

@Component({
    selector: 'app-BasePage',
    templateUrl: './BasePage.component.html',
})
export class BaseComponent implements OnInit {
    baseForm: FormGroup = this.fb.group({

    });
    accordionStep: number = 0;
    constructor(public router: Router, public commonService: CommonService, public fb: FormBuilder, public notify: NotificationService, public datePipe: DatePipe) {}

    ngOnInit() {}

    setAccordionStep(index: number) {
        this.accordionStep = index;
    }

    nextAccordionStep() {
        this.accordionStep++;
    }

    prevAccordionStep() {
        this.accordionStep--;
    }
}
