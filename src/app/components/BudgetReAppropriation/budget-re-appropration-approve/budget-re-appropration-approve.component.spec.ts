import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReApproprationApproveComponent } from './budget-re-appropration-approve.component';

describe('BudgetReApproprationApproveComponent', () => {
  let component: BudgetReApproprationApproveComponent;
  let fixture: ComponentFixture<BudgetReApproprationApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetReApproprationApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetReApproprationApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
