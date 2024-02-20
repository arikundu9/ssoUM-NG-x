import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSurrenderEntryComponent } from './budget-surrender-entry.component';

describe('BudgetSurrenderEntryComponent', () => {
    let component: BudgetSurrenderEntryComponent;
    let fixture: ComponentFixture<BudgetSurrenderEntryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BudgetSurrenderEntryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BudgetSurrenderEntryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
