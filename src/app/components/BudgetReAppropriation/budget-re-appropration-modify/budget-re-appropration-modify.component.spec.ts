import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReApproprationModifyComponent } from './budget-re-appropration-modify.component';

describe('BudgetReApproprationModifyComponent', () => {
  let component: BudgetReApproprationModifyComponent;
  let fixture: ComponentFixture<BudgetReApproprationModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetReApproprationModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetReApproprationModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
