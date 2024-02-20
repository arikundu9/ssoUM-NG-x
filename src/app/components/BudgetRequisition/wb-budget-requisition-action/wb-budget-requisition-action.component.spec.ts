import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetRequisitionActionComponent } from './wb-budget-requisition-action.component';

describe('WbBudgetRequisitionActionComponent', () => {
  let component: WbBudgetRequisitionActionComponent;
  let fixture: ComponentFixture<WbBudgetRequisitionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetRequisitionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetRequisitionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
