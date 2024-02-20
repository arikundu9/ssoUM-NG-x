import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOnAutoAllotmentComponent } from './action-on-auto-allotment.component';

describe('ActionOnAutoAllotmentComponent', () => {
  let component: ActionOnAutoAllotmentComponent;
  let fixture: ComponentFixture<ActionOnAutoAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionOnAutoAllotmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionOnAutoAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
