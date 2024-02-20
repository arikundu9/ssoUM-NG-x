import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent } from './wb-budget-dist-entry-multi-hoa-to-single-rcvr-child.component';

describe('WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent', () => {
  let component: WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent;
  let fixture: ComponentFixture<WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistEntryMultiHoaToSingleRcvrChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
