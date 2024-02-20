import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetDistEntryParentComponent } from './wb-budget-dist-entry-parent.component';

describe('WbBudgetDistEntryParentComponent', () => {
  let component: WbBudgetDistEntryParentComponent;
  let fixture: ComponentFixture<WbBudgetDistEntryParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetDistEntryParentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetDistEntryParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
