import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent } from './wb-budget-dist-entry-single-hoa-to-multi-rcvr-child.component';

describe('WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent', () => {
  let component: WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent;
  let fixture: ComponentFixture<WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistEntrySingleHoaToMultiRcvrChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
