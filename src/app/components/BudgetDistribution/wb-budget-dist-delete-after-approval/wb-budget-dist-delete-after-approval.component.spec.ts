import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistDeleteAfterApprovalComponent } from './wb-budget-dist-delete-after-approval.component';

describe('WbBudgetDistDeleteAfterApprovalComponent', () => {
  let component: WbBudgetDistDeleteAfterApprovalComponent;
  let fixture: ComponentFixture<WbBudgetDistDeleteAfterApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistDeleteAfterApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistDeleteAfterApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
