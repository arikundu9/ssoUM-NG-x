import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbBudgetRedistEntryComponent } from './wb-budget-redist-entry.component';

describe('WbBudgetRedistEntryComponent', () => {
  let component: WbBudgetRedistEntryComponent;
  let fixture: ComponentFixture<WbBudgetRedistEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WbBudgetRedistEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WbBudgetRedistEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
