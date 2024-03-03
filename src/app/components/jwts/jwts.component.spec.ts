/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JwtsComponent } from './jwts.component';

describe('JwtsComponent', () => {
    let component: JwtsComponent;
    let fixture: ComponentFixture<JwtsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JwtsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JwtsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
