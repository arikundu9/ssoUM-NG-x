import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistModifyComponent } from './wb-budget-dist-modify.component';

describe('WbBudgetDistModifyComponent', () => {
  let component: WbBudgetDistModifyComponent;
  let fixture: ComponentFixture<WbBudgetDistModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
