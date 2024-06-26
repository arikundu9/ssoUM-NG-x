/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KeysComponent } from './keys.component';

describe('KeysComponent', () => {
    let component: KeysComponent;
    let fixture: ComponentFixture<KeysComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [KeysComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KeysComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
