import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistSanctionLetterManagementComponent } from './wb-budget-dist-sanction-letter-management.component';

describe('WbBudgetDistSanctionLetterManagementComponent', () => {
  let component: WbBudgetDistSanctionLetterManagementComponent;
  let fixture: ComponentFixture<WbBudgetDistSanctionLetterManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistSanctionLetterManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistSanctionLetterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
