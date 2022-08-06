import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneUserComponent } from './assigne-user.component';

describe('AssigneUserComponent', () => {
  let component: AssigneUserComponent;
  let fixture: ComponentFixture<AssigneUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigneUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
