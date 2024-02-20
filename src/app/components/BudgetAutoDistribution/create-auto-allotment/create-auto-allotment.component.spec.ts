import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAutoAllotmentComponent } from './create-auto-allotment.component';

describe('CreateAutoAllotmentComponent', () => {
  let component: CreateAutoAllotmentComponent;
  let fixture: ComponentFixture<CreateAutoAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAutoAllotmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAutoAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
