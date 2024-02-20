import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistDraftManagementComponent } from './wb-budget-dist-draft-management.component';

describe('WbBudgetDistDraftManagementComponent', () => {
  let component: WbBudgetDistDraftManagementComponent;
  let fixture: ComponentFixture<WbBudgetDistDraftManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistDraftManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistDraftManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
