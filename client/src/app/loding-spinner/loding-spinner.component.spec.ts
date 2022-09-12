import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodingSpinnerComponent } from './loding-spinner.component';

describe('LodingSpinnerComponent', () => {
  let component: LodingSpinnerComponent;
  let fixture: ComponentFixture<LodingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodingSpinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LodingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
