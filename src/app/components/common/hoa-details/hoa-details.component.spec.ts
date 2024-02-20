import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoaDetailsComponent } from './hoa-details.component';

describe('HoaDetailsComponent', () => {
  let component: HoaDetailsComponent;
  let fixture: ComponentFixture<HoaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoaDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
