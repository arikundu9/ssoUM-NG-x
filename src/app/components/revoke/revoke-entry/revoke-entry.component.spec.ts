import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeEntryComponent } from './revoke-entry.component';

describe('RevokeEntryComponent', () => {
  let component: RevokeEntryComponent;
  let fixture: ComponentFixture<RevokeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevokeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
