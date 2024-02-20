import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistApproveComponent } from './wb-budget-dist-approve.component';

describe('WbBudgetDistApproveComponent', () => {
  let component: WbBudgetDistApproveComponent;
  let fixture: ComponentFixture<WbBudgetDistApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
