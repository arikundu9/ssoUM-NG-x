import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetRequisitionEntryComponent } from './wb-budget-requisition-entry.component';

describe('WbBudgetRequisitionEntryComponent', () => {
  let component: WbBudgetRequisitionEntryComponent;
  let fixture: ComponentFixture<WbBudgetRequisitionEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetRequisitionEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetRequisitionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
