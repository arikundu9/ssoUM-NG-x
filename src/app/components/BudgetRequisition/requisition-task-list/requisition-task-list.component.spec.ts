import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionTaskListComponent } from './requisition-task-list.component';

describe('RequisitionTaskListComponent', () => {
  let component: RequisitionTaskListComponent;
  let fixture: ComponentFixture<RequisitionTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisitionTaskListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
