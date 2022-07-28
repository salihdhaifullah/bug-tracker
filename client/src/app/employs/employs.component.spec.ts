import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploysComponent } from './employs.component';

describe('EmploysComponent', () => {
  let component: EmploysComponent;
  let fixture: ComponentFixture<EmploysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
